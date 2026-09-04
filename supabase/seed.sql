do $$
begin
  if current_setting('app.environment', true) = 'production' and current_setting('app.allow_production_seed', true) <> 'true' then
    raise exception 'Development seed refused in production';
  end if;
end $$;

insert into public.brand_organizations (id,name,website,country,verified_at) values
('d45d8838-65a9-4bdc-8b45-2bd3ef7aadf7','Northline Goods','https://example.com','US',now());

insert into public.brand_access_requests (id,contact_name,job_title,company_name,company_website,work_email,phone_e164,country,estimated_budget,campaign_objective,status)
values ('bd42a6db-d5c7-49ec-ae9d-150a74bd5085','Taylor Morgan','Marketing Lead','Bright Pantry','https://example.org','taylor@example.org','+14155552671','US','5k-25k','Test creator-native product visibility.','pending_review');

insert into public.missions (id,organization_id,brand_name,brand_verified,name,objective,category,eligible_countries,access_mode,visibility,participation_approval,placement_type,placement_instructions,required_visibility_seconds,creative_restrictions,required_disclosure,application_deadline,publication_deadline,measurement_deadline,minimum_qualifying_views,max_payout_minor,currency,capacity,reserved_slots,status,terms_version) values
('7fa93180-4c69-40f2-8984-7a3f28506b3a','d45d8838-65a9-4bdc-8b45-2bd3ef7aadf7','Northline Goods',true,'Desk object placement for launch week','Place a branded ceramic mug naturally inside workspace and routine reels.','lifestyle',array['US','CA','GB'],'open','public_summary','automatic_for_eligible_approved_creators','Physical product in frame','Mug visible for eight seconds.',8,'No competitor drinkware.','#ad',now()+interval '10 days',now()+interval '17 days',now()+interval '31 days',5000,27500,'USD',40,0,'live','2026-09-04'),
('97f54005-fb9e-4ef2-a734-9643442cdb42','d45d8838-65a9-4bdc-8b45-2bd3ef7aadf7','Northline Goods',true,'Restricted apparel visibility test','Limited capsule visibility test.','fashion',array['US','GB'],'restricted','invited_creators_only','brand_and_admin_approval_required','Creator wearing branded item','Logo visible in three shots.',12,'No competitor apparel.','Paid partnership',now()+interval '10 days',now()+interval '20 days',now()+interval '34 days',10000,65000,'USD',10,0,'approved','2026-09-04'),
('a76c0dc8-0b47-4736-91cb-3e9cdf336772','d45d8838-65a9-4bdc-8b45-2bd3ef7aadf7','Northline Goods',true,'Background product shelf trial','Draft mission.','food',array['US'],'open','registered_creators','admin_approval_required','Product in background','Product visible in kitchen b-roll.',6,'No unsupported claims.','#ad',now()+interval '10 days',now()+interval '20 days',now()+interval '34 days',3000,20000,'USD',25,0,'draft','2026-09-04');

insert into public.mission_financials (mission_id,budget_minor,committed_budget_minor) values
('7fa93180-4c69-40f2-8984-7a3f28506b3a',1100000,0),
('97f54005-fb9e-4ef2-a734-9643442cdb42',650000,0),
('a76c0dc8-0b47-4736-91cb-3e9cdf336772',500000,0);
