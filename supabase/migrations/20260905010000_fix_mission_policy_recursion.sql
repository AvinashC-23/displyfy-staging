create or replace function public.is_current_user_mission_org_member(target_mission uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1
    from public.missions m
    join public.brand_members bm on bm.organization_id = m.organization_id
    where m.id = target_mission and bm.user_id = auth.uid()
  )
$$;

create or replace function public.has_current_creator_mission_permission(target_mission uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(
    select 1
    from public.mission_creator_permissions p
    join public.missions m on m.id = p.mission_id
    where p.mission_id = target_mission
      and p.creator_id = public.current_creator_id()
      and p.revoked_at is null
      and p.approved_by_admin_at is not null
      and (m.participation_approval <> 'brand_and_admin_approval_required' or p.approved_by_brand_at is not null)
  )
$$;

revoke all on function public.is_current_user_mission_org_member(uuid) from public;
revoke all on function public.has_current_creator_mission_permission(uuid) from public;
grant execute on function public.is_current_user_mission_org_member(uuid), public.has_current_creator_mission_permission(uuid) to anon, authenticated;

drop policy missions_public_or_authorized_read on public.missions;
create policy missions_public_or_authorized_read on public.missions for select using (
  deleted_at is null and (
    public.current_app_role() = 'admin' or public.is_org_member(organization_id) or
    (status = 'live' and (
      visibility = 'public_summary' or
      (visibility = 'registered_creators' and public.current_app_role() = 'creator') or
      (visibility = 'invited_creators_only' and public.has_current_creator_mission_permission(id))
    ))
  )
);

drop policy mission_financials_brand_or_admin_read on public.mission_financials;
create policy mission_financials_brand_or_admin_read on public.mission_financials for select using (
  public.current_app_role() = 'admin' or public.is_current_user_mission_org_member(mission_id)
);

drop policy permissions_creator_or_admin on public.mission_creator_permissions;
create policy permissions_creator_or_admin on public.mission_creator_permissions for select using (
  creator_id = public.current_creator_id() or public.current_app_role() = 'admin' or public.is_current_user_mission_org_member(mission_id)
);

drop policy mission_apps_self_read on public.mission_applications;
create policy mission_apps_self_read on public.mission_applications for select using (
  creator_id = public.current_creator_id() or public.current_app_role() = 'admin' or public.is_current_user_mission_org_member(mission_id)
);

drop policy submissions_self_or_org_read on public.creator_submissions;
create policy submissions_self_or_org_read on public.creator_submissions for select using (
  creator_id = public.current_creator_id() or public.current_app_role() = 'admin' or public.is_current_user_mission_org_member(mission_id)
);
