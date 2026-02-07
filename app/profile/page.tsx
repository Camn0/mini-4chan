import { createClient } from '@/utils/supabase'; // Aman diimport di Server Component
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/ProfileForm';

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Cek User Login
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Fetch Data Profil yang sudah ada
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#eef2ff] font-serif p-4 flex flex-col items-center">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#af0a0f]">/exercise/ - Profile</h1>
        <div className="text-xs mt-2 text-gray-600 font-sans">
             [<Link href="/" className="hover:underline text-[#34345c] font-bold">Return to Board</Link>]
        </div>
      </div>

      {/* Render Client Component Form dengan Data Awal */}
      <ProfileForm initialData={profile} />

      <div className="mt-8 text-xs text-gray-500 text-center max-w-md">
        <p>Changing your profile will affect all future posts. Old posts will retain the name used at the time of posting.</p>
      </div>
    </div>
  );
}