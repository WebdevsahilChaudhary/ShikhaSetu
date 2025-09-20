"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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


export async function uploadMaterialAction(formData: FormData) {
    const supabase = createSupabaseServerClient();

    const title = formData.get('title') as string;
    const materialClass = formData.get('class') as string;
    const categoryId = formData.get('category_id') as string;
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        return { success: false, error: 'File is required.' };
    }

    // 1. Upload file to Supabase Storage
    const filePath = `${materialClass}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) {
      return { success: false, error: `Storage Error: ${uploadError.message}` };
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    if (!urlData) {
        // Attempt to clean up the uploaded file if we can't get a URL
        await supabase.storage.from('materials').remove([filePath]);
        return { success: false, error: "Could not get file URL." };
    }

    // 3. Insert into materials table
    const { error: insertError } = await supabase.from('materials').insert({
      title: title,
      class: materialClass,
      category_id: categoryId === 'null' || categoryId === '' ? null : categoryId,
      file_url: urlData.publicUrl,
      file_path: uploadData.path,
      size: file.size,
    });

    if (insertError) {
       // Attempt to clean up the uploaded file if db insert fails
      await supabase.storage.from('materials').remove([filePath]);
      return { success: false, error: `Database Error: ${insertError.message}` };
    }
    
    // 4. Revalidate relevant paths
    revalidatePath('/admin/dashboard');
    revalidatePath(`/class/${materialClass}`);

    return { success: true };
}


export async function updateMaterialAction(materialId: string, data: { title: string; class: string; category_id: string | null; }) {
    const supabase = createSupabaseServerClient();
    
    const { error } = await supabase
      .from('materials')
      .update({
        title: data.title,
        class: data.class,
        category_id: data.category_id === 'null' || data.category_id === '' ? null : data.category_id,
      })
      .eq('id', materialId);
      
    if (error) {
        return { success: false, error: `Could not update material: ${error.message}` };
    }

    revalidatePath('/admin/dashboard/materials');
    revalidatePath(`/class/${data.class}`);
    return { success: true };
}

export async function deleteMaterialAction(materialId: string, filePath: string | null, materialClass: string) {
  const supabase = createSupabaseServerClient();
  
  // 1. Attempt to delete from storage if a file path exists.
  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from('materials')
      .remove([filePath]);
    
    // Log and potentially stop if storage deletion fails for a reason other than "not found".
    // This allows deleting records even if the file was manually removed from storage.
    if (storageError && storageError.message !== 'The resource was not found') {
        console.error("Storage Error:", storageError.message);
        return { success: false, error: `Could not delete file: ${storageError.message}` };
    }
  }

  // 2. Delete from the database.
  const { error: dbError } = await supabase.from('materials').delete().match({ id: materialId });

  if (dbError) {
    console.error("Database Error:", dbError.message);
    return { success: false, error: dbError.message };
  }

  // 3. Revalidate paths to clear caches and update the UI.
  revalidatePath('/admin/dashboard/materials');
  revalidatePath(`/class/${materialClass}`);
  
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