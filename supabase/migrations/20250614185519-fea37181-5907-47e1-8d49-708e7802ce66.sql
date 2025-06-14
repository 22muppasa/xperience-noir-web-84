
-- 1. Profiles Table to store user info and roles (admin/customer)
create table public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('admin', 'customer')), -- simple admin/customer
  created_at timestamp with time zone not null default now()
);

-- Insert a RLS policy: only users can select/update their own profile, admin can select all
alter table public.profiles enable row level security;

create policy "Users view own profile, admins view all"
  on public.profiles
  for select
  using (
    auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Users update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- 2. Camp Programs and Program Categories
create table public.program_categories (
  id bigserial primary key,
  name text not null,
  description text
);

create table public.programs (
  id bigserial primary key,
  title text not null,
  description text,
  category_id bigint references public.program_categories(id),
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

-- 3. Program Registrations
create table public.program_registrations (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  program_id bigint not null references public.programs(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique (user_id, program_id)
);

-- 4. Kids Work (uploads of media/content)
create table public.kids_work (
  id bigserial primary key,
  uploaded_by uuid references public.profiles(id), -- admin or customer (parent)
  assigned_to uuid references public.profiles(id), -- the customer the work is for
  title text,
  description text,
  media_url text, -- will contain the file storage URL
  uploaded_at timestamp with time zone default now()
);

-- 5. Kids Work Comments (feedback)
create table public.kids_work_comments (
  id bigserial primary key,
  kids_work_id bigint not null references public.kids_work(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  comment text not null,
  created_at timestamp with time zone default now()
);

-- 6. Contact Messages (from contact form)
create table public.contact_messages (
  id bigserial primary key,
  sender_id uuid references public.profiles(id),
  name text,
  email text,
  message text not null,
  created_at timestamp with time zone default now()
);

-- 7. Social Posts (for Social Hub)
create table public.social_posts (
  id bigserial primary key,
  created_by uuid references public.profiles(id),
  title text,
  content text,
  media_url text,
  created_at timestamp with time zone default now()
);

-- 8. Messaging System: Email-like direct and group messages
create table public.messages (
  id bigserial primary key,
  sender_id uuid not null references public.profiles(id),
  recipient_id uuid, -- for direct message
  group_id bigint, -- for group messages
  subject text,
  body text not null,
  created_at timestamp with time zone default now(),
  is_read boolean default false
);

-- 9. Message Groups
create table public.message_groups (
  id bigserial primary key,
  name text not null,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now()
);

create table public.group_members (
  id bigserial primary key,
  group_id bigint not null references public.message_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  unique (group_id, user_id)
);

-- 10. Notifications
create table public.notifications (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  link text,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- RLS: Apply similar policies as with profiles for all tables involving user data.
alter table public.program_registrations enable row level security;
create policy "Users see their own program registrations, admin see all"
  on public.program_registrations
  for select
  using (
    user_id = auth.uid() or (select role from public.profiles where id = auth.uid()) = 'admin'
  );

alter table public.kids_work enable row level security;
create policy "Customers and admins see work assigned to them or uploaded by them"
  on public.kids_work
  for select
  using (
    assigned_to = auth.uid() or uploaded_by = auth.uid() or (select role from public.profiles where id = auth.uid()) = 'admin'
  );

alter table public.kids_work_comments enable row level security;
create policy "Users can read and comment on kids work they are involved with"
  on public.kids_work_comments
  for select
  using (
    user_id = auth.uid() 
    or (select assigned_to from public.kids_work where id = kids_work_id) = auth.uid()
    or (select uploaded_by from public.kids_work where id = kids_work_id) = auth.uid()
    or (select role from public.profiles where id = auth.uid()) = 'admin'
  );
create policy "Users can add comments"
  on public.kids_work_comments
  for insert
  with check (
    user_id = auth.uid()
  );

alter table public.messages enable row level security;
create policy "Users access their direct messages or group messages they are a part of"
  on public.messages
  for select
  using (
    recipient_id = auth.uid()
    or sender_id = auth.uid()
    or group_id in (select group_id from public.group_members where user_id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) = 'admin'
  );

alter table public.notifications enable row level security;
create policy "User sees their own notifications"
  on public.notifications
  for select
  using (user_id = auth.uid());

-- Other necessary policies/alterations can be added as code evolves.
