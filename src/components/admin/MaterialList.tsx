"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import type { Material } from "@/lib/types";
import { format } from "date-fns";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface MaterialListProps {
  materials: Material[];
}

const classMap: Record<string, string> = {
    '10': 'Class 10th',
    '12-science': 'Class 12th - Science',
    '12-commerce': 'Class 12th - Commerce',
    '12-arts': 'Class 12th - Arts',
}

export function MaterialList({ materials: initialMaterials }: MaterialListProps) {
  const [materials, setMaterials] = useState(initialMaterials);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (material: Material) => {
    if (!material.file_path) {
        toast({ variant: "destructive", title: "Error", description: "File path is missing. Cannot delete from storage." });
        return;
    }

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([material.file_path]);

    if (storageError) {
        toast({ variant: "destructive", title: "Storage Error", description: storageError.message });
        // We might not want to proceed if storage deletion fails, but for now we'll allow it.
        // In a production scenario, you might want to stop here.
    }

    // 2. Delete from database
    const { error: dbError } = await supabase.from('materials').delete().match({ id: material.id });

    if (dbError) {
        toast({ variant: "destructive", title: "Database Error", description: dbError.message });
    } else {
        setMaterials(materials.filter((m) => m.id !== material.id));
        toast({ title: "Success", description: "Material deleted successfully." });
        router.refresh();
    }
    setMaterialToDelete(null);
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.title}</TableCell>
                <TableCell>{classMap[material.class] || material.class}</TableCell>
                <TableCell>{material.categories?.name || "Uncategorized"}</TableCell>
                <TableCell>{format(new Date(material.created_at), "PPP")}</TableCell>
                <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/dashboard/materials/${material.id}/edit`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setMaterialToDelete(material)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!materialToDelete} onOpenChange={() => setMaterialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the material
              <span className="font-bold"> "{materialToDelete?.title}"</span> and its associated file from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => materialToDelete && handleDelete(materialToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
