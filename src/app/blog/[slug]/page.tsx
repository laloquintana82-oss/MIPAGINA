import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { type Post } from '@/components/article-card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

async function getPost(slug: string): Promise<Post | null> {
    try {
        const docRef = doc(db, 'posts', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                slug,
                ...docSnap.data()
            } as Post;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching post: ", error);
        return null;
    }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
             <div className="mb-8">
                <Button asChild variant="ghost">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Blog
                    </Link>
                </Button>
            </div>
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-center text-balance">
                    {post.title}
                </h1>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground">
                    <time dateTime={post.date}>{formattedDate}</time>
                    <div className="flex flex-wrap justify-center gap-2">
                        {post.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
            </header>
            
            {post.imageUrl && (
                <div className="relative my-12 h-96 w-full max-w-3xl mx-auto overflow-hidden rounded-lg shadow-xl">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        data-ai-hint="post image"
                        priority
                    />
                </div>
            )}
            
            <div 
                className="prose prose-lg dark:prose-invert mx-auto max-w-3xl prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
        </article>
    );
}
