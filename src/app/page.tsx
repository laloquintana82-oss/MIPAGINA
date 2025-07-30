import { ArticleCard } from "@/components/article-card";
import { Separator } from "@/components/ui/separator";

const recentPosts = [
  {
    slug: "the-dawn-of-ai",
    title: "The Dawn of Artificial Intelligence",
    date: "2024-07-15",
    excerpt: "Exploring the rapid advancements in AI and their potential impact on society, creativity, and the future of work.",
    tags: ["AI", "Technology", "Future"],
  },
  {
    slug: "philosophy-of-mind",
    title: "A Brief Foray into the Philosophy of Mind",
    date: "2024-06-28",
    excerpt: "A contemplative piece on consciousness, the self, and the timeless questions that have puzzled philosophers for centuries.",
    tags: ["Philosophy", "Consciousness"],
  },
  {
    slug: "minimalist-living",
    title: "The Art of Minimalist Living",
    date: "2024-06-10",
    excerpt: "Discovering joy and clarity by embracing a minimalist lifestyle. Less is not just more; it's a path to freedom.",
    tags: ["Lifestyle", "Minimalism"],
  },
];

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Ethereal Writings
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground text-balance">
          A personal space where I publish articles, essays, and my academic research. Welcome to my corner of the internet.
        </p>
      </section>

      <Separator className="my-12 md:my-16" />

      <section>
        <h2 className="mb-8 text-center font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <ArticleCard key={post.slug} {...post} />
          ))}
        </div>
      </section>
    </div>
  );
}
