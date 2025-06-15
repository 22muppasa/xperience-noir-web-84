
-- First, ensure the user_role enum exists with correct values
DO $$ 
BEGIN
    -- Drop the enum if it exists and recreate it
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role CASCADE;
    END IF;
    
    -- Create the user_role enum with correct values
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
END $$;

-- Add the role column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' 
                   AND column_name = 'role' 
                   AND table_schema = 'public') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role user_role NOT NULL DEFAULT 'customer'::user_role;
    END IF;
END $$;

-- Recreate the handle_new_user function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role_value user_role;
BEGIN
    -- Get the role from metadata, default to 'customer' if not provided
    user_role_value := COALESCE(
        (NEW.raw_user_meta_data ->> 'role')::user_role, 
        'customer'::user_role
    );
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, email, first_name, last_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name',
        user_role_value
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and still return NEW to not block signup
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();
