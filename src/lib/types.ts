import type { Database } from './database.types';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Material = Omit<Database['public']['Tables']['materials']['Row'], 'categories'> & {
  file_type: "pdf" | "doc" | "zip";
  categories: { name: string; } | null;
};
