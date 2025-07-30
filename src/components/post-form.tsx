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
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post } from './article-card';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { Switch } from './ui/switch';

const postFormSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio.'),
  excerpt: z.string().min(1, 'El extracto es obligatorio.'),
  tags: z.string().min(1, 'Las etiquetas son obligatorias.'),
  date: z.string().min(1, 'La fecha es obligatoria.'),
  imageUrl: z.string().url('Por favor, introduce una URL válida.').optional().or(z.literal('')),
  featured: z.boolean().default(false).optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface PostFormProps {
  post?: Post | null;
}

const generateSlug = (title: string) => {
    if (!title) return '';
    return title
        .toString()
        .toLowerCase()
        .normalize('NFD') 
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '') 
        .replace(/\s+/g, '-')           
        .replace(/-+/g, '-');
};


export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(post?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditMode = !!post;

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      tags: post?.tags?.join(', ') || '',
      date: post?.date || new Date().toISOString().split('T')[0],
      imageUrl: post?.imageUrl || '',
      featured: post?.featured || false,
    },
    mode: "onChange",
  });
  
  const imageUrlValue = form.watch('imageUrl');

  useEffect(() => {
    if (!imageFile && imageUrlValue) {
      setImagePreview(imageUrlValue);
    }
  }, [imageUrlValue, imageFile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PostFormValues) => {
    if (isLoading || isUploading) return;
    
    // Check featured limit before submitting
    if (data.featured && !isEditMode) {
      const postsCollection = collection(db, 'posts');
      const q = query(postsCollection, where('featured', '==', true));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size >= 2) {
          toast({
              variant: 'destructive',
              title: 'Límite de Destacados Alcanzado',
              description: 'Solo puedes tener 2 entradas destacadas. Por favor, desmarca una antes de destacar esta.',
          });
          return;
      }
    }


    setIsLoading(true);

    try {
        const slug = isEditMode ? post!.slug : generateSlug(data.title);

        if (!slug) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'No se pudo generar un slug. Por favor, introduce un título válido.',
          });
          setIsLoading(false);
          return;
        }

        let finalImageUrl = data.imageUrl || '';
        
        if (imageFile) {
            setIsUploading(true);
            const storageRef = ref(storage, `posts/${slug}-${Date.now()}-${imageFile.name}`);
            const uploadResult = await uploadBytes(storageRef, imageFile);
            finalImageUrl = await getDownloadURL(uploadResult.ref);
            setIsUploading(false);
        }

        const postData = {
            ...data,
            tags: data.tags.split(',').map(tag => tag.trim()),
            imageUrl: finalImageUrl,
        };

        const docRef = doc(db, 'posts', slug);
        await setDoc(docRef, postData, { merge: isEditMode });
        
        toast({
            title: isEditMode ? 'Entrada Actualizada' : 'Entrada Creada',
            description: `La entrada del blog ha sido ${isEditMode ? 'actualizada' : 'creada'} exitosamente.`,
        });
        
        router.push('/admin/posts');
        router.refresh();

    } catch (error: any) {
        console.error('Error al guardar la entrada:', error);
        setIsUploading(false);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'No se pudo guardar la entrada.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const buttonText = () => {
    if (isUploading) return 'Subiendo imagen...';
    if (isLoading) return isEditMode ? 'Guardando...' : 'Creando...';
    return isEditMode ? 'Guardar Cambios' : 'Crear Entrada';
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Entrada' : 'Crear Nueva Entrada'}</CardTitle>
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
                      <Input placeholder="El Amanecer de la IA" {...field} disabled={isEditMode}/>
                    </FormControl>
                     <FormDescription>
                      El título no se puede cambiar una vez creada la entrada.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Destacar en la Página de Inicio
                        </FormLabel>
                        <FormDescription>
                          Marca esta opción para mostrar esta entrada en la página principal. (Máx. 2)
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace de la Imagen</FormLabel>
                    <FormControl>
                      <Input placeholder="https://ejemplo.com/imagen.png" {...field} />
                    </FormControl>
                     <FormDescription>
                      Pega aquí la URL de una imagen.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormItem>
                <FormLabel>O Sube la Imagen del Post</FormLabel>
                <FormControl>
                    <Input type="file" accept="image/*" onChange={handleImageChange} />
                </FormControl>
                {imagePreview && (
                    <div className="mt-4 relative w-full h-64">
                    <Image
                        src={imagePreview}
                        alt="Vista previa de la imagen"
                        fill
                        className="object-contain rounded-md"
                    />
                    </div>
                )}
                <FormDescription>
                    Sube una imagen desde tu dispositivo. Si subes una, tendrá prioridad sobre el enlace.
                </FormDescription>
                <FormMessage />
               </FormItem>
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contenido</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe aquí el contenido de tu post..."
                        {...field}
                        rows={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Este es el contenido principal de tu entrada. Puedes usar HTML para formatear.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                      <Input placeholder="IA, Tecnología, Futuro" {...field} />
                    </FormControl>
                    <FormDescription>
                      Etiquetas separadas por comas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || isUploading}>
                {buttonText()}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
