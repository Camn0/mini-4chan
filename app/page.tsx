import { supabase } from '@/utils/supabase';
import PostForm from '@/components/PostForm';
import ThreadView from '@/components/ThreadView';

export const revalidate = 0; // Disable static cache (Realtime)

export default async function Home() {
  // Fetch Threads (Parent ID is NULL)
  const { data: threads } = await supabase
    .from('posts')
    .select(`
        *,
        replies:posts(
            *,
            parent_id
        )
    `)
    .is('parent_id', null)
    .order('created_at', { ascending: false })
    .limit(10);
    
  // Catatan: Dalam produksi nyata, fetching 'replies' nested 
  // harus dilimit (misal 3-5 reply terakhir untuk preview mode).
  // Kode di atas mengambil semua reply (Caution for large data).

  return (
    <main className="min-h-screen">
      {/* Board Header */}
      <div className="board-header">
        <div className="board-title">/exercise/ - Random</div>
        <div className="text-xs mt-2 text-gray-600">
            [<a href="#">Home</a>] [<a href="#">History</a>] [<a href="#">Catalog</a>]
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
            <button className="mr-2">Delete</button>
            <button>Report</button>
          </div>
          <div>
              Pages: [1] [2] [3] ...
          </div>
      </div>
    </main>
  );
}