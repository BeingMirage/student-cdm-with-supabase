-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.diagnostic_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  student_id uuid,
  mentor_name text,
  improvement_areas text,
  targeted_roles text,
  score_range text,
  average_rating numeric,
  realism_rating numeric,
  strongest_aspects text,
  fit_job_families text,
  backup_roles text,
  detailed_scores jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT diagnostic_reports_pkey PRIMARY KEY (id),
  CONSTRAINT diagnostic_reports_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.institute_particulars (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  institute_id uuid,
  particulars text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  start_date text,
  end_date text,
  CONSTRAINT institute_particulars_pkey PRIMARY KEY (id),
  CONSTRAINT institute_particulars_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institutes(id)
);
CREATE TABLE public.institutes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT institutes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text,
  email text,
  has_changed_password boolean DEFAULT false,
  institute_name text,
  phone_number text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);