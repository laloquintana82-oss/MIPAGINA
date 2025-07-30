import { ArticleCard } from "@/components/article-card";
import { Button } from "@/components/ui/button";

const allPosts = [
  { slug: "the-dawn-of-ai", title: "The Dawn of Artificial Intelligence", date: "2024-07-15", excerpt: "Exploring the rapid advancements in AI and their potential impact on society, creativity, and the future of work.", tags: ["AI", "Technology", "Future"] },
  { slug: "philosophy-of-mind", title: "A Brief Foray into the Philosophy of Mind", date: "2024-06-28", excerpt: "A contemplative piece on consciousness, the self, and the timeless questions that have puzzled philosophers for centuries.", tags: ["Philosophy", "Consciousness"] },
  { slug: "minimalist-living", title: "The Art of Minimalist Living", date: "2024-06-10", excerpt: "Discovering joy and clarity by embracing a minimalist lifestyle. Less is not just more; it's a path to freedom.", tags: ["Lifestyle", "Minimalism"] },
  { slug: "the-cosmos-within", title: "The Cosmos Within: A Journey Through Stardust", date: "2024-05-22", excerpt: "Reflecting on our connection to the universe and the profound realization that we are made of stardust.", tags: ["Science", "Cosmology"] },
  { slug: "on-writing", title: "On the Solitude and Joy of Writing", date: "2024-05-05", excerpt: "An essay on the writer's craft, the struggle with the blank page, and the ultimate fulfillment of creation.", tags: ["Writing", "Creativity"] },
  { slug: "stoic-wisdom", title: "Stoic Wisdom for the Modern Age", date: "2024-04-18", excerpt: "How ancient Stoic principles can help us navigate the complexities and anxieties of contemporary life.", tags: ["Philosophy", "Stoicism", "Lifestyle"] },
];

const allCategories = ["All", "AI", "Philosophy", "Lifestyle", "Science", "Technology"];

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          From the Quill
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          A collection of articles and essays on technology, philosophy, and life.
        </p>
      </section>

      <div className="my-10 flex flex-wrap items-center justify-center gap-2">
        {allCategories.map(category => (
          <Button key={category} variant={category === "All" ? "default" : "secondary"}>
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
