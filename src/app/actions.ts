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

export async function deleteMaterialAction(materialId: string, filePath: string | null) {
  const supabase = createSupabaseServerClient();
  
  // 1. Attempt to delete from storage if a file path exists.
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from('materials')
      .remove([filePath]);
    
    // Log and potentially stop if storage deletion fails for a reason other than "not found".
    if (storageError && storageError.message !== 'The resource was not found') {
        console.error("Storage Error:", storageError.message);
        return { success: false, error: `Could not delete file: ${storageError.message}` };
    }
  }

  // 2. Delete from the database.
  const { data: deletedMaterial, error: dbError } = await supabase.from('materials').delete().match({ id: materialId }).select().single();

  if (dbError) {
    console.error("Database Error:", dbError.message);
    return { success: false, error: dbError.message };
  }
  
  if (!deletedMaterial) {
      return { success: false, error: "Material not found in database." };
  }

  // 3. Revalidate paths to clear caches and update the UI.
  revalidatePath('/admin/dashboard/materials');
  revalidatePath(`/class/${deletedMaterial.class}`);
  
  return { success: true };
}


export async function deleteCategoryAction(categoryId: string) {
  const supabase = createSupabaseServerClient();
  
  // First, check if the category has children.
  const { data: children, error: childrenError } = await supabase
    .from('categories')
    .select('id')
    .eq('parent_id', categoryId)
    .limit(1);

  if (childrenError) {
      console.error("Error checking for children:", childrenError.message);
      return { success: false, error: "Could not verify category children." };
  }
  if (children && children.length > 0) {
      return { success: false, error: "This category has sub-categories. Please delete or re-assign them first." };
  }


  const { error } = await supabase.from('categories').delete().match({ id: categoryId });

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

export async function revalidateAll() {
    revalidatePath('/', 'layout');
}
