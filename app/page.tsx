import { createClient } from '@/utils/supabase';
import PostForm from '@/components/PostForm';
import ThreadView from '@/components/ThreadView';
import Link from 'next/link';
import { signout } from '@/app/actions'; // <--- BARIS INI WAJIB ADA

export const revalidate = 0; 

export default async function Home() {
  const supabase = await createClient();

  // Cek User
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Threads
  const { data: threads } = await supabase
    .from('posts')
    .select(`
        *,
        likes(count),
        replies:posts(
            *,
            parent_id,
            likes(count)
        )
    `)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(10);
    
  return (
    <main className="min-h-screen relative">
      
      {/* AUTH STATUS (Pojok Kanan Atas) */}
      <div className="absolute top-2 right-2 text-xs font-sans">
        {user ? (
            <div className="flex gap-2 items-center bg-[#d6daf0] p-1 border border-[#b7c5d9]">
                
                <Link href="/profile" className="font-bold text-[#117743] hover:underline" title="Edit Profile">
                    {user.email?.split('@')[0]}
                </Link>
                {/* Form Logout */}
                <form action={signout}>
                    <button className="hover:underline text-blue-800">[Logout]</button>
                </form>
            </div>
        ) : (
            <div className="bg-[#d6daf0] p-1 border border-[#b7c5d9]">
                [<Link href="/login" className="hover:underline text-blue-800">Login / Register</Link>]
            </div>
        )}
      </div>

      {/* Board Header */}
      <div className="board-header pt-6">
        <div className="board-title">/exercise/ - Random</div>
        <div className="text-xs mt-2 text-gray-600">
            [<Link href="/" className="hover:underline">Home</Link>] 
        </div>
      </div>

      <hr className="border-gray-400 my-4" />

      {/* Form Input Utama */}
      <PostForm />

      <hr className="border-gray-400 my-8" />

      {/* Loop Threads */}
      <div className="px-4">
        {threads?.map((thread) => (
          <ThreadView key={thread.id} thread={thread} />
        ))}
      </div>
      
      {/* Footer Navigation */}
      <div className="bg-[#d6daf0] border border-[#b7c5d9] p-2 mt-10 mb-4 flex justify-between text-xs">
          <div>
            <button className="mr-2 hover:underline">Break</button>
            <button className="hover:underline">Crush</button>
          </div>
          <div>
              Pages: [1] [2] [3] ...
          </div>
      </div>
      
      <div className="text-center text-[10px] text-gray-500 pb-4">
        <p>All trademarks and copyrights on this page are owned by their respective parties.</p>
        <p>Images uploaded are the responsibility of the poster.</p>
      </div>
    </main>
  );
}