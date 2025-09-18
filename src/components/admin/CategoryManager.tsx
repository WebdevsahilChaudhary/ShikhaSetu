"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import type { Category } from "@/lib/types";
import { format } from "date-fns";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CategoryManagerProps {
  initialCategories: Category[];
  materials: { id: string, category_id: string | null }[];
}

export function CategoryManager({ initialCategories, materials }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newClassAssociation, setNewClassAssociation] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editClassAssociation, setEditClassAssociation] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const handleCreateCategory = async () => {
    if (newCategoryName.trim() === "" || !newClassAssociation) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Category name and class association are required.",
      });
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName, class_association: newClassAssociation }])
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else if (data) {
      setCategories([data, ...categories]);
      setNewCategoryName("");
      setNewClassAssociation(null);
      setIsNewCategoryDialogOpen(false);
      toast({
        title: "Success",
        description: `Category "${newCategoryName}" created.`,
      });
      router.refresh();
    }
  };

  const openEditDialog = (category: Category) => {
    setCategoryToEdit(category);
    setEditCategoryName(category.name);
    setEditClassAssociation(category.class_association);
    setIsEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!categoryToEdit || editCategoryName.trim() === "" || !editClassAssociation) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required." });
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: editCategoryName, class_association: editClassAssociation })
      .match({ id: categoryToEdit.id })
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Update Error", description: error.message });
    } else if (data) {
      setCategories(categories.map(c => (c.id === data.id ? data : c)));
      setIsEditCategoryDialogOpen(false);
      setCategoryToEdit(null);
      toast({ title: "Success", description: "Category updated successfully." });
      router.refresh();
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    const { error } = await supabase.from('categories').delete().match({ id: category.id });

    if (error) {
       toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setCategories(categories.filter((c) => c.id !== category.id));
      toast({
        title: "Success",
        description: `Category "${category.name}" deleted.`,
      });
      router.refresh();
    }
    setCategoryToDelete(null);
  };

  const getMaterialCountForCategory = (categoryId: string) => {
    return materials.filter(m => m.category_id === categoryId).length;
  }
  
  const classAssociationMap: {[key: string]: string} = {
    '10': 'Class 10',
    '12': 'Class 12',
    'both': 'Both'
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                This category will be available for selection when uploading new materials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Notes, Question Papers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="class-association">Class Association</Label>
                 <Select onValueChange={setNewClassAssociation} value={newClassAssociation || undefined}>
                    <SelectTrigger id="class-association">
                      <SelectValue placeholder="Select class association" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setIsNewCategoryDialogOpen(false)} variant="outline">Cancel</Button>
              <Button type="button" onClick={handleCreateCategory}>
                Create Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Materials</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{classAssociationMap[category.class_association] || 'N/A'}</TableCell>
                <TableCell>{getMaterialCountForCategory(category.id)}</TableCell>
                <TableCell>{format(new Date(category.created_at), "PPP")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setCategoryToDelete(category)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-class-association">Class Association</Label>
                 <Select onValueChange={setEditClassAssociation} value={editClassAssociation || undefined}>
                    <SelectTrigger id="edit-class-association">
                      <SelectValue placeholder="Select class association" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Class 10</SelectItem>
                      <SelectItem value="12">Class 12</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={handleUpdateCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-bold"> "{categoryToDelete?.name}" </span>
              category. Any materials in this category will not be associated with it anymore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
