'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <div>
        <p>Welcome, {session?.user?.name}!</p>
        <p>Your email: {session?.user?.email}</p>
      </div>
    </div>
  );
}
