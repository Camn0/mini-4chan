import { createClient } from '@/utils/supabase';
import PostForm from '@/components/PostForm';
import ThreadView from '@/components/ThreadView';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Agar halaman ini selalu fresh (real-time)
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ThreadPage({ params }: PageProps) {
  // Await params di Next.js 15+
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Fetch Thread (OP) beserta semua Replies-nya
  const { data: thread } = await supabase
    .from('posts')
    .select(`
        *,
        replies:posts(
            *,
            parent_id
        )
    `)
    .eq('id', id)
    .is('parent_id', null) // Pastikan yang diambil adalah OP (Induk)
    .single();

  if (!thread) {
    return notFound();
  }

  // Urutkan reply berdasarkan waktu (terlama di atas)
  if (thread.replies) {
    thread.replies.sort((a: any, b: any) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }

  return (
    <main className="min-h-screen pb-10">
      {/* Header Sederhana */}
      <div className="board-header">
        <div className="board-title">/exercise/ - Random</div>
        <div className="text-xs mt-2 text-gray-600">
            [<Link href="/">Return</Link>] [<Link href="#">Catalog</Link>] [<Link href="#bottom">Bottom</Link>]
        </div>
      </div>

      <hr className="border-gray-400 my-4" />

      {/* Form Reply (Mode: Reply Thread) */}
      <div className="text-center text-xl font-bold text-[#af0a0f]">Posting a Reply</div>
      <PostForm parentId={parseInt(id)} />

      <hr className="border-gray-400 my-8" />

      {/* Tampilan Thread */}
      <div className="px-4">
        <ThreadView thread={thread} />
      </div>

      <div className="mt-10 px-4 text-xs">
         <Link href="/" className="text-blue-800 hover:underline">← Back to Board</Link>
      </div>
      <div id="bottom"></div>
    </main>
  );
}