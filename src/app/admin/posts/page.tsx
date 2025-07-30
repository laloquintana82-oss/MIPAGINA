'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Post } from '@/components/article-card';
import { PlusCircle, Trash2, Edit, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const featuredPostsCount = posts.filter(p => p.featured).length;

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const postsCollection = collection(db, 'posts');
      const q = query(postsCollection, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        slug: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(postsData);
    } catch (error) {
      console.error('Error al obtener las entradas:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron obtener las entradas.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
    if (user) {
      fetchPosts();
    }
  }, [user, authLoading, router]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', postToDelete));
      toast({
        title: 'Entrada Eliminada',
        description: 'La entrada del blog ha sido eliminada exitosamente.',
      });
      setPostToDelete(null);
      fetchPosts(); // Refresh posts list
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la entrada.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFeatureToggle = async (slug: string, currentStatus: boolean) => {
    if (!currentStatus && featuredPostsCount >= 2) {
      toast({
        variant: 'destructive',
        title: 'Límite Alcanzado',
        description: 'Solo puedes destacar un máximo de 2 entradas.',
      });
      return;
    }

    const postRef = doc(db, 'posts', slug);
    try {
      await updateDoc(postRef, { featured: !currentStatus });
      // Optimistic update
      setPosts(posts.map(p => p.slug === slug ? { ...p, featured: !currentStatus } : p));
      toast({
        title: 'Éxito',
        description: `La entrada ha sido ${!currentStatus ? 'destacada' : 'quitada de destacados'}.`,
      });
    } catch (error) {
      console.error('Error al actualizar la entrada:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar la entrada.',
      });
    }
  };

  if (authLoading || isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestionar Entradas</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Nueva Entrada
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>Una lista de las entradas de tu blog. Puedes destacar hasta 2 en la página de inicio.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Destacado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.slug}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Switch
                  checked={post.featured || false}
                  onCheckedChange={() => handleFeatureToggle(post.slug, post.featured || false)}
                  disabled={!post.featured && featuredPostsCount >= 2}
                  aria-label="Destacar entrada"
                />
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/posts/edit/${post.slug}`}>
                    <Edit />
                    <span className="sr-only">Editar</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" onClick={() => setPostToDelete(post.slug)}>
                      <Trash2 />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la entrada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePost} disabled={isDeleting}>
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
