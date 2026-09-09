import { createClient } from '@supabase/supabase-js';

// Fill these in from Supabase → Project Settings → API.
const SUPABASE_URL = 'https://ojowmgwmuoflfaqqgaim.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qb3dtZ3dtdW9mbGZhcXFnYWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MTkzODksImV4cCI6MjEwNDQ5NTM4OX0.YG3LTUO62vQ2eguBzN34xvtw6MzkQ3dkgYK4uzsuXYc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
