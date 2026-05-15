-- Suscripciones newsletter desde el CTA flotante (email + locale + consentimiento).
-- Ejecutar en Supabase SQL Editor o vía CLI tras 001_init_schema.

create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null default 'en',
  marketing_accepted boolean not null default false,
  source text default 'registration_cta',
  created_at timestamptz not null default now()
);

comment on table public.newsletter_subscriptions is 'Altas de newsletter; insert vía API con anon + RLS.';

create unique index if not exists newsletter_subscriptions_email_lower_idx
  on public.newsletter_subscriptions (lower(trim(email)));

alter table public.newsletter_subscriptions enable row level security;

-- Sin lectura pública (evita scraping).
-- Inserción solo si el usuario declara aceptación de marketing (coherente con el checkbox legal).
create policy "newsletter_insert_anon_with_consent"
  on public.newsletter_subscriptions
  for insert
  to anon, authenticated
  with check (
    marketing_accepted is true
    and length(trim(email)) between 5 and 320
    and locale in ('en', 'es', 'fr', 'it')
  );
