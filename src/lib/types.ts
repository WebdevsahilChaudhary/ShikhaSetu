import type { Database } from './database.types';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Material = Database['public']['Tables']['materials']['Row'] & {
  file_type: "pdf" | "doc" | "zip"; // Add file_type as it's used in the frontend but not in db
};
