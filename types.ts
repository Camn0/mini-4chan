export interface Post {
  id: number;
  name: string;
  subject?: string;
  content: string;
  created_at: string;
  image_url?: string;
  image_filename?: string;
  image_size?: number;
  parent_id?: number | null;
  likes?: Array<{ count: number }>;
}

export interface Thread extends Post {
  replies?: Post[];
}