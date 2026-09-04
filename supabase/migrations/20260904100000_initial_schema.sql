create extension if not exists pgcrypto;

create type public.app_role as enum ('creator','brand','admin');
create type public.creator_status as enum ('draft','pending_review','more_information_required','approved','rejected','suspended');
create type public.mission_status as enum ('draft','submitted_for_review','changes_requested','approved','live','paused','completed','cancelled');
create type public.submission_status as enum ('submitted','under_review','changes_requested','approved','rejected','monitoring_performance','payout_eligible','paid');
create type public.metric_source as enum ('meta_api','manual_admin_review','creator_supplied','brand_supplied');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  role public.app_role not null,
  display_name text not null check (char_length(display_name) between 2 and 120),
  phone_e164 text check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  phone_verified_at timestamptz,
  suspended_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.creator_profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references public.profiles(id),
  legal_name text not null, display_name text not null check (char_length(display_name) between 2 and 120), instagram_username text not null unique, instagram_profile_url text not null,
  country char(2) not null, categories text[] not null default '{}', preferred_language text not null,
  follower_count bigint not null default 0 check (follower_count >= 0), average_reel_views bigint not null default 0 check (average_reel_views >= 0),
  status public.creator_status not null default 'draft', deleted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.creator_applications (
  id uuid primary key default gen_random_uuid(), creator_id uuid not null references public.creator_profiles(id),
  content_description text not null check (char_length(content_description) <= 700), follower_range text not null,
  terms_version text not null, privacy_version text not null, disclosure_version text not null,
  notification_consent_at timestamptz not null, submitted_at timestamptz not null default now()
);
create table public.creator_reviews (
  id uuid primary key default gen_random_uuid(), creator_id uuid not null references public.creator_profiles(id), reviewer_id uuid not null references public.profiles(id),
  decision public.creator_status not null, verification_method text, average_engagement numeric(8,4), audience_country char(2),
  content_quality text, brand_safety_assessment text, internal_risk_notes text, creator_visible_notes text,
  created_at timestamptz not null default now()
);
create table public.brand_organizations (
  id uuid primary key default gen_random_uuid(), name text not null, website text not null, country char(2) not null,
  verified_at timestamptz, suspended_at timestamptz, created_at timestamptz not null default now()
);
create table public.brand_members (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.brand_organizations(id),
  user_id uuid not null references public.profiles(id), member_role text not null check (member_role in ('owner','manager','analyst')),
  created_at timestamptz not null default now(), unique (organization_id,user_id)
);
create table public.brand_access_requests (
  id uuid primary key default gen_random_uuid(), contact_name text not null, job_title text not null, company_name text not null,
  company_website text not null, work_email text not null, phone_e164 text not null, country char(2) not null,
  estimated_budget text not null, campaign_objective text not null, message text,
  status text not null default 'pending_review' check (status in ('pending_review','more_information_required','approved','rejected','invited','activated','suspended')),
  internal_notes text, created_at timestamptz not null default now()
);
create table public.brand_invitations (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.brand_organizations(id),
  email text not null, token_hash text not null unique, expires_at timestamptz not null, accepted_at timestamptz, revoked_at timestamptz,
  idempotency_key text not null unique, invited_by uuid not null references public.profiles(id), created_at timestamptz not null default now()
);
create table public.missions (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.brand_organizations(id),
  brand_name text not null, brand_verified boolean not null default false, name text not null, objective text not null, category text not null,
  eligible_countries text[] not null, access_mode text not null check (access_mode in ('open','restricted')),
  visibility text not null check (visibility in ('public_summary','registered_creators','invited_creators_only')),
  participation_approval text not null check (participation_approval in ('automatic_for_eligible_approved_creators','admin_approval_required','brand_and_admin_approval_required')),
  placement_type text not null, placement_instructions text not null, required_visibility_seconds integer not null check (required_visibility_seconds > 0),
  creative_restrictions text not null default '', required_disclosure text not null,
  application_deadline timestamptz not null, publication_deadline timestamptz not null, measurement_deadline timestamptz not null,
  minimum_qualifying_views bigint not null check (minimum_qualifying_views >= 0), max_payout_minor bigint not null check (max_payout_minor >= 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'), capacity integer not null check (capacity > 0), reserved_slots integer not null default 0 check (reserved_slots >= 0 and reserved_slots <= capacity),
  status public.mission_status not null default 'draft', terms_version text not null, deleted_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (application_deadline <= publication_deadline and publication_deadline <= measurement_deadline)
);
create table public.mission_financials (
  mission_id uuid primary key references public.missions(id) on delete cascade,
  budget_minor bigint not null check (budget_minor >= 0),
  committed_budget_minor bigint not null default 0 check (committed_budget_minor >= 0 and committed_budget_minor <= budget_minor),
  updated_at timestamptz not null default now()
);
create table public.mission_eligibility_rules (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id) on delete cascade,
  rule_type text not null, operator text not null, value jsonb not null, created_at timestamptz not null default now()
);
create table public.mission_payout_tiers (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id) on delete cascade,
  views bigint not null check (views > 0), amount_minor bigint not null check (amount_minor >= 0),
  created_at timestamptz not null default now(), unique(mission_id,views)
);
create table public.mission_creator_permissions (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id) on delete cascade,
  creator_id uuid not null references public.creator_profiles(id), approved_by_brand_at timestamptz, approved_by_admin_at timestamptz,
  revoked_at timestamptz, created_at timestamptz not null default now(), unique(mission_id,creator_id)
);
create table public.mission_applications (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id), creator_id uuid not null references public.creator_profiles(id),
  status text not null check (status in ('pending','approved','rejected','withdrawn')),
  reserved_payout_minor bigint not null default 0 check (reserved_payout_minor >= 0), created_at timestamptz not null default now(), unique(mission_id,creator_id)
);
create table public.mission_term_acceptances (
  id uuid primary key default gen_random_uuid(), mission_id uuid not null references public.missions(id), creator_id uuid not null references public.creator_profiles(id),
  terms_version text not null, accepted_at timestamptz not null default now(), unique(mission_id,creator_id,terms_version)
);
create table public.creator_submissions (
  id uuid primary key default gen_random_uuid(), creator_id uuid not null references public.creator_profiles(id), mission_id uuid not null references public.missions(id),
  reel_url text not null unique, publication_date date not null, caption text not null check (char_length(caption) <= 2200), creator_notes text,
  disclosure_confirmed boolean not null, status public.submission_status not null default 'submitted',
  views bigint not null default 0 check (views >= 0), metric_source public.metric_source not null default 'creator_supplied',
  payout_eligible_minor bigint not null default 0 check (payout_eligible_minor >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.submission_reviews (
  id uuid primary key default gen_random_uuid(), submission_id uuid not null references public.creator_submissions(id), reviewer_id uuid not null references public.profiles(id),
  placement_verified boolean not null, disclosure_verified boolean not null, placement_duration_seconds integer not null check (placement_duration_seconds >= 0),
  creator_visible_notes text, internal_notes text, created_at timestamptz not null default now()
);
create table public.performance_snapshots (
  id uuid primary key default gen_random_uuid(), submission_id uuid not null references public.creator_submissions(id),
  captured_at timestamptz not null default now(), views bigint not null check (views >= 0), reach bigint check (reach >= 0),
  engagement bigint check (engagement >= 0), source public.metric_source not null, external_reference text,
  unique(submission_id,captured_at,source)
);
create table public.payout_records (
  id uuid primary key default gen_random_uuid(), submission_id uuid not null unique references public.creator_submissions(id), creator_id uuid not null references public.creator_profiles(id),
  amount_minor bigint not null check (amount_minor >= 0), currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  status text not null check (status in ('pending','eligible','processing','paid','failed','cancelled')),
  external_transaction_reference text, paid_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(), profile_id uuid references public.profiles(id), provider text not null, template text not null,
  destination_redacted text not null, status text not null check (status in ('queued','sending','sent','failed','cancelled')),
  attempt_count integer not null default 0 check (attempt_count >= 0), last_attempt_at timestamptz, provider_reference text,
  failure_category text, idempotency_key text not null unique, created_at timestamptz not null default now()
);
create table public.uploaded_files (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id), bucket text not null,
  object_path text not null unique, mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  byte_size bigint not null check (byte_size between 1 and 5000000), scan_status text not null default 'pending' check (scan_status in ('pending','clean','rejected')),
  created_at timestamptz not null default now()
);
create table public.status_history (
  id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid not null, from_status text, to_status text not null,
  actor_id uuid references public.profiles(id), reason text, created_at timestamptz not null default now()
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id), actor_role text not null,
  action text not null, entity_type text not null, entity_id uuid not null, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);

create index creator_profiles_status_idx on public.creator_profiles(status);
create index creator_profiles_user_idx on public.creator_profiles(user_id);
create index brand_members_user_idx on public.brand_members(user_id);
create index brand_members_org_idx on public.brand_members(organization_id);
create index missions_org_status_idx on public.missions(organization_id,status);
create index missions_filters_idx on public.missions(status,access_mode,publication_deadline,category);
create index mission_permissions_creator_idx on public.mission_creator_permissions(creator_id,mission_id) where revoked_at is null;
create index mission_applications_creator_idx on public.mission_applications(creator_id,status);
create index creator_submissions_creator_idx on public.creator_submissions(creator_id,status);
create index creator_submissions_mission_idx on public.creator_submissions(mission_id,status);
create index performance_snapshots_submission_idx on public.performance_snapshots(submission_id,captured_at desc);
create index payout_records_creator_idx on public.payout_records(creator_id,status);
create index notifications_retry_idx on public.notifications(status,last_attempt_at) where status in ('queued','failed');
create index audit_events_entity_idx on public.audit_events(entity_type,entity_id,created_at desc);
create unique index payout_records_external_reference_idx on public.payout_records(external_transaction_reference) where external_transaction_reference is not null;

create or replace function public.current_app_role() returns public.app_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = auth.uid() and suspended_at is null
$$;
create or replace function public.current_creator_id() returns uuid language sql stable security definer set search_path = '' as $$
  select id from public.creator_profiles where user_id = auth.uid() and deleted_at is null
$$;
create or replace function public.is_org_member(target_org uuid) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.brand_members where user_id = auth.uid() and organization_id = target_org)
$$;

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.creator_applications enable row level security;
alter table public.creator_reviews enable row level security;
alter table public.brand_organizations enable row level security;
alter table public.brand_members enable row level security;
alter table public.brand_access_requests enable row level security;
alter table public.brand_invitations enable row level security;
alter table public.missions enable row level security;
alter table public.mission_financials enable row level security;
alter table public.mission_eligibility_rules enable row level security;
alter table public.mission_payout_tiers enable row level security;
alter table public.mission_creator_permissions enable row level security;
alter table public.mission_applications enable row level security;
alter table public.mission_term_acceptances enable row level security;
alter table public.creator_submissions enable row level security;
alter table public.submission_reviews enable row level security;
alter table public.performance_snapshots enable row level security;
alter table public.payout_records enable row level security;
alter table public.notifications enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.status_history enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_self_read on public.profiles for select using (id = auth.uid() or public.current_app_role() = 'admin');
create policy creator_profile_self_read on public.creator_profiles for select using (user_id = auth.uid() or public.current_app_role() = 'admin');
create policy creator_application_self_read on public.creator_applications for select using (creator_id = public.current_creator_id() or public.current_app_role() = 'admin');
create policy creator_reviews_admin_all on public.creator_reviews for all using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy brand_org_member_read on public.brand_organizations for select using (public.is_org_member(id) or public.current_app_role() = 'admin');
create policy brand_members_org_read on public.brand_members for select using (public.is_org_member(organization_id) or public.current_app_role() = 'admin');
create policy brand_access_admin_read on public.brand_access_requests for select using (public.current_app_role() = 'admin');
create policy brand_invitation_admin_all on public.brand_invitations for all using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy missions_public_or_authorized_read on public.missions for select using (
  deleted_at is null and (
    public.current_app_role() = 'admin' or public.is_org_member(organization_id) or
    (status = 'live' and (
      visibility = 'public_summary' or
      (visibility = 'registered_creators' and public.current_app_role() = 'creator') or
      (visibility = 'invited_creators_only' and exists(select 1 from public.mission_creator_permissions p where p.mission_id = id and p.creator_id = public.current_creator_id() and p.revoked_at is null and p.approved_by_admin_at is not null))
    ))
  )
);
create policy missions_brand_insert on public.missions for insert with check (public.is_org_member(organization_id) and status in ('draft','submitted_for_review'));
create policy missions_brand_update_draft on public.missions for update using (public.is_org_member(organization_id) and status in ('draft','changes_requested')) with check (public.is_org_member(organization_id) and status in ('draft','submitted_for_review'));
create policy missions_admin_all on public.missions for all using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy mission_financials_brand_or_admin_read on public.mission_financials for select using (
  public.current_app_role() = 'admin' or exists(select 1 from public.missions m where m.id = mission_id and public.is_org_member(m.organization_id))
);
create policy mission_rules_visible on public.mission_eligibility_rules for select using (exists(select 1 from public.missions m where m.id = mission_id));
create policy payout_tiers_visible on public.mission_payout_tiers for select using (exists(select 1 from public.missions m where m.id = mission_id));
create policy permissions_creator_or_admin on public.mission_creator_permissions for select using (creator_id = public.current_creator_id() or public.current_app_role() = 'admin' or exists(select 1 from public.missions m where m.id = mission_id and public.is_org_member(m.organization_id)));
create policy mission_apps_self_read on public.mission_applications for select using (creator_id = public.current_creator_id() or public.current_app_role() = 'admin' or exists(select 1 from public.missions m where m.id = mission_id and public.is_org_member(m.organization_id)));
create policy terms_self_read on public.mission_term_acceptances for select using (creator_id = public.current_creator_id() or public.current_app_role() = 'admin');
create policy submissions_self_or_org_read on public.creator_submissions for select using (creator_id = public.current_creator_id() or public.current_app_role() = 'admin' or exists(select 1 from public.missions m where m.id = mission_id and public.is_org_member(m.organization_id)));
create policy reviews_admin_all on public.submission_reviews for all using (public.current_app_role() = 'admin') with check (public.current_app_role() = 'admin');
create policy snapshots_authorized_read on public.performance_snapshots for select using (exists(select 1 from public.creator_submissions s where s.id = submission_id));
create policy payouts_self_read on public.payout_records for select using (creator_id = public.current_creator_id() or public.current_app_role() = 'admin');
create policy notifications_self_read on public.notifications for select using (profile_id = auth.uid() or public.current_app_role() = 'admin');
create policy files_self_read on public.uploaded_files for select using (owner_id = auth.uid() or public.current_app_role() = 'admin');
create policy status_history_admin_read on public.status_history for select using (public.current_app_role() = 'admin');
create policy audit_admin_read on public.audit_events for select using (public.current_app_role() = 'admin');

create or replace function public.reserve_mission_slot(target_mission uuid, accepted_terms text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare selected public.missions; finances public.mission_financials; creator public.creator_profiles; application_id uuid; application_status text;
begin
  if public.current_app_role() <> 'creator' or public.current_creator_id() is null then raise exception 'not_authorized'; end if;
  select * into selected from public.missions where id = target_mission for update;
  if not found or selected.status <> 'live' or selected.application_deadline <= now() then raise exception 'mission_unavailable'; end if;
  select * into creator from public.creator_profiles where id = public.current_creator_id() and deleted_at is null for update;
  if not found or creator.status <> 'approved' then raise exception 'creator_not_approved'; end if;
  if not (creator.country = any(selected.eligible_countries)) or not (selected.category = any(creator.categories)) or creator.average_reel_views < ceil(selected.minimum_qualifying_views * 0.25) then raise exception 'creator_not_eligible'; end if;
  if selected.access_mode = 'restricted' and not exists(
    select 1 from public.mission_creator_permissions p
    where p.mission_id = target_mission and p.creator_id = creator.id and p.revoked_at is null and p.approved_by_admin_at is not null
      and (selected.participation_approval <> 'brand_and_admin_approval_required' or p.approved_by_brand_at is not null)
  ) then raise exception 'mission_not_permitted'; end if;
  if selected.terms_version <> accepted_terms then raise exception 'terms_outdated'; end if;
  insert into public.mission_term_acceptances(mission_id,creator_id,terms_version) values(target_mission,creator.id,accepted_terms) on conflict do nothing;
  application_status := case when selected.participation_approval = 'automatic_for_eligible_approved_creators' then 'approved' else 'pending' end;
  if application_status = 'approved' then
    select * into finances from public.mission_financials where mission_id = target_mission for update;
    if not found then raise exception 'mission_finances_unavailable'; end if;
    if selected.reserved_slots >= selected.capacity then raise exception 'capacity_exhausted'; end if;
    if finances.committed_budget_minor + selected.max_payout_minor > finances.budget_minor then raise exception 'budget_exhausted'; end if;
  end if;
  insert into public.mission_applications(mission_id,creator_id,status,reserved_payout_minor)
    values(target_mission,creator.id,application_status,case when application_status = 'approved' then selected.max_payout_minor else 0 end)
    returning id into application_id;
  if application_status = 'approved' then
    update public.missions set reserved_slots = reserved_slots + 1, updated_at = now() where id = target_mission;
    update public.mission_financials set committed_budget_minor = committed_budget_minor + selected.max_payout_minor, updated_at = now() where mission_id = target_mission;
  end if;
  return application_id;
end $$;
revoke all on function public.reserve_mission_slot(uuid,text) from public;
grant execute on function public.reserve_mission_slot(uuid,text) to authenticated;

create or replace function public.perform_admin_action(target_type text, target_id uuid, target_action text, action_reason text default null, verified_views bigint default null, payment_reference text default null)
returns text language plpgsql security definer set search_path = '' as $$
declare previous_status text; next_status text; affected integer; payout_amount bigint; submission_creator uuid; submission_mission uuid;
begin
  if public.current_app_role() <> 'admin' or coalesce(auth.jwt()->>'aal','') <> 'aal2' then raise exception 'mfa_required'; end if;

  if target_type = 'creator' then
    select status::text into previous_status from public.creator_profiles where id = target_id for update;
    if not found then raise exception 'creator_not_found'; end if;
    if target_action = 'approve' and previous_status in ('pending_review','more_information_required') then next_status := 'approved';
    elsif target_action = 'reject' and previous_status in ('pending_review','more_information_required') then next_status := 'rejected';
    elsif target_action = 'request_information' and previous_status = 'pending_review' then next_status := 'more_information_required';
    elsif target_action = 'suspend' and previous_status = 'approved' then next_status := 'suspended';
    elsif target_action = 'restore' and previous_status = 'suspended' then next_status := 'approved';
    else raise exception 'invalid_creator_transition'; end if;
    update public.creator_profiles set status = next_status::public.creator_status, updated_at = now() where id = target_id;
  elsif target_type = 'mission' then
    select status::text into previous_status from public.missions where id = target_id for update;
    if not found then raise exception 'mission_not_found'; end if;
    if target_action = 'approve' and previous_status in ('submitted_for_review','changes_requested') then next_status := 'approved';
    elsif target_action = 'reject' and previous_status in ('submitted_for_review','changes_requested','approved') then next_status := 'cancelled';
    elsif target_action = 'publish' and previous_status = 'approved' then next_status := 'live';
    elsif target_action = 'pause' and previous_status = 'live' then next_status := 'paused';
    else raise exception 'invalid_mission_transition'; end if;
    update public.missions set status = next_status::public.mission_status, updated_at = now() where id = target_id;
  elsif target_type = 'submission' then
    select status::text, creator_id, mission_id into previous_status, submission_creator, submission_mission from public.creator_submissions where id = target_id for update;
    if not found then raise exception 'submission_not_found'; end if;
    if target_action = 'approve' and previous_status in ('submitted','under_review','changes_requested') then
      next_status := 'approved';
      update public.creator_submissions set status = 'approved', updated_at = now() where id = target_id;
    elsif target_action = 'reject' and previous_status in ('submitted','under_review','changes_requested') then
      next_status := 'rejected';
      update public.creator_submissions set status = 'rejected', updated_at = now() where id = target_id;
    elsif target_action = 'mark_payout_eligible' and previous_status in ('approved','monitoring_performance') then
      if verified_views is null or verified_views < 0 then raise exception 'verified_views_required'; end if;
      select amount_minor into payout_amount from public.mission_payout_tiers where mission_id = submission_mission and views <= verified_views order by views desc limit 1;
      if payout_amount is null or payout_amount <= 0 then raise exception 'payout_tier_not_met'; end if;
      next_status := 'payout_eligible';
      update public.creator_submissions set status = 'payout_eligible', views = verified_views, payout_eligible_minor = payout_amount, metric_source = 'manual_admin_review', updated_at = now() where id = target_id;
      insert into public.payout_records(submission_id,creator_id,amount_minor,currency,status)
        select target_id, submission_creator, payout_amount, m.currency, 'eligible' from public.missions m where m.id = submission_mission
        on conflict (submission_id) do update set amount_minor = excluded.amount_minor, status = 'eligible', updated_at = now()
        where public.payout_records.status in ('pending','eligible','failed');
    elsif target_action = 'mark_paid' and previous_status = 'payout_eligible' then
      if payment_reference is null or char_length(trim(payment_reference)) < 4 then raise exception 'payment_reference_required'; end if;
      update public.payout_records set status = 'paid', external_transaction_reference = trim(payment_reference), paid_at = now(), updated_at = now()
        where submission_id = target_id and status = 'eligible';
      get diagnostics affected = row_count;
      if affected <> 1 then raise exception 'payout_not_eligible'; end if;
      next_status := 'paid';
      update public.creator_submissions set status = 'paid', updated_at = now() where id = target_id;
    else raise exception 'invalid_submission_transition'; end if;
  else
    raise exception 'invalid_entity_type';
  end if;

  insert into public.status_history(entity_type,entity_id,from_status,to_status,actor_id,reason) values(target_type,target_id,previous_status,next_status,auth.uid(),action_reason);
  insert into public.audit_events(actor_id,actor_role,action,entity_type,entity_id) values(auth.uid(),'admin',target_type || '.' || target_action,target_type,target_id);
  return next_status;
end $$;
revoke all on function public.perform_admin_action(text,uuid,text,text,bigint,text) from public;
grant execute on function public.perform_admin_action(text,uuid,text,text,bigint,text) to authenticated;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.missions, public.mission_eligibility_rules, public.mission_payout_tiers to anon;
grant select on all tables in schema public to authenticated;
revoke execute on function public.current_app_role() from public;
revoke execute on function public.current_creator_id() from public;
revoke execute on function public.is_org_member(uuid) from public;
grant execute on function public.current_app_role(), public.current_creator_id(), public.is_org_member(uuid) to anon, authenticated;
