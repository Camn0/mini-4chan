# /exercise/ - Mini Twitter (Retro Imageboard)

![Next JS](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_DB-green?style=for-the-badge&logo=supabase&logoColor=white)

This project is a retro-style imageboard application built with **Next.js 15** and **Supabase**. Styled after classic imageboards with a Yotsuba B color theme, it features real-time data fetching, nested replies, file attachments, and a full authentication system.

<img width="1365" height="644" alt="Home Screen" src="https://github.com/user-attachments/assets/d404dff2-aaec-4805-97cc-ba2c8dbec1cd" />

## System Overview

The application utilizes the Next.js App Router with Server Components for optimal performance and SEO, coupled with Supabase for backend services.

| Component | Technology / Description |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Components). |
| **Language** | TypeScript for static typing and safety. |
| **Styling** | Tailwind CSS + Custom CSS for retro aesthetics. |
| **Database** | PostgreSQL (managed by Supabase). |
| **Authentication** | Supabase Auth (Email/Password). |
| **Storage** | Supabase Storage for image attachments. |
| **State** | React Hooks (`useActionState`, `useState`). |
| **Real-time** | `revalidate = 0` configuration for fresh data. |

---

## Implementation Details

### 1. Project Structure

The project follows a modular structure, separating server actions, UI components, and utility logic.

```bash
mini-twitter/
├── app/
│   ├── actions.ts                 # Server actions (Mutations)
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Main board view
│   ├── login/                     # Auth pages
│   └── thread/[id]/               # Dynamic thread routes
├── components/                    # Reusable UI (Forms, Views)
├── utils/                         # Supabase client & formatting
└── types.ts                       # TypeScript interfaces

```

### 2. Database Schema

The backend relies on three primary tables linked via foreign keys to handle users, discussions, and interactions.

```sql
-- Posts Table (Threads & Replies)
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT DEFAULT 'Anonymous',
  content TEXT NOT NULL,
  parent_id BIGINT REFERENCES posts(id), -- Null for threads, set for replies
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  avatar_url TEXT
);

-- Likes Table (Many-to-Many)
CREATE TABLE likes (
  user_id UUID REFERENCES auth.users(id),
  post_id BIGINT REFERENCES posts(id),
  UNIQUE(user_id, post_id)
);

```

### 3. Server Actions

Data mutations are handled exclusively through Next.js Server Actions to ensure security and progressive enhancement.

```typescript
// app/actions.ts example
export async function createPost(formData: FormData) {
  'use server'
  const supabase = createClient()
  // ... validation and database insertion logic
  revalidatePath('/')
}

```

---

## Visual Tour & Features

The interface is designed to evoke nostalgia while providing modern functionality.

### 1. Authentication & Profile Management

Users can sign up via email and customize their online persona. Profiles include display names, bios, and avatars.

<img width="487" height="297" alt="Login Screen" src="https://github.com/user-attachments/assets/843d6441-2db7-4be6-96c6-99a83c068449" />
<img width="1365" height="648" alt="Profile Editing" src="https://github.com/user-attachments/assets/7b1074bc-31ec-4fcb-a737-29149e423f36" />

### 2. Thread Creation & Media

Users can start threads with subject lines and attach images. The system handles file uploads directly to Supabase Storage.

<img width="1365" height="634" alt="Thread Creation" src="https://github.com/user-attachments/assets/496f4119-90d6-4af3-9fec-8a0c7c25d9c0" />

### 3. Interaction (Replies, Likes, Deletion)

The platform supports nested replies, a persistent like system, and self-moderation (deletion of own posts).

| Feature | Preview |
| --- | --- |
| **Replying** | <img width="441" height="146" alt="Reply Interface" src="https://github.com/user-attachments/assets/6ce1b8b0-b5d6-41af-b7af-a7f865690785" /> |
| **Liking** | <img width="430" height="144" alt="Like Button" src="https://github.com/user-attachments/assets/38c206f0-af29-4725-90da-9b3121b630b8" /> |
| **Deleting** | <img width="439" height="93" alt="Delete Button" src="https://github.com/user-attachments/assets/17af5ea7-f2fa-4710-b302-589c3af69da4" /> |

### 4. Retro Styling Palette

The "Yotsuba B" theme is achieved using specific hex codes in Tailwind.

| Color | Hex | Usage |
| --- | --- | --- |
| **Background** | `#eef2ff` | Main page background |
| **Post Box** | `#d6daf0` | Individual post containers |
| **Border** | `#b7c5d9` | Dividers and outlines |
| **Greentext** | `#789922` | Quoted text (`>text`) |

---

## Getting Started

Follow these steps to set up the project locally.

### 1. Installation

```bash
# 1. Clone the repository
git clone https://github.com/Camn0/mini-4chan/
cd mini-4chan

# 2. Install dependencies
npm install

```

### 2. Environment Setup

Create a `.env.local` file in the root directory. Get these credentials from your Supabase project settings.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

```

### 3. Database Setup (schema.sql)

To run this backend on your own Supabase project, execute the following SQL in your Supabase SQL Editor to generate the necessary tables, policies, and buckets:

```sql
-- 1. Profiles Table (User Data)
create table public.profiles (
  id uuid references auth.users not null primary key,
  display_name text,
  avatar_url text,
  bio text,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Automatic Profile Trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Posts Table (Thread & Reply)
create table public.posts (
  id bigint generated by default as identity primary key,
  user_id uuid references public.profiles(id),
  name text default 'Anonymous',
  subject text,
  content text not null,
  parent_id bigint references public.posts(id) on delete cascade,
  image_url text,
  image_filename text,
  image_size bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;
create policy "Public posts are viewable by everyone." on posts for select using (true);
create policy "Authenticated users can insert posts." on posts for insert with check (auth.role() = 'authenticated');
create policy "Users can delete own posts." on posts for delete using (auth.uid() = user_id);

-- 3. Likes Table
create table public.likes (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  post_id bigint references public.posts(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

alter table public.likes enable row level security;
create policy "Public view likes" on likes for select using (true);
create policy "Auth insert likes" on likes for insert with check (auth.uid() = user_id);
create policy "Auth delete likes" on likes for delete using (auth.uid() = user_id);

-- 4. Storage Buckets (Images & Avatars)
insert into storage.buckets (id, name, public) values ('board_images', 'board_images', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Images are public" on storage.objects for select using ( bucket_id = 'board_images' );
create policy "Anyone can upload images" on storage.objects for insert with check ( bucket_id = 'board_images' );

create policy "Avatars are public" on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Anyone can upload avatars" on storage.objects for insert with check ( bucket_id = 'avatars' );

```

### 4. Running the App

```bash
# Run the development server
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the application.
