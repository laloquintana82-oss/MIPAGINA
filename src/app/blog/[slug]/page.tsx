import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';
import { type Post } from '@/components/article-card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
                <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg">
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
            
            <div className="prose prose-lg mx-auto max-w-3xl text-muted-foreground dark:prose-invert prose-p:text-justify">
                {post.excerpt.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </article>
    );
}

// Helper styles for prose
const proseStyles = `
.prose {
    color: var(--foreground);
}
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
    color: var(--foreground);
}
.prose a {
    color: hsl(var(--primary-foreground));
}
.prose blockquote {
    border-left-color: hsl(var(--primary));
    color: hsl(var(--muted-foreground));
}
.prose code {
    color: hsl(var(--accent-foreground));
}
.dark .prose {
    color: hsl(var(--foreground));
}
.dark .prose h1, .dark .prose h2, .dark .prose h3, .dark .prose h4, .dark .prose h5, .dark .prose h6 {
    color: hsl(var(--foreground));
}
.dark .prose a {
    color: hsl(var(--primary-foreground));
}
.dark .prose blockquote {
    border-left-color: hsl(var(--primary));
    color: hsl(var(--muted-foreground));
}
.dark .prose code {
    color: hsl(var(--accent-foreground));
}
`;

export function GlobalStyles() {
    return <style>{proseStyles}</style>;
}
