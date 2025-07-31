// admin/client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Substitua com as suas credenciais do Supabase
const supabaseUrl = 'https://pyfzzuejdvhrlqfvnjqz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5Znp6dWVqZHZocmxxZnZuanF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTc5MjYsImV4cCI6MjA2OTQ5MzkyNn0.Z0zt5ftX7-xFp1s1_k6GlqD_dwY5CxxySx6ThDTZVUA';

// Exporta o cliente Supabase para ser usado em outros arquivos
export const supabase = createClient(supabaseUrl, supabaseKey);
