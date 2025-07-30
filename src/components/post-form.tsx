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
import { collection, doc, serverTimestamp, setDoc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from './article-card';

const postFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  excerpt: z.string().min(1, 'Excerpt is required.'),
  tags: z.string().min(1, 'Tags are required.'),
  date: z.string().min(1, 'Date is required.'),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  post?: Post | null;
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-')           // replace spaces with hyphens
        .replace(/-+/g, '-');            // remove consecutive hyphens
};


export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!post;

  const defaultValues: Partial<PostFormValues> = {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      tags: post?.tags?.join(', ') || '',
      date: post?.date || new Date().toISOString().split('T')[0],
  };

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: PostFormValues) => {
    setIsLoading(true);
    try {
        const slug = isEditMode ? post.slug : generateSlug(data.title);

        const postData = {
            title: data.title,
            excerpt: data.excerpt,
            tags: data.tags.split(',').map(tag => tag.trim()),
            date: data.date,
        };

        const docRef = doc(db, 'posts', slug);
        if (isEditMode) {
            await setDoc(docRef, postData, { merge: true });
            toast({
                title: 'Post Updated',
                description: 'Your blog post has been successfully updated.',
            });
        } else {
            await setDoc(docRef, postData);
            toast({
                title: 'Post Created',
                description: 'Your new blog post has been successfully created.',
            });
        }
        router.push('/admin/posts');
        router.refresh();
    } catch (error: any) {
        console.error('Error saving post:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Failed to save post.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Post' : 'Create New Post'}</CardTitle>
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
                      <Input placeholder="The Dawn of AI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short summary of the post..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="AI, Technology, Future" {...field} />
                    </FormControl>
                    <FormDescription>
                      Comma-separated tags.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Post')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
