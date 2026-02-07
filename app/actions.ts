'use server';

import { createClient } from '@/utils/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ==========================================
// 1. AUTHENTICATION ACTIONS
// ==========================================

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return { message: error.message };
  }
  
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({ email, password });
  
  if (error) {
    return { message: error.message };
  }

  return { message: 'Akun berhasil dibuat! Silakan Login.' };
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

// ==========================================
// 2. PROFILE ACTIONS (YANG HILANG)
// ==========================================

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { message: 'Harus login.' };

  const displayName = formData.get('display_name') as string;
  const bio = formData.get('bio') as string;
  const avatarFile = formData.get('avatar') as File;

  let avatarUrl = null;

  // Logic Upload Avatar
  if (avatarFile && avatarFile.size > 0) {
    const fileName = `${user.id}-${Date.now()}.png`;
    
    // Upload ke bucket 'avatars'
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      avatarUrl = data.publicUrl;
    }
  }

  // Update Tabel Profiles
  const updates: any = {
    display_name: displayName,
    bio: bio,
    updated_at: new Date().toISOString(),
  };

  if (avatarUrl) updates.avatar_url = avatarUrl;

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...updates });

  if (error) return { message: 'Gagal update: ' + error.message };

  revalidatePath('/profile');
  revalidatePath('/', 'layout'); 
  return { message: 'Profil berhasil diupdate!' };
}

// ==========================================
// 3. POSTING ACTION (Create)
// ==========================================

export async function createPost(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  const content = formData.get('content') as string;
  const subject = formData.get('subject') as string;
  const file = formData.get('file') as File;
  const parentId = formData.get('parent_id') as string | null;

  // ---> LOGIC PENENTUAN NAMA (PROFIL vs ANONIM) <---
  let nameToUse = 'Anonymous';
  let userId = null;

  if (user) {
    userId = user.id;
    // Cek apakah user punya profil?
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();
    
    // Pakai Display Name Profil ATAU Email
    nameToUse = profile?.display_name || user.email?.split('@')[0] || 'User';
  } else {
    // Jika tidak login, pakai input nama manual
    nameToUse = (formData.get('name') as string) || 'Anonymous';
  }

  // Validasi Dasar
  if (!content && !file.size) return { message: 'Konten atau Gambar wajib diisi.' };

  let imageData = {};

  // Logic Upload Gambar Postingan
  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('board_images')
      .upload(fileName, file);

    if (!uploadError) {
      const { data } = supabase.storage
        .from('board_images')
        .getPublicUrl(fileName);
        
      imageData = {
        image_url: data.publicUrl,
        image_filename: file.name,
        image_size: file.size,
      };
    }
  }

  const payload = {
    name: nameToUse,
    content,
    subject,
    user_id: userId,
    parent_id: parentId ? parseInt(parentId) : null,
    ...imageData
  };

  await supabase.from('posts').insert([payload]);

  if (parentId) {
    revalidatePath(`/thread/${parentId}`);
  } else {
    revalidatePath('/');
  }

  return { message: 'Success' };
}

// ==========================================
// 4. DELETE ACTION
// ==========================================

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get('postId');
  const parentId = formData.get('parentId');

  if (!id) return;

  await supabase.from('posts').delete().eq('id', id);

  if (parentId && parentId !== 'null') {
    revalidatePath(`/thread/${parentId}`);
  } else {
    revalidatePath('/');
  }
}

// ==========================================
// 5. LIKE ACTION
// ==========================================

export async function toggleLike(formData: FormData) {
  const supabase = await createClient();
  
  const postId = formData.get('postId');
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !postId) return; 

  const { data: existing } = await supabase
    .from('likes')
    .select()
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single();

  if (existing) {
    await supabase.from('likes').delete().eq('id', existing.id);
  } else {
    await supabase.from('likes').insert([{ user_id: user.id, post_id: postId }]);
  }
  
  revalidatePath('/'); 
}