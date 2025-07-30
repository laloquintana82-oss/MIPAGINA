'use client';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Cargando...</div>;
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Panel de Administración
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Bienvenido, {user.email}. Gestiona el contenido de tu blog aquí.
        </p>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gestionar Entradas</CardTitle>
            <CardDescription>Crea, edita y elimina artículos del blog.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/admin/posts">Gestionar Entradas</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gestionar Publicaciones</CardTitle>
            <CardDescription>Actualiza tus publicaciones académicas.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/papers">Gestionar Publicaciones</Link>
             </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ajustes del Sitio</CardTitle>
            <CardDescription>Actualiza tu perfil y la configuración general del sitio.</CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/admin/settings">Editar Ajustes</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
