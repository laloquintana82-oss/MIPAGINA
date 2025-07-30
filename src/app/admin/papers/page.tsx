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
import { Paper } from '@/components/paper-card';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

export default function ManagePapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const papersCollection = collection(db, 'papers');
      const q = query(papersCollection, orderBy('year', 'desc'));
      const querySnapshot = await getDocs(q);
      const papersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Paper[];
      setPapers(papersData);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch papers.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPapers();
    }
  }, [user]);

  const handleDeletePaper = async () => {
    if (!paperToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'papers', paperToDelete));
      toast({
        title: 'Paper Deleted',
        description: 'The publication has been successfully deleted.',
      });
      setPaperToDelete(null);
      fetchPapers(); // Refresh papers list
    } catch (error) {
      console.error('Error deleting paper:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete paper.',
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
        <h1 className="text-3xl font-bold">Manage Papers</h1>
        <Button asChild>
          <Link href="/admin/papers/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Paper
          </Link>
        </Button>
      </div>
      <Table>
        <TableCaption>A list of your academic papers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Year</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {papers.map(paper => (
            <TableRow key={paper.id}>
              <TableCell className="font-medium">{paper.title}</TableCell>
              <TableCell>{paper.year}</TableCell>
              <TableCell className="text-right space-x-2">
                 <Button variant="outline" size="icon" asChild>
                  <Link href={`/admin/papers/edit/${paper.id}`}>
                    <Edit />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" onClick={() => setPaperToDelete(paper.id)}>
                      <Trash2 />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the publication.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setPaperToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePaper} disabled={isDeleting}>
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
