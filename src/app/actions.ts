"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Material, Category } from "@/lib/types";

// This centralizes the creation of a Supabase client for server-side operations.
const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};

export async function deleteMaterialAction(material: Material) {
  const supabase = createSupabaseServerClient();
  
  // 1. Attempt to delete from storage if a file path exists.
  if (material.file_path) {
    const { error: storageError } = await supabase.storage
      .from('materials')
      .remove([material.file_path]);
    
    // Log and potentially stop if storage deletion fails for a reason other than "not found".
    if (storageError && storageError.message !== 'The resource was not found') {
        console.error("Storage Error:", storageError.message);
        return { success: false, error: `Could not delete file: ${storageError.message}` };
    }
  }

  // 2. Delete from the database.
  const { error: dbError } = await supabase.from('materials').delete().match({ id: material.id });

  if (dbError) {
    console.error("Database Error:", dbError.message);
    return { success: false, error: dbError.message };
  }

  // 3. Revalidate paths to clear caches and update the UI.
  revalidatePath('/admin/dashboard/materials');
  revalidatePath(`/class/${material.class}`);
  
  return { success: true };
}


export async function deleteCategoryAction(category: Category) {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('categories').delete().match({ id: category.id });

  if (error) {
    console.error("Database Error:", error.message);
    return { success: false, error: error.message };
  }

  // Revalidate all pages that might be affected by a category change.
  revalidatePath('/admin/dashboard/categories');
  revalidatePath('/admin/dashboard'); // Upload form uses categories
  revalidatePath('/admin/dashboard/materials'); // Materials list uses categories
  revalidatePath('/class/10');
  revalidatePath('/class/12-science');
  revalidatePath('/class/12-commerce');
  revalidatePath('/class/12-arts');

  return { success: true };
}
