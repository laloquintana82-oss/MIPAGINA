'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Welcome, {user.email}. Manage your blog content here.
        </p>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Posts</CardTitle>
            <CardDescription>Create, edit, and delete blog articles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button disabled>Coming Soon</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
            <CardDescription>Update your profile and site-wide settings.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
