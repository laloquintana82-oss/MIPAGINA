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
  title: z.string().min(1, 'El título es obligatorio.'),
  authors: z.string().min(1, 'Los autores son obligatorios.'),
  year: z.string().min(4, 'El año es obligatorio.'),
  link: z.string().url('Se requiere una URL válida.'),
  abstract: z.string().min(1, 'El resumen es obligatorio.'),
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
                title: 'Publicación Actualizada',
                description: 'Tu publicación ha sido actualizada exitosamente.',
            });
        } else {
            await addDoc(collection(db, 'papers'), paperData);
            toast({
                title: 'Publicación Creada',
                description: 'Tu nueva publicación ha sido creada exitosamente.',
            });
        }
        
        router.push('/admin/papers');
        router.refresh();

    } catch (error: any) {
        console.error('Error al guardar la publicación:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'No se pudo guardar la publicación.',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Publicación' : 'Crear Nueva Publicación'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="El Entrelazamiento Cuántico y sus Implicaciones" {...field} />
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
                    <FormLabel>Autores</FormLabel>
                    <FormControl>
                      <Input placeholder="A. Autor, B. Coautor" {...field} />
                    </FormControl>
                    <FormDescription>
                      Autores separados por comas.
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
                    <FormLabel>Año</FormLabel>
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
                    <FormLabel>Enlace</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/paper.pdf" {...field} />
                    </FormControl>
                     <FormDescription>
                      Un enlace a la publicación (ej. PDF, arXiv, página de la revista).
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
                    <FormLabel>Resumen</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Un breve resumen de la publicación..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (isEditMode ? 'Guardando...' : 'Creando...') : (isEditMode ? 'Guardar Cambios' : 'Crear Publicación')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
