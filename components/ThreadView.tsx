import { Post, Thread } from '@/types';
import { formatBytes, formatPostContent } from '@/utils/formatText';
import Image from 'next/image';
import Link from 'next/link';

// Komponen Single Post (Reusable untuk OP dan Reply)
const PostItem = ({ post, isOp = false }: { post: Post; isOp?: boolean }) => {
  return (
    <div className={`flex flex-col mb-1 ${!isOp ? 'inline-block' : 'w-full'}`} id={`p${post.id}`}>
      
      {/* Header Post */}
      <div className="text-sm mb-1 text-gray-800">
        <input type="checkbox" className="mr-2" />
        
        {post.image_filename && (
          <span className="text-xs text-gray-600 mr-2">
            File: <a href={post.image_url!} target="_blank" className="hover:underline text-blue-800">{post.image_filename}</a> 
            ({formatBytes(post.image_size || 0)})
          </span>
        )}

        {/* Post Metadata */}
        <span className="poster-name">{post.name} </span>
        <span className="text-gray-500 text-xs">
            {new Date(post.created_at).toLocaleString()}
        </span>
        {/* Jika ini OP (Thread Starter), jadikan Link ke halaman thread */}
        {isOp ? (
          <Link href={`/thread/${post.id}`} className="text-gray-500 text-xs ml-2 cursor-pointer hover:text-red-600">
            No.{post.id} &nbsp; [Reply]
          </Link>
        ) : (
          /* Jika ini Reply biasa, biarkan saja (atau nanti bisa fitur anchor) */
          <span className="text-gray-500 text-xs ml-2 cursor-pointer hover:text-red-600">
            No.{post.id}
          </span>
        )}
      </div>

      <div className="flex flex-row">
         {/* Gambar (Thumbnail Style) */}
         {post.image_url && (
           <div className="mr-4 mb-2 shrink-0">
             <a href={post.image_url} target="_blank">
               <img 
                 src={post.image_url} 
                 alt="Post Image" 
                 className={`border border-gray-400 ${isOp ? 'max-w-[250px]' : 'max-w-[125px]'}`}
               />
             </a>
           </div>
         )}

         {/* Konten Teks */}
         <blockquote className={`my-0 ${!isOp ? 'reply-box' : 'ml-2'}`}>
           {formatPostContent(post.content)}
         </blockquote>
      </div>
    </div>
  );
};

// Komponen Thread Container
export default function ThreadView({ thread }: { thread: Thread }) {
  return (
    <div className="border-b border-gray-300 pb-8 mb-8 clear-both table w-full">
      {/* OP Post */}
      <PostItem post={thread} isOp={true} />

      {/* Replies List */}
      <div className="mt-4 ml-4 md:ml-8">
        {thread.replies && thread.replies.map((reply) => (
          <div key={reply.id} className="table bg-[#d6daf0] border border-[#b7c5d9] rounded-sm mb-2">
              <PostItem post={reply} />
          </div>
        ))}
      </div>
    </div>
  );
}