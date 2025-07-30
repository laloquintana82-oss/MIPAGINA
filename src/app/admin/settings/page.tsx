'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const settingsFormSchema = z.object({
  intro: z.string().min(1, "La introducción es obligatoria."),
  paragraph1: z.string().min(1, "Este párrafo es obligatorio."),
  paragraph2: z.string().min(1, "Este párrafo es obligatorio."),
  paragraph3: z.string().min(1, "Este párrafo es obligatorio."),
  imageUrl: z.string().url("Por favor, introduce una URL válida."),
  xUrl: z.string().url("Por favor, introduce una URL válida de X/Twitter.").optional().or(z.literal('')),
  instagramUrl: z.string().url("Por favor, introduce una URL válida de Instagram.").optional().or(z.literal('')),
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      intro: "",
      paragraph1: "",
      paragraph2: "",
      paragraph3: "",
      imageUrl: "",
      xUrl: "",
      instagramUrl: "",
      email: ""
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "content", "about");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // data migration from linkedinUrl to xUrl
        if (data.linkedinUrl && !data.xUrl) {
            data.xUrl = data.linkedinUrl;
            delete data.linkedinUrl;
        }
        form.reset(data as SettingsFormValues);
      }
    };
    if (user) {
        fetchSettings();
    }
  }, [user, form.reset]);

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "content", "about");
      await setDoc(docRef, data, { merge: true });
      toast({
        title: "Ajustes Guardados",
        description: "Tu página 'Sobre Mí' ha sido actualizada.",
      });
    } catch (error) {
      console.error("Error al guardar los ajustes: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los ajustes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="container mx-auto px-4 py-12 text-center">Cargando...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>Ajustes del Sitio</CardTitle>
          <CardDescription>
            Actualiza el contenido de tu página &quot;Sobre Mí&quot; aquí.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="intro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de Introducción</FormLabel>
                    <FormControl>
                      <Input placeholder="Investigador, escritor y aprendiz permanente." {...field} />
                    </FormControl>
                    <FormDescription>
                      Una breve introducción que se muestra debajo del título principal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la Imagen de Perfil</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tu-imagen.com/perfil.png" {...field} />
                    </FormControl>
                     <FormDescription>
                      La URL de tu imagen de retrato. Puedes subir una imagen a un servicio como Imgur.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="paragraph1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primer Párrafo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Cuéntanos un poco sobre ti..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="paragraph2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segundo Párrafo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Continúa tu historia..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="paragraph3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tercer Párrafo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Concluye tu biografía..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="xUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de X (Twitter)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://x.com/tu-perfil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/tu-perfil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección de Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
