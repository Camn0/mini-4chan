'use client';

import { updateProfile } from '@/app/actions';
import { useState } from 'react';

// Props yang diterima dari Server
interface ProfileFormProps {
  initialData: {
    display_name: string;
    bio: string;
    avatar_url: string | null;
  } | null;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await updateProfile(formData);
    setLoading(false);
    setMessage(res.message);
  }

  return (
    <div className="bg-[#d6daf0] border border-[#b7c5d9] p-1 max-w-lg w-full">
      <div className="bg-[#98aabf] text-white px-2 py-1 font-bold text-sm mb-2">
          Edit User Profile
      </div>

      <form action={handleSubmit} className="px-4 py-2">
          <table className="w-full text-sm">
              <tbody>
                  <tr>
                      <td className="w-32 font-bold text-[#0f0c5d] align-top py-2">Display Name</td>
                      <td>
                          <input 
                            name="display_name" 
                            type="text" 
                            defaultValue={initialData?.display_name || ''}
                            className="border border-gray-400 p-1 w-full" 
                            placeholder="New Display Name" 
                          />
                      </td>
                  </tr>
                  <tr>
                      <td className="font-bold text-[#0f0c5d] align-top py-2">Tripcode / Bio</td>
                      <td>
                          <textarea 
                            name="bio" 
                            rows={3} 
                            defaultValue={initialData?.bio || ''}
                            className="border border-gray-400 p-1 w-full" 
                            placeholder="Short bio or signature"
                          ></textarea>
                      </td>
                  </tr>
                  <tr>
                      <td className="font-bold text-[#0f0c5d] align-top py-2">Avatar</td>
                      <td>
                          {initialData?.avatar_url && (
                            <img src={initialData.avatar_url} alt="Current Avatar" className="w-16 h-16 object-cover border border-gray-400 mb-2" />
                          )}
                          <input name="avatar" type="file" className="text-xs" />
                          <div className="text-[10px] text-gray-500 mt-1">
                              Supported: JPG, PNG. Max 2MB.
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td></td>
                      <td className="py-4">
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-white border border-gray-400 px-3 py-1 hover:bg-gray-100 text-xs font-bold disabled:opacity-50"
                          >
                              {loading ? 'Updating...' : 'Update Profile'}
                          </button>
                      </td>
                  </tr>
              </tbody>
          </table>
          
          {message && (
              <div className="bg-[#f0e0d6] border border-[#d9bfb7] text-[#af0a0f] p-2 text-center text-xs font-bold mt-2">
                  {message}
              </div>
          )}
      </form>
    </div>
  );
}