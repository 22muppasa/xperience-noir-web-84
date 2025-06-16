
-- Add address and emergency_contact fields to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN address text,
ADD COLUMN emergency_contact text;
