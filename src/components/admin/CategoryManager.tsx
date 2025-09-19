"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
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
import { CategoryTree } from "./CategoryTree";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CategoryManagerProps {
  initialCategories: Category[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newClassAssociation, setNewClassAssociation] = useState<string | null>(null);
  const [newParentId, setNewParentId] = useState<string | null>(null);
  
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editClassAssociation, setEditClassAssociation] = useState<string | null>(null);
  const [editParentId, setEditParentId] = useState<string | null>(null);


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
      .insert([{ name: newCategoryName, class_association: newClassAssociation, parent_id: newParentId }])
      .select()
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else if (data) {
      setCategories([data, ...categories]);
      setNewCategoryName("");
      setNewClassAssociation(null);
      setNewParentId(null);
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
    setEditParentId(category.parent_id);
    setIsEditCategoryDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!categoryToEdit || editCategoryName.trim() === "" || !editClassAssociation) {
      toast({ variant: "destructive", title: "Error", description: "All fields are required." });
      return;
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: editCategoryName, class_association: editClassAssociation, parent_id: editParentId })
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
  
  const openDeleteDialog = (category: Category) => {
     // Check if the category has children
    const children = categories.filter(c => c.parent_id === category.id);
    if (children.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot Delete Category",
        description: "This category has sub-categories. Please delete or re-assign them first.",
      });
      return;
    }
    setCategoryToDelete(category);
  }

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
  
  const topLevelCategories = categories.filter(c => !c.parent_id);

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
                You can optionally assign this to a parent category to create a hierarchy.
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
              <div className="space-y-2">
                <Label htmlFor="parent-category">Parent Category (Optional)</Label>
                 <Select onValueChange={setNewParentId} value={newParentId || undefined}>
                    <SelectTrigger id="parent-category">
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">None (Top-Level)</SelectItem>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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

      <div className="border rounded-lg p-4">
        <CategoryTree 
          categories={categories}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
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
              <div className="space-y-2">
                <Label htmlFor="edit-parent-category">Parent Category (Optional)</Label>
                 <Select onValueChange={setEditParentId} value={editParentId || undefined}>
                    <SelectTrigger id="edit-parent-category">
                      <SelectValue placeholder="Select a parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">None (Top-Level)</SelectItem>
                      {categories.filter(c => c.id !== categoryToEdit?.id).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
              category. Any materials associated with this category will be un-categorized.
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
