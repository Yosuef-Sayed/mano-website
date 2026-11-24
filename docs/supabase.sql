-- Run once in the Supabase SQL editor.
create table if not exists public.submissions (
  id uuid primary key,
  type text not null check (type in ('contact','collaborate','speaking','booking','service')),
  status text not null default 'new'
    check (status in ('new','under_review','pending_confirmation','awaiting_payment','confirmed','completed','cancelled')),
  data jsonb not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);

-- Lock the table down: only the server (service-role key) can read or write.
alter table public.submissions enable row level security;
-- No policies are created on purpose, so the public anon key has no access.
