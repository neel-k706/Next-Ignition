-- Supabase Storage Setup for Pitch Materials
-- Run this in Supabase SQL Editor after creating the storage bucket

-- Step 1: Create storage bucket in Supabase Dashboard
-- Dashboard > Storage > New Bucket
-- Name: pitch-materials
-- Public: false

-- Step 2: Add RLS policies for the bucket

-- Policy: Users can upload their own pitch materials
create policy "Users can upload own pitch materials"
on storage.objects for insert
with check (
  bucket_id = 'pitch-materials' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
create policy "Users can read own files"
on storage.objects for select
using (
  bucket_id = 'pitch-materials' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
create policy "Users can delete own files"
on storage.objects for delete
using (
  bucket_id = 'pitch-materials' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own files
create policy "Users can update own files"
on storage.objects for update
using (
  bucket_id = 'pitch-materials' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Public pitch materials can be viewed by investors
-- (Only if visibility is set to 'public' in pitch_materials table)
create policy "Public pitch materials viewable"
on storage.objects for select
using (
  bucket_id = 'pitch-materials' 
  and exists (
    select 1 from public.pitch_materials
    where storage_path = name
    and visibility = 'public'
  )
);
