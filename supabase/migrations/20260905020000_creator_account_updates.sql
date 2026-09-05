create or replace function public.update_creator_account(
  p_legal_name text,
  p_display_name text,
  p_phone_e164 text,
  p_instagram_username text,
  p_instagram_profile_url text,
  p_country text,
  p_categories text[],
  p_preferred_language text,
  p_follower_count bigint,
  p_average_reel_views bigint
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_creator uuid;
begin
  if auth.uid() is null or public.current_app_role() <> 'creator' then
    raise exception 'not_authorized';
  end if;

  select id into target_creator
  from public.creator_profiles
  where user_id = auth.uid() and deleted_at is null
  for update;

  if target_creator is null then raise exception 'creator_not_found'; end if;
  if p_legal_name is null or p_display_name is null or p_phone_e164 is null
    or p_instagram_username is null or p_instagram_profile_url is null or p_country is null
    or p_categories is null or p_preferred_language is null or p_follower_count is null
    or p_average_reel_views is null
    or char_length(trim(p_legal_name)) not between 2 and 120
    or char_length(trim(p_display_name)) not between 2 and 80
    or p_phone_e164 !~ '^\+[1-9][0-9]{7,14}$'
    or p_instagram_username !~ '^[A-Za-z0-9._]{1,30}$'
    or p_instagram_profile_url !~ '^https://(www\.)?instagram\.com/'
    or p_country not in ('US','IN','GB','CA','AU','AE','SG')
    or cardinality(p_categories) not between 1 and 5
    or not p_categories <@ array['lifestyle','fashion','beauty','fitness','food','tech','home','travel','business']::text[]
    or char_length(trim(p_preferred_language)) not between 2 and 40
    or p_follower_count not between 0 and 2000000000
    or p_average_reel_views not between 0 and 500000000 then
    raise exception 'invalid_profile';
  end if;

  update public.profiles
  set display_name = trim(p_display_name), phone_e164 = p_phone_e164, updated_at = now()
  where id = auth.uid();

  update public.creator_profiles
  set legal_name = trim(p_legal_name), display_name = trim(p_display_name),
      instagram_username = lower(p_instagram_username), instagram_profile_url = p_instagram_profile_url,
      country = p_country::char(2), categories = p_categories,
      preferred_language = trim(p_preferred_language), follower_count = p_follower_count,
      average_reel_views = p_average_reel_views, updated_at = now()
  where id = target_creator;

  insert into public.audit_events(actor_id, actor_role, action, entity_type, entity_id)
  values (auth.uid(), 'creator', 'creator.profile_updated', 'creator_profile', target_creator);
end;
$$;

revoke all on function public.update_creator_account(text,text,text,text,text,text,text[],text,bigint,bigint) from public;
grant execute on function public.update_creator_account(text,text,text,text,text,text,text[],text,bigint,bigint) to authenticated;
