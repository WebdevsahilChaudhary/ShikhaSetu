import { redirect } from 'next/navigation';

export default function AdminRootPage() {
  // The layout will handle the auth check and redirect if not logged in.
  // If the user is logged in, they should be taken to the dashboard.
  redirect('/admin/dashboard');
}
