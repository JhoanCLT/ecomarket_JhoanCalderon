import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lxujeciblzrrmztrcluf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dWplY2libHpycm16dHJjbHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODcwMTYsImV4cCI6MjA3Njg2MzAxNn0.7wXmdUMu-825mgeLTvLNjjkEl9-sO66iz5WtIRjrlAQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
