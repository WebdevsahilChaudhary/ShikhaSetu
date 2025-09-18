export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Material = {
  id: string;
  title: string;
  class: string;
  category_id: string;
  file_url: string;
  file_type: "pdf" | "doc" | "zip";
  created_at: string;
};
