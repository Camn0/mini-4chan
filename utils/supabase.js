import { createClient } from '@supabase/supabase-js';

// Mengambil variabel lingkungan
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi keberadaan variabel lingkungan
if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL dan Key harus didefinisikan di .env.local');
}

// Inisialisasi client
export const supabase = createClient(supabaseUrl, supabaseKey);