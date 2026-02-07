import { Post, Thread } from '@/types';
import { formatBytes, formatPostContent } from '@/utils/formatText';
import Link from 'next/link';
import { deletePost, toggleLike } from '@/app/actions';

// Komponen Single Post
// Gunakan 'any' pada post agar tidak error TypeScript soal 'likes'
const PostItem = ({ post, isOp = false }: { post: any; isOp?: boolean }) => {
  
  // Ambil jumlah like dari data yang dikirim Supabase
  // Format Supabase: likes: [ { count: 123 } ]
  const likeCount = post.likes?.[0]?.count || 0;

  return (
    <div className={`flex flex-col mb-1 ${!isOp ? 'inline-block' : 'w-full'}`} id={`p${post.id}`}>
      
      {/* Header Post */}
      <div className="text-sm mb-1 text-gray-800 flex items-center flex-wrap gap-1">
        <input type="checkbox" className="mr-1" />
        
        {/* Judul Thread (Hanya OP) */}
        {isOp && (
            <span className="text-[#0f0c5d] font-bold"> 
                {post.subject ? post.subject : (post.content ? post.content.slice(0, 20) + '...' : 'No Subject')} 
            </span>
        )}

        {/* Info Nama & Tanggal */}
        <span className="text-[#117743] font-bold"> &nbsp; {post.name} &nbsp; </span>
        <span className="text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleString()}
        </span>

        {/* Nomor Post & Link Reply */}
        {isOp ? (
          <Link href={`/thread/${post.id}`} className="text-gray-500 text-xs hover:text-red-600">
            &nbsp; No.{post.id} [Reply]
          </Link>
        ) : (
          <span className="text-gray-500 text-xs cursor-pointer">
            &nbsp; No.{post.id}
          </span>
        )}

        {/* --- TOMBOL LIKE DENGAN ANGKA --- */}
        <form action={toggleLike} className="inline-block ml-2 select-none">
           <input type="hidden" name="postId" value={post.id} />
           <button 
             type="submit" 
             className="text-[10px] text-pink-600 hover:text-pink-800 border-none bg-transparent cursor-pointer flex items-center gap-0.5"
             title="Like this post"
           >
             {/* Simbol Hati */}
             <span>♥</span> 
             {/* Angka Like (Hanya muncul jika > 0) */}
             <span className="font-bold underline decoration-pink-300">
               {likeCount > 0 ? likeCount : 'Like'}
             </span>
           </button>
        </form>

        {/* --- TOMBOL DELETE --- */}
        <form action={deletePost} className="inline-block ml-1">
          <input type="hidden" name="postId" value={post.id} />
          <input type="hidden" name="parentId" value={post.parent_id || ''} />
          
          <button 
            type="submit" 
            className="text-[10px] text-red-500 hover:text-red-700 hover:underline border-none bg-transparent cursor-pointer"
            title="Delete this post"
          >
            [x]
          </button>
        </form>
      </div>

      {/* File Attachment Info */}
      {post.image_url && (
          <div className="text-xs text-gray-600 mb-1">
            File: <a href={post.image_url} target="_blank" className="hover:underline text-blue-800">{post.image_filename}</a> 
            ({formatBytes(post.image_size || 0)})
          </div>
      )}

      <div className="flex flex-row">
         {/* Gambar Thumbnail */}
         {post.image_url && (
           <div className="mr-4 mb-2 shrink-0">
             <a href={post.image_url} target="_blank">
               <img 
                 src={post.image_url} 
                 alt="Post Image" 
                 className={`border border-gray-400 object-contain ${isOp ? 'max-w-[250px] max-h-[250px]' : 'max-w-[125px] max-h-[125px]'}`}
               />
             </a>
           </div>
         )}

         {/* Konten Teks */}
         <blockquote className={`my-0 ${!isOp ? 'bg-[#d6daf0] border border-[#b7c5d9] p-2 rounded-sm' : 'ml-2'}`}>
           {formatPostContent(post.content)}
         </blockquote>
      </div>
    </div>
  );
};

// Komponen Container Thread
export default function ThreadView({ thread }: { thread: any }) { // Gunakan any di sini juga
  return (
    <div className="border-b border-gray-300 pb-8 mb-8 clear-both table w-full">
      {/* OP Post */}
      <PostItem post={thread} isOp={true} />

      {/* Replies List */}
      <div className="mt-4 ml-4 md:ml-8">
        {thread.replies && thread.replies.map((reply: any) => (
          <div key={reply.id} className="table bg-[#d6daf0] border border-[#b7c5d9] rounded-sm mb-2 p-1">
              <PostItem post={reply} />
          </div>
        ))}
      </div>
    </div>
  );
}