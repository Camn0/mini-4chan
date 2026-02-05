'use client';

import { useActionState } from 'react'; // BERUBAH: Import dari 'react', bukan 'react-dom'
import { createPost } from '@/app/actions';

export default function PostForm({ parentId }: { parentId?: number }) {
  // BERUBAH: Ganti useFormState menjadi useActionState
  // useActionState mengembalikan [state, action, isPending]
  const [state, formAction, isPending] = useActionState(createPost, { message: '' });

  return (
    <div className="flex justify-center my-6">
      <div className="bg-[#eef2ff] border border-gray-400 p-1 inline-block">
        <form action={formAction}>
          {parentId && <input type="hidden" name="parent_id" value={parentId} />}
          
          <table className="text-sm">
            <tbody>
              {/* Kolom Nama */}
              <tr>
                <td className="bg-[#d6daf0] text-[#0f0c5d] font-bold px-2 py-1 text-right border border-[#b7c5d9]">
                  Name
                </td>
                <td className="p-1">
                  <input 
                    name="name" 
                    placeholder="Anonymous" 
                    className="border border-gray-400 px-1 w-64 text-sm" 
                    disabled={isPending} // Bonus: disable input saat loading
                  />
                </td>
              </tr>

              {/* Kolom Subjek (Hanya muncul jika bukan reply) */}
              {!parentId && (
              <tr>
                <td className="bg-[#d6daf0] text-[#0f0c5d] font-bold px-2 py-1 text-right border border-[#b7c5d9]">
                  Subject
                </td>
                <td className="p-1">
                  <input 
                    name="subject" 
                    className="border border-gray-400 px-1 w-64 text-sm"
                    disabled={isPending} 
                  />
                  <button 
                    className="ml-2 text-xs border border-gray-400 px-2 bg-gray-100 disabled:opacity-50"
                    disabled={isPending}
                  >
                    {isPending ? 'Posting...' : 'Post'}
                  </button>
                </td>
              </tr>
              )}

              {/* Kolom Komentar */}
              <tr>
                <td className="bg-[#d6daf0] text-[#0f0c5d] font-bold px-2 py-1 text-right border border-[#b7c5d9]">
                  Comment
                </td>
                <td className="p-1">
                  <textarea 
                    name="content" 
                    rows={4} 
                    className="border border-gray-400 w-80 text-sm p-1"
                    disabled={isPending}
                  ></textarea>
                </td>
              </tr>

              {/* Kolom File */}
              <tr>
                <td className="bg-[#d6daf0] text-[#0f0c5d] font-bold px-2 py-1 text-right border border-[#b7c5d9]">
                  File
                </td>
                <td className="p-1">
                  <input type="file" name="file" className="text-xs" disabled={isPending} />
                </td>
              </tr>
              
              {/* Submit Button (Jika di mode reply) */}
              {parentId && (
                <tr>
                    <td></td>
                    <td className="p-1">
                        <button 
                          type="submit" 
                          className="border px-2 text-xs bg-gray-200 disabled:opacity-50"
                          disabled={isPending}
                        >
                            {isPending ? 'Sending...' : 'Reply'}
                        </button>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {state.message && (
            <div className="text-red-600 text-center text-sm font-bold mt-2">
              {state.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}