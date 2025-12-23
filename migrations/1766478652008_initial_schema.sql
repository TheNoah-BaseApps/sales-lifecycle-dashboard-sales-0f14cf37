CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password text NOT NULL,
  role text DEFAULT 'user' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS website_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  ip text,
  owner_contact text,
  number_of_visits integer DEFAULT 1 NOT NULL,
  page_visits text,
  website_duration integer,
  location text,
  visit_time time,
  visit_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_website_visits_date ON website_visits (visit_date);
CREATE INDEX IF NOT EXISTS idx_website_visits_ip ON website_visits (ip);

CREATE TABLE IF NOT EXISTS store_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  owner_contact text,
  number_of_visits integer DEFAULT 1 NOT NULL,
  location text,
  visit_time time,
  visit_date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_store_visits_date ON store_visits (visit_date);
CREATE INDEX IF NOT EXISTS idx_store_visits_location ON store_visits (location);

CREATE TABLE IF NOT EXISTS login_signup (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  username text NOT NULL,
  email text NOT NULL,
  location text,
  activity_time time,
  activity_date date DEFAULT CURRENT_DATE NOT NULL,
  activity_type text DEFAULT 'signup' NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_login_signup_date ON login_signup (activity_date);
CREATE INDEX IF NOT EXISTS idx_login_signup_email ON login_signup (email);