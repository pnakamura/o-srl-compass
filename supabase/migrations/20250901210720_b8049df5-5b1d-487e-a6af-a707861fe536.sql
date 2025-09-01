-- Allow anonymous assessment creation and viewing
-- Make user_id nullable for anonymous assessments
ALTER TABLE public.osrl_assessments ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow anonymous assessments
DROP POLICY IF EXISTS "Users can create their own assessments" ON public.osrl_assessments;
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.osrl_assessments;
DROP POLICY IF EXISTS "Users can update their own assessments" ON public.osrl_assessments;
DROP POLICY IF EXISTS "Users can delete their own assessments" ON public.osrl_assessments;

-- New policy for anonymous assessment creation
CREATE POLICY "Allow anonymous assessment creation"
  ON public.osrl_assessments
  FOR INSERT
  WITH CHECK (true);

-- Policy for viewing assessments
CREATE POLICY "Users can view assessments"
  ON public.osrl_assessments
  FOR SELECT
  USING (
    user_id IS NULL OR  -- Anonymous assessments can be viewed by anyone
    auth.uid() = user_id  -- Authenticated users can view their own
  );

-- Policy for updating assessments (authenticated users only)
CREATE POLICY "Users can update their own assessments"
  ON public.osrl_assessments
  FOR UPDATE
  USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Policy for deleting assessments (authenticated users only)
CREATE POLICY "Users can delete their own assessments"
  ON public.osrl_assessments
  FOR DELETE
  USING (auth.uid() = user_id AND user_id IS NOT NULL);