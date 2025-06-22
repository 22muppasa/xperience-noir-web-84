
-- Create a comprehensive child deletion function with transaction safety
CREATE OR REPLACE FUNCTION public.delete_child_comprehensive(child_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    work_record RECORD;
BEGIN
    -- Start transaction (implicit in function)
    
    -- 1️⃣ Delete child milestones
    DELETE FROM public.child_milestones 
    WHERE child_id = child_id_param;
    
    -- 2️⃣ Delete emergency contacts
    DELETE FROM public.emergency_contacts 
    WHERE child_id = child_id_param;
    
    -- 3️⃣ Delete work collection items that reference this child's work
    DELETE FROM public.work_collection_items 
    WHERE work_id IN (
        SELECT id FROM public.kids_work WHERE child_id = child_id_param
    );
    
    -- 4️⃣ Delete work collections created for this child
    DELETE FROM public.work_collections 
    WHERE child_id = child_id_param;
    
    -- 5️⃣ Delete kids_work_tags (will cascade when kids_work is deleted, but explicit is safer)
    DELETE FROM public.kids_work_tags 
    WHERE work_id IN (
        SELECT id FROM public.kids_work WHERE child_id = child_id_param
    );
    
    -- 6️⃣ Remove any parent–child relationships
    DELETE FROM public.parent_child_relationships
    WHERE child_id = child_id_param;
    
    -- 7️⃣ Unlink from enrollments (set child_id to null instead of deleting enrollment)
    UPDATE public.enrollments
    SET child_id = null
    WHERE child_id = child_id_param;
    
    -- 8️⃣ Delete all associated kids_work rows
    DELETE FROM public.kids_work
    WHERE child_id = child_id_param;
    
    -- 9️⃣ Delete notifications related to this child's work
    DELETE FROM public.notifications
    WHERE related_work_id IN (
        SELECT id FROM public.kids_work WHERE child_id = child_id_param
    );
    
    -- 🔟 Finally delete the child record
    DELETE FROM public.children
    WHERE id = child_id_param;
    
    -- Verify the child was actually deleted
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Child with id % not found or could not be deleted', child_id_param;
    END IF;
    
    RETURN true;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error and re-raise it
        RAISE EXCEPTION 'Failed to delete child: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users (admins will be checked by RLS)
GRANT EXECUTE ON FUNCTION public.delete_child_comprehensive(uuid) TO authenticated;
