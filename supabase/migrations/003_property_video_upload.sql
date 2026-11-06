-- Property video direct uploads and visibility prerequisites.
-- Safe to apply repeatedly in the Supabase SQL Editor.

alter table public.property_images
  add column if not exists media_type text not null default 'image';
alter table public.property_images
  add column if not exists video_url text;

do $$ begin
  alter table public.property_images
    add constraint property_images_media_type_check check (media_type in ('image', 'video'));
exception when duplicate_object then null;
end $$;

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

drop policy if exists "public read property-videos" on storage.objects;
create policy "public read property-videos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-videos');

drop policy if exists "admin write property-videos" on storage.objects;
create policy "admin write property-videos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-videos');

drop policy if exists "admin update property-videos" on storage.objects;
create policy "admin update property-videos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-videos');

drop policy if exists "admin delete property-videos" on storage.objects;
create policy "admin delete property-videos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-videos');

drop policy if exists "admin full access property_images" on public.property_images;
create policy "admin full access property_images"
  on public.property_images for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "public read images of published properties" on public.property_images;
create policy "public read images of published properties"
  on public.property_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_images.property_id and p.published = true
    )
  );
