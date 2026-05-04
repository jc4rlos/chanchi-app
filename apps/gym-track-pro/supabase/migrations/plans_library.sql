-- Plans library: reusable plan templates + week assignments

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  is_rest_day boolean not null default false,
  unique (plan_id, day_of_week)
);

create table if not exists plan_day_routines (
  id uuid primary key default gen_random_uuid(),
  plan_day_id uuid not null references plan_days(id) on delete cascade,
  routine_id uuid not null references routines(id) on delete cascade
);

create table if not exists plan_week_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references plans(id) on delete cascade,
  week_number int not null,
  year int not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_number, year)
);

-- RLS
alter table plans enable row level security;
alter table plan_days enable row level security;
alter table plan_day_routines enable row level security;
alter table plan_week_assignments enable row level security;

create policy "plans: own rows" on plans
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "plan_days: own via plan" on plan_days
  using (plan_id in (select id from plans where user_id = auth.uid()))
  with check (plan_id in (select id from plans where user_id = auth.uid()));

create policy "plan_day_routines: own via plan" on plan_day_routines
  using (plan_day_id in (
    select pd.id from plan_days pd
    join plans p on p.id = pd.plan_id
    where p.user_id = auth.uid()
  ))
  with check (plan_day_id in (
    select pd.id from plan_days pd
    join plans p on p.id = pd.plan_id
    where p.user_id = auth.uid()
  ));

create policy "plan_week_assignments: own rows" on plan_week_assignments
  using (user_id = auth.uid()) with check (user_id = auth.uid());
