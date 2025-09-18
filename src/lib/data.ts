import type { Category, Material } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-1", name: "Chapterwise Notes", created_at: new Date().toISOString() },
  { id: "cat-2", name: "Previous Year Questions (PYQs)", created_at: new Date().toISOString() },
  { id: "cat-3", name: "Sample Papers", created_at: new Date().toISOString() },
  { id: "cat-4", name: "Textbooks", created_at: new Date().toISOString() },
  { id: "cat-5", name: "Practicals", created_at: new Date().toISOString() },
];

export const materials: Material[] = [
  // Class 10
  { id: "mat-1", title: "Science Ch. 1: Gravitation Notes", class: "10", category_id: "cat-1", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
  { id: "mat-2", title: "Maths Part I: Algebra Textbook", class: "10", category_id: "cat-4", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
  { id: "mat-3", title: "Social Science PYQs 2023", class: "10", category_id: "cat-2", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
  { id: "mat-4", title: "English Sample Paper - Set A", class: "10", category_id: "cat-3", file_url: "#", file_type: "doc", created_at: new Date().toISOString() },

  // Class 12 Science
  { id: "mat-5", title: "Physics Ch. 3: Rotational Dynamics Notes", class: "12-science", category_id: "cat-1", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
  { id: "mat-6", title: "Chemistry Practicals Handbook", class: "12-science", category_id: "cat-5", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
  { id: "mat-7", title: "Biology PYQs (2020-2023)", class: "12-science", category_id: "cat-2", file_url: "#", file_type: "zip", created_at: new Date().toISOString() },
  { id: "mat-8", title: "Maths & Stats Sample Paper", class: "12-science", category_id: "cat-3", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
  { id: "mat-9", title: "HSC Physics Textbook", class: "12-science", category_id: "cat-4", file_url: "#", file_type: "pdf", created_at: new Date().toISOString() },
];
