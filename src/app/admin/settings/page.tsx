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
  intro: z.string().min(1, "Intro is required."),
  paragraph1: z.string().min(1, "This paragraph is required."),
  paragraph2: z.string().min(1, "This paragraph is required."),
  paragraph3: z.string().min(1, "This paragraph is required."),
  imageUrl: z.string().url("Please enter a valid URL."),
  linkedinUrl: z.string().url("Please enter a valid URL."),
  orcidUrl: z.string().url("Please enter a valid URL."),
  email: z.string().email("Please enter a valid email."),
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
      linkedinUrl: "",
      orcidUrl: "",
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
        form.reset(docSnap.data() as SettingsFormValues);
      }
    };
    fetchSettings();
  }, [form]);

  const onSubmit = async (data: SettingsFormValues) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "content", "about");
      await setDoc(docRef, data, { merge: true });
      toast({
        title: "Settings Saved",
        description: "Your 'About Me' page has been updated.",
      });
    } catch (error) {
      console.error("Error saving settings: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <Card>
        <CardHeader>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Update the content for your &quot;About Me&quot; page here.
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
                    <FormLabel>Intro Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Researcher, writer, and lifelong learner." {...field} />
                    </FormControl>
                    <FormDescription>
                      A short introduction shown below the main title.
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
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-image-url.com/profile.png" {...field} />
                    </FormControl>
                     <FormDescription>
                      The URL for your portrait image. You can upload an image to a service like Imgur.
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
                    <FormLabel>First Paragraph</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little bit about yourself..." {...field} />
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
                    <FormLabel>Second Paragraph</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Continue your story..." {...field} />
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
                    <FormLabel>Third Paragraph</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conclude your bio..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/your-profile" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="orcidUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ORCID URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://orcid.org/your-id" {...field} />
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
