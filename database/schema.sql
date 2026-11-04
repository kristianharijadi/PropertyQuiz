-- Execute this once in a private PostgreSQL database BEFORE enabling live lead collection.
CREATE TABLE IF NOT EXISTS property_match_leads (
 id BIGSERIAL PRIMARY KEY,
 session_id UUID NOT NULL UNIQUE,
 full_name TEXT NOT NULL,
 whatsapp TEXT NOT NULL,
 email TEXT,
 purchase_timeline TEXT NOT NULL,
 budget_range TEXT,
 consent_at TIMESTAMPTZ NOT NULL,
 consent_text_version TEXT NOT NULL,
 answers JSONB NOT NULL,
 profile JSONB NOT NULL,
 recommendations JSONB NOT NULL,
 config_version TEXT NOT NULL,
 selected_property TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS property_match_leads_created_at_idx ON property_match_leads (created_at DESC);
-- IMPORTANT: Personal data. Restrict DB account privileges and configure retention/deletion policy.

CREATE TABLE IF NOT EXISTS property_match_events (
 id BIGSERIAL PRIMARY KEY,
 session_id UUID NOT NULL REFERENCES property_match_leads(session_id) ON DELETE CASCADE,
 event_name TEXT NOT NULL CHECK(event_name IN ('explored','selected','contact_sales')),
 property_id TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS property_match_events_session_idx ON property_match_events(session_id);
