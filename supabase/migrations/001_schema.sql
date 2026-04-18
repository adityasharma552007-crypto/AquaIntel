-- ==========================================
-- AQUAINTEL MASTER SCHEMA definition
-- Completely unified tables resolving all IoT, Profile, and Authority needs.
-- ==========================================

-- 1. PROFILES
create table public.profiles (
  id            uuid references auth.users primary key,
  full_name     text,
  phone         text,
  city          text default 'Jaipur',
  area          text,
  pod_id        text,
  total_scans   int default 0,
  safe_scans    int default 0,
  created_at    timestamptz default now()
);

-- 2. IOT DEVICES
CREATE TABLE public.iot_devices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_id text UNIQUE NOT NULL,
  display_name text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- 3. WATER DATA (Master central scans mapping)
CREATE TABLE public.water_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid references public.profiles(id) ON DELETE CASCADE,
  device_id text,
  
  -- Spectral Array (14-channel AS7343 format compatible)
  f1 real, f2 real, f3 real, f4 real,
  f5 real, f6 real, f7 real, f8 real,
  fz real, fy real, fxl real, nir real, clear real,
  
  -- Result Analysis
  quality real,                -- e.g. continuous score metric
  status text,                 -- e.g. descriptive status
  safety_score int,            -- 0-100 score integer mapped in mobile
  result_tier text,            -- safe, warning, danger, hazard
  ai_confidence real,          -- Prediction reliability
  scan_duration real,          -- duration of scan event
  recommendation text,         -- string representing action limit
  
  -- Contaminant array stored as JSON object dynamically
  adulterants jsonb,           
  wavelength_data jsonb,
  
  -- Physical verification maps
  tx_hash text,
  latitude real,
  longitude real,
  location_name text,
  
  created_at timestamptz DEFAULT now()
);

-- 4. IOT TEST SESSIONS (Payload archival and diagnostics)
CREATE TABLE public.iot_test_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE restrict,
  device_id text,
  scan_id uuid REFERENCES public.water_data(id) ON DELETE CASCADE,
  raw_payload jsonb,
  duration_ms int,
  completed_at timestamptz DEFAULT now()
);

-- 5. REPORTS / COMPLAINTS
create table public.water_authority_reports (
  id               uuid primary key default gen_random_uuid(),
  scan_id          uuid references public.water_data(id) on delete cascade,
  user_id          uuid references public.profiles(id),
  complaint_ref    text unique,
  status           text default 'submitted',
  auto_triggered   boolean default false,
  notes            text,
  created_at       timestamptz default now()
);

-- ==========================================
-- AUTOMATION & TRIGGERS
-- ==========================================

-- AUTO PROFILE CREATION
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id, 
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name',
      'AquaIntel User'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ACTION: RPC to increment scans
create or replace function public.increment_user_scans(
  p_user_id uuid,
  p_is_safe boolean
) returns void as $$
begin
  update public.profiles
  set
    total_scans = total_scans + 1,
    safe_scans = safe_scans + (case when p_is_safe then 1 else 0 end)
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- AUTO FLAG WATER COMPLAINT ON HAZARD
create or replace function public.auto_water_report()
returns trigger as $$
begin
  if new.result_tier = 'danger' or new.result_tier = 'hazard' or new.status = 'Contaminated' then
    insert into public.water_authority_reports
      (scan_id, user_id, auto_triggered, complaint_ref)
    values (
      new.id, new.user_id, true,
      'AQ-' || to_char(now(),'YYYYMMDD') || '-' 
      || lpad(floor(random()*99999)::text, 5, '0')
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_contaminated_scan on public.water_data;
create trigger on_contaminated_scan
  after insert on public.water_data
  for each row execute procedure public.auto_water_report();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table public.profiles enable row level security;
alter table public.water_data enable row level security;
alter table public.water_authority_reports enable row level security;
alter table public.iot_devices enable row level security;
alter table public.iot_test_sessions enable row level security;

-- Profiles: Own view
create policy "own profile" on public.profiles
  for all using (auth.uid() = id);

-- Water Data: Public select to allow Maps and Community lists
create policy "Allow public insert"
  ON public.water_data FOR INSERT WITH CHECK (true);
create policy "Allow public select"
  ON public.water_data FOR SELECT USING (true);

-- Authority Reports: Owner only
create policy "own reports" on public.water_authority_reports
  for all using (auth.uid() = user_id);

-- IoT devices
create policy "manage own IoT devices" ON public.iot_devices
  FOR ALL USING (auth.uid() = user_id);

create policy "read own IoT sessions" ON public.iot_test_sessions
  FOR SELECT USING (auth.uid() = user_id);

create policy "Allow insert sessions" on public.iot_test_sessions
  FOR INSERT WITH CHECK (true);

-- Enable Realtime for Map / Frontend Hooks
ALTER TABLE public.water_data REPLICA IDENTITY FULL;
