-- Video uploads go directly from the admin browser to Supabase Storage.
-- Apply once in the Supabase SQL Editor (or run with Supabase migrations).
-- Keep this limit in sync with MAX_VIDEO_SIZE_BYTES in lib/validations.ts.
update storage.buckets
set
  public = true,
  file_size_limit = 209715200,
  allowed_mime_types = array['video/mp4', 'video/webm', 'video/quicktime']
where id = 'property-videos';

-- Idempotently create the bucket if it was not created by schema.sql yet.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-videos',
  'property-videos',
  true,
  209715200,
  array['video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
