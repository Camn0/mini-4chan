# /exercise/ - Mini Twitter (Imageboard)

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)

Ini adalah aplikasi papan gambar (*imageboard*) bergaya retro yang dibangun dengan **Next.js 15**, **TypeScript**, dan **Supabase**. Aplikasi ini didesain dengan tema warna Yotsuba B klasik, mendukung fitur *real-time*, sistem *reply* bersarang, dan format teks *greentext*.

<img width="1365" height="644" alt="Main Interface" src="https://github.com/user-attachments/assets/d404dff2-aaec-4805-97cc-ba2c8dbec1cd" />

## Ringkasan Teknologi

Aplikasi ini menggunakan arsitektur *full-stack* modern dengan Next.js App Router dan Supabase sebagai Backend-as-a-Service (BaaS).

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 | Menggunakan App Router & Server Components. |
| **Bahasa** | TypeScript | Type safety untuk seluruh komponen. |
| **Database** | Supabase (PostgreSQL) | Menyimpan data user, thread, dan like. |
| **Auth** | Supabase Auth | Autentikasi email/password. |
| **Storage** | Supabase Storage | Penyimpanan gambar thread dan avatar user. |
| **Styling** | Tailwind CSS | Utility-first CSS dengan palet warna kustom. |
| **State** | React Hooks | `useActionState`, `useState` untuk interaksi klien. |

---

## Struktur Proyek

Struktur folder diorganisir untuk memisahkan logika server, komponen UI, dan utilitas.

```bash
mini-twitter/
├── app/
│   ├── actions.ts                 # Server actions (auth, posts, profiles, likes)
│   ├── globals.css                # Global Tailwind & custom styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home/board view
│   ├── login/page.tsx             # Login & signup page
│   ├── profile/page.tsx           # User profile page
│   └── thread/[id]/page.tsx       # Single thread view
├── components/
│   ├── PostForm.tsx               # Form for creating posts/replies (Client)
│   ├── ProfileForm.tsx            # Profile editing form (Client)
│   └── ThreadView.tsx             # Thread display component (Server)
├── utils/
│   ├── supabase.js                # Supabase client factory
│   └── formatText.tsx             # Text formatting utilities
└── public/                        # Static assets

```

---

## Instalasi dan Konfigurasi

### 1. Prasyarat

Pastikan Anda telah menginstal:

* Node.js 18+ dan npm/yarn
* Akun Supabase aktif
* Git

### 2. Kloning Repository

```bash
git clone <repo-url>
cd mini-twitter
npm install

```

### 3. Konfigurasi Environment

Buat file `.env.local` di root proyek dan masukkan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

```

### 4. Setup Database (Supabase SQL)

Jalankan perintah SQL berikut di dashboard Supabase untuk membuat tabel yang diperlukan:

```sql
-- Tabel Posts
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT 'Anonymous',
  subject TEXT,
  content TEXT NOT NULL,
  parent_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT,
  image_filename TEXT,
  image_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Likes
CREATE TABLE likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

```

**Konfigurasi Storage Buckets:**

1. Buat bucket publik bernama `post-images` (untuk lampiran thread).
2. Buat bucket publik bernama `avatars` (untuk foto profil).

### 5. Jalankan Server

```bash
npm run dev

```

Buka [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) di browser Anda.

---

## Panduan Penggunaan

### 1. Membuat Akun & Login

Masuk ke halaman `/login` untuk mendaftar akun baru atau masuk. Sistem menggunakan Supabase Auth untuk keamanan sesi.

<img width="487" height="297" alt="Login Screen" src="https://github.com/user-attachments/assets/843d6441-2db7-4be6-96c6-99a83c068449" />

### 2. Manajemen Profil

Klik username Anda di pojok kanan atas untuk mengedit nama tampilan, bio, dan mengunggah avatar.

<img width="1365" height="648" alt="Profile Editing" src="https://github.com/user-attachments/assets/7b1074bc-31ec-4fcb-a737-29149e423f36" />

### 3. Membuat Thread Baru

Di halaman utama (`/`), isi formulir posting. Anda dapat menyertakan subjek opsional dan melampirkan file gambar.

<img width="1365" height="634" alt="Creating Thread" src="https://github.com/user-attachments/assets/496f4119-90d6-4af3-9fec-8a0c7c25d9c0" />

### 4. Membalas & Interaksi

Masuk ke dalam thread untuk membalas. Anda juga dapat memberikan "Like" pada postingan atau menghapus postingan milik Anda sendiri.

<img width="1365" height="361" alt="Reply View" src="https://github.com/user-attachments/assets/b7cd2015-7a98-4da9-b960-b12ce24f6c09" />

#### Fitur Formatting

Postingan mendukung format teks khusus ala imageboard:

| Format | Contoh Input | Hasil |
| --- | --- | --- |
| **Greentext** | `>Ini adalah quote` | Teks berwarna hijau (*quoting*). |
| **Reply Link** | `>>123` | Hyperlink biru ke nomor post. |
| **Line breaks** | Tekan Enter | Render baris baru (`<br />`). |

---

## Server Actions

Seluruh mutasi data ditangani melalui **Next.js Server Actions** di `app/actions.ts` untuk keamanan dan performa:

* `login()` / `signup()` / `signout()`: Manajemen sesi autentikasi.
* `updateProfile()`: Mengubah data profil user.
* `createPost()`: Membuat thread atau reply (termasuk upload file).
* `deletePost()`: Menghapus postingan (hanya pemilik).
* `toggleLike()`: Menambah/menghapus like.

---

## Styling & Tema

Aplikasi menggunakan tema **retro imageboard** yang terinspirasi dari Yotsuba B:

| Elemen | Warna Hex | Penggunaan |
| --- | --- | --- |
| **Background** | `#eef2ff` | Latar belakang halaman utama. |
| **Post Box** | `#d6daf0` | Kontainer postingan. |
| **Border** | `#b7c5d9` | Garis tepi elemen. |
| **Judul** | `#0f0c5d` | Judul bagian dan subjek. |
| **Nama** | `#117743` | Nama pengirim (Poster). |
| **Greentext** | `#789922` | Teks kutipan (`>text`). |

---

## Troubleshooting

Jika Anda mengalami masalah saat pengembangan:

1. **Cannot find module '@/types':**
Pastikan `tsconfig.json` memiliki konfigurasi path alias `"paths": { "@/*": ["./*"] }`.
2. **Supabase Connection Error:**
Periksa kembali `.env.local`. Pastikan RLS (Row Level Security) di Supabase sudah diatur untuk mengizinkan akses public/auth yang sesuai.
3. **File Upload Gagal:**
Pastikan nama bucket di Supabase Storage sesuai (`post-images`, `avatars`) dan policy bucket mengizinkan upload.

```

```
