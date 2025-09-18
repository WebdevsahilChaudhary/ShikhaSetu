import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // In a real app, you'd check auth status here and redirect
  // to '/admin/dashboard' if authenticated. For this mock,
  // we'll just redirect to the login page.
  redirect('/admin/login');
}
