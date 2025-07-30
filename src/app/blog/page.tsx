import { ArticleCard, type Post } from "@/components/article-card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

async function getPosts(): Promise<Post[]> {
    try {
        const postsCollection = collection(db, 'posts');
        const q = query(postsCollection, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({
            slug: doc.id,
            ...doc.data()
        } as Post));
        return posts;
    } catch (error) {
        console.error("Error fetching posts: ", error);
        return [];
    }
}


export default async function BlogPage() {
    const allPosts = await getPosts();

    const allCategories = ["Todos", ...new Set(allPosts.flatMap(post => post.tags))];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          BIENVENIDO A TODOS LOS POST DE LUIS
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Una colección de artículos y ensayos sobre tecnología, filosofía y vida.
        </p>
      </section>

      <div className="my-10 flex flex-wrap items-center justify-center gap-2">
        {allCategories.map(category => (
          <Button key={category} variant={category === "Todos" ? "default" : "secondary"}>
            {category}
          </Button>
        ))}
      </div>

      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allPosts.map((post) => (
          <ArticleCard key={post.slug} {...post} />
        ))}
      </section>
    </div>
  );
}
