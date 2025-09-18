"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpenCheck, FolderKanban, UploadCloud, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="size-6 text-primary" />
            <span className="text-lg font-headline font-semibold text-foreground">ShikshaSetu</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/admin/dashboard"}
                tooltip="Upload Materials"
              >
                <Link href="/admin/dashboard">
                  <UploadCloud />
                  <span>Uploads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/admin/dashboard/categories"}
                tooltip="Manage Categories"
              >
                <Link href="/admin/dashboard/categories">
                  <FolderKanban />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
               <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="Admin" data-ai-hint="person face" />
               <AvatarFallback>A</AvatarFallback>
             </Avatar>
             <div className="flex flex-col text-sm">
                <span className="font-semibold text-sidebar-foreground">Admin</span>
                <span className="text-muted-foreground">admin@shiksha.setu</span>
             </div>
          </div>
           <Button variant="ghost" size="icon" className="ml-auto" asChild>
            <Link href="/"><LogOut /></Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-secondary">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header>
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
