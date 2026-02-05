'use server';

import { supabase } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(prevState: any, formData: FormData) {
  const content = formData.get('content') as string;
  const name = (formData.get('name') as string) || 'Anonymous';
  const file = formData.get('file') as File;
  const parentId = formData.get('parent_id') as string | null;

  // 1. Validasi Dasar
  if (!content && !file.size) {
    return { message: 'Konten atau Gambar wajib diisi.' };
  }

  let imageData = {};

  // 2. Logic Upload Gambar (Mock implementation for Storage)
  if (file && file.size > 0) {
    // Generate nama file unik
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('board_images')
      .upload(filePath, file);

    if (uploadError) {
      return { message: 'Gagal upload gambar: ' + uploadError.message };
    }

    // Mendapatkan Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('board_images')
      .getPublicUrl(filePath);

    imageData = {
      image_url: publicUrl,
      image_filename: file.name, // Nama asli file
      image_size: file.size,
      // Width/Height biasanya butuh library server-side seperti 'sharp'
      // Disini kita skip untuk penyederhanaan
    };
  }

  // 3. Insert ke Database
  const payload = {
    name,
    content,
    parent_id: parentId ? parseInt(parentId) : null,
    ...imageData
  };

  const { error } = await supabase.from('posts').insert([payload]);

  if (error) {
    return { message: 'Database Error: ' + error.message };
  }

  // 4. Revalidasi & Redirect
  if (parentId) {
    // Jika reply, refresh halaman thread
    revalidatePath(`/thread/${parentId}`);
  } else {
    // Jika thread baru, refresh home
    revalidatePath('/');
  }

  return { message: 'Success' };
}