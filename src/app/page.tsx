import { ArticleCard, type Post } from "@/components/article-card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";


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
      <section className="text-center">
        <h1 className="animate-in fade-in slide-in-from-top-4 duration-1000 font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          El Blog de Luis Eduardo
        </h1>
        <p className="mt-6 animate-in fade-in slide-in-from-top-4 duration-1000 delay-200 text-lg leading-8 text-muted-foreground text-balance">
          Un espacio personal donde publico, articulos, ensayos y noticias.
        </p>
        <p className="mt-2 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 text-lg leading-8 text-muted-foreground text-balance">
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
