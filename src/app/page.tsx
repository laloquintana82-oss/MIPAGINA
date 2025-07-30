import { ArticleCard, type Post } from "@/components/article-card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getRecentPosts(): Promise<Post[]> {
    try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('date', 'desc'), limit(2));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            slug: doc.id,
            ...doc.data()
        } as Post));
        return posts;
    } catch (error) {
        console.error("Error fetching recent posts: ", error);
        return [];
    }
}

export default async function Home() {
  const recentPosts = await getRecentPosts();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="group text-center cursor-default">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl transition-transform duration-300 ease-in-out group-hover:scale-105">
          El Blog de Luis Eduardo
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance transition-colors duration-300 group-hover:text-foreground/80">
          Un espacio personal donde publico, articulos, ensayos y noticias.
        </p>
        <p className="mt-2 text-lg leading-8 text-muted-foreground text-balance transition-colors duration-300 delay-50 group-hover:text-foreground/80">
          BIENVENIDO A MI RINCON DE INTERNET
        </p>
      </section>

      <Separator className="my-12 md:my-16" />

      <section>
        <h2 className="mb-8 text-center font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Entradas Recientes
        </h2>
        <div className="grid grid-cols-1 gap-12">
          {recentPosts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/blog">
              Ver más <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
