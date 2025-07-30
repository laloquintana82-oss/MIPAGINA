'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
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
import { PlusCircle, Trash2, Edit } from 'lucide-react';

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

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
      console.error('Error fetching posts:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch posts.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'posts', postToDelete));
      toast({
        title: 'Post Deleted',
        description: 'The blog post has been successfully deleted.',
      });
      setPostToDelete(null);
      fetchPosts(); // Refresh posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete post.',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (authLoading || isLoading) {
     return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
       <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Post
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your blog posts.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map(post => (
            <TableRow key={post.slug}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                 <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/posts/edit/${post.slug}`}>
                    <Edit />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" onClick={() => setPostToDelete(post.slug)}>
                      <Trash2 />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePost} disabled={isDeleting}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
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
