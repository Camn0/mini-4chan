# /exercise/ - Mini Twitter

A retro-style imageboard application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**. Styled after classic imageboards with a Yotsuba B color theme.

---

## Features

- **User Authentication** - Sign up and log in with email/password via Supabase Auth
- **Profile Management** - Edit display name, bio, and upload avatar
- **Thread Creation** - Create discussion threads with optional file attachments
- **Reply System** - Post replies to existing threads with nested view
- **Like System** - Like posts with persistent counts aggregated from Supabase
- **File Uploads** - Upload images to threads/replies stored in Supabase Storage
- **Retro UI** - Nostalgic imageboard design with Yotsuba B color palette
- **Real-time Updates** - Posts configured for fresh data (no stale cache)
- **Greentext Formatting** - Auto-format `>quote` and `>>reply` lines with special styling

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router, Server Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Custom CSS |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email/Password) |
| **File Storage** | Supabase Storage |
| **State** | React Hooks (useActionState, useState) |

---

## Project Structure

```
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
├── public/                        # Static assets
├── types.ts                       # TypeScript interfaces (Post, Thread)
├── tsconfig.json                  # TypeScript config with path aliases
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS config
├── package.json                   # Dependencies
└── .env.local                     # Environment variables (not in repo)
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd mini-twitter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   Get these values from your Supabase project settings → API.

4. **Configure Supabase**
   
   Create the required tables in your Supabase database:

   **posts table:**
   ```sql
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
   ```

   **profiles table:**
   ```sql
   CREATE TABLE profiles (
     id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
     display_name TEXT,
     bio TEXT,
     avatar_url TEXT,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **likes table:**
   ```sql
   CREATE TABLE likes (
     id BIGSERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
     post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(user_id, post_id)
   );
   ```

   **Storage Buckets:**
   - Create a bucket named `post-images` (for post attachments)
   - Create a bucket named `avatars` (for user avatars)

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How to Use

### Creating an Account
1. Go to `/login` page
2. Fill in the **New User Registration** form
3. Click "Sign Up"
4. Log in with your new credentials

### Editing Your Profile
1. Click your username (top-right corner)
2. Edit display name, bio, and upload avatar
3. Click "Update Profile"

### Creating a Thread
1. On the home page (`/`), fill the **posting form**
2. Enter optional subject and comment
3. Optionally attach an image file
4. Click "Post"

### Replying to a Thread
1. Click `[Reply]` on any thread
2. Fill the reply form on the thread page
3. Click "Reply"

### Liking Posts
1. Click the `♥ Like` button on any post
2. Like counts appear next to the heart icon

### Deleting Posts
1. Click the `[x]` button on your own post
2. Confirm deletion

### Formatting

Posts support special text formatting:

| Format | Example | Result |
|--------|---------|--------|
| **Greentext** | `>This is greentext` | Green colored quote |
| **Reply Link** | `>>123` | Blue hyperlink |
| **Line breaks** | Press Enter | `<br />` rendered |

---

## Server Actions

All data mutations happen through **Next.js Server Actions** in `app/actions.ts`:

- `login()` - Authenticate with email/password
- `signup()` - Create new user account
- `signout()` - End user session
- `updateProfile()` - Update user display name, bio, avatar
- `createPost()` - Create thread or reply (with optional file upload)
- `deletePost()` - Remove post (own posts only)
- `toggleLike()` - Like/unlike a post

---

## Styling

The app uses a **retro imageboard theme** inspired by Yotsuba B:

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#eef2ff` | Page background |
| Post Box | `#d6daf0` | Post containers |
| Border | `#b7c5d9` | Borders |
| Title | `#0f0c5d` | Section titles |
| Name | `#117743` | Poster names |
| Greentext | `#789922` | `>quoted` text |
| Links | `#34345c` | Hyperlinks |

### CSS Classes
- Global styles with Tailwind + custom CSS in `app/globals.css`
- Post items use `.reply-box` style for bordered containers
- Greentext uses `.greentext` class for color

---

## Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Tablet: `md:` prefix for medium screens
- Images scale down for mobile (thumbnails max 125px)

---

## Troubleshooting

### Cannot find module '@/types'
- Ensure `types.ts` exists in the project root
- Check `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["./*"] }`
- Restart TypeScript server (Ctrl+Shift+P → "TypeScript: Restart TS Server")

### Supabase connection errors
- Verify `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active and tables exist
- Ensure Row Level Security (RLS) policies allow public/auth access

### File upload not working
- Check storage buckets exist (`post-images`, `avatars`)
- Verify bucket policies allow authenticated uploads
- File size may exceed limit (check Supabase settings)

### Posts not appearing
- Check `revalidate = 0` in page components (disables caching)
- Verify posts table has correct structure
- Check user permissions in RLS policies

---

## Deployment

### Deploy on Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Development Notes

- **Server Components by default** for database queries and auth checks
- **Client Components** only for interactivity (`'use client'` directive)
- **Server Actions** handle all mutations with form submissions
- **Dynamic routes** with `[id]` segment for individual threads
- **Revalidation disabled** (`revalidate = 0`) for real-time updates
- **Type safety** with TypeScript interfaces for Post/Thread types

---

## Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

---

## License

This project is provided as-is for educational purposes.

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

Enjoy your retro imageboard! 🎉
