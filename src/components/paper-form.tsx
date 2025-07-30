'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Paper } from './paper-card';

const paperFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  authors: z.string().min(1, 'Authors are required.'),
  year: z.string().min(4, 'Year is required.'),
  link: z.string().url('A valid URL is required.'),
  abstract: z.string().min(1, 'Abstract is required.'),
});

type PaperFormValues = z.infer<typeof paperFormSchema>;

interface PaperFormProps {
  paper?: Paper | null;
}

export default function PaperForm({ paper }: PaperFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!paper;

  const form = useForm<PaperFormValues>({
    resolver: zodResolver(paperFormSchema),
    defaultValues: {
      title: paper?.title || '',
      authors: paper?.authors?.join(', ') || '',
      year: paper?.year || new Date().getFullYear().toString(),
      link: paper?.link || '',
      abstract: paper?.abstract || '',
    },
    mode: "onChange",
  });

  const onSubmit = async (data: PaperFormValues) => {
    setIsLoading(true);
    try {
        const paperData = {
            ...data,
            authors: data.authors.split(',').map(author => author.trim()),
        };

        if (isEditMode && paper.id) {
            const docRef = doc(db, 'papers', paper.id);
            await setDoc(docRef, paperData, { merge: true });
            toast({
                title: 'Paper Updated',
                description: 'Your publication has been successfully updated.',
            });
        } else {
            await addDoc(collection(db, 'papers'), paperData);
            toast({
                title: 'Paper Created',
                description: 'Your new publication has been successfully created.',
            });
        }
        
        router.push('/admin/papers');
        router.refresh();

    } catch (error: any) {
        console.error('Error saving paper:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Failed to save paper.',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Paper' : 'Create New Paper'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Quantum Entanglement and its Implications" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="authors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authors</FormLabel>
                    <FormControl>
                      <Input placeholder="A. Author, B. Coauthor" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated authors.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/paper.pdf" {...field} />
                    </FormControl>
                     <FormDescription>
                      A link to the paper (e.g., PDF, arXiv, journal page).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Abstract</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short summary of the paper..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Paper')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
