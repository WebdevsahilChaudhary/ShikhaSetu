"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/lib/types";
import { useMemo } from "react";
import React from "react";
import { revalidateAll } from "@/app/actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  class: z.string().min(1, "Please select a class."),
  category_id: z.string().optional(),
  file: z.any().refine((files) => files?.length == 1, "File is required."),
});

interface UploadFormProps {
  categories: Category[];
}

// Helper function to render categories and their children recursively
const renderCategoryOptions = (
  categories: Category[],
  allCategories: Category[],
  parentId: string | null = null,
  level = 0
) => {
  const items = categories.filter((c) => c.parent_id === parentId);
  let options: React.ReactNode[] = [];
  
  items.forEach((item) => {
    options.push(
      <SelectItem key={item.id} value={item.id} style={{ paddingLeft: `${level * 1.5}rem` }}>
        {item.name}
      </SelectItem>
    );
    // Recursively render children
    options = options.concat(
      renderCategoryOptions(allCategories, allCategories, item.id, level + 1)
    );
  });
  
  return options;
};

export function UploadForm({ categories }: UploadFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      class: "",
      category_id: "null",
    },
  });

  const selectedClass = form.watch("class");

  const availableCategories = useMemo(() => {
    if (!selectedClass) return [];
    const classNumber = selectedClass.startsWith("12") ? "12" : "10";
    return categories.filter(
      (cat) => cat.class_association === classNumber || cat.class_association === "both"
    );
  }, [selectedClass, categories]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const file = values.file[0] as File;

    // 1. Upload file to Supabase Storage
    const filePath = `${values.class}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('materials') // bucket name
      .upload(filePath, file);

    if (uploadError) {
      toast({ variant: "destructive", title: "Upload Error", description: uploadError.message });
      return;
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    if (!urlData) {
      toast({ variant: "destructive", title: "Error", description: "Could not get file URL." });
      return;
    }

    // 3. Insert into materials table
    const { error: insertError } = await supabase.from('materials').insert({
      title: values.title,
      class: values.class,
      category_id: values.category_id === 'null' ? null : values.category_id,
      file_url: urlData.publicUrl,
      file_path: uploadData.path,
      size: file.size,
    });

    if (insertError) {
      toast({ variant: "destructive", title: "Database Error", description: insertError.message });
       // Optional: delete the file from storage if db insert fails
      await supabase.storage.from('materials').remove([filePath]);
      return;
    }

    toast({
      title: "Upload Successful",
      description: `"${values.title}" has been uploaded.`,
    });
    form.reset();
    
    // Use server action to revalidate cache
    await revalidateAll();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Physics Chapter 1 Notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('category_id', 'null'); // Reset category on class change
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">Class 10th</SelectItem>
                        <SelectItem value="12-science">Class 12th - Science</SelectItem>
                        <SelectItem value="12-commerce">Class 12th - Commerce</SelectItem>
                        <SelectItem value="12-arts">Class 12th - Arts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!selectedClass}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedClass ? "Select a category" : "Select a class first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {availableCategories.length > 0 && (
                          renderCategoryOptions(availableCategories, availableCategories)
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest }}) => {
                const { ref, ...fieldProps } = rest;
                return (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input type="file" onChange={(e) => onChange(e.target.files)} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <Button type="submit" className="font-semibold" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Uploading..." : "Upload Material"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
