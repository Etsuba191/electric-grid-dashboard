import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }
  if ((session.user as any).role === 'ADMIN') {
    redirect('/dashboard/admin');
  }
  const user = session.user as any;
  return <DashboardClient userEmail={user.email || ''} userRole={user.role?.toLowerCase() === 'admin' ? 'admin' : 'user'} />;
}
