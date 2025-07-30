import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Star } from "lucide-react";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  featured?: boolean;
};

export function ArticleCard(post: Post) {
  const { slug, title, date, excerpt, tags, imageUrl, featured } = post;
  
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/blog/${slug}`} className="group relative block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-lg border-2 border-border transition-transform duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-xl">
          {imageUrl && (
            <div className="relative h-60 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="post image"
                />
            </div>
          )}
        
        <div className="absolute right-4 top-4 z-20 flex gap-2">
            {featured && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/80 text-primary-foreground backdrop-blur-sm">
                    <Star className="size-5" />
                </div>
            )}
            <div className="translate-x-12 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/50 backdrop-blur-sm">
              <ArrowUpRight className="size-6" />
            </div>
        </div>

        <CardHeader>
          <CardTitle className="font-headline text-xl leading-snug group-hover:underline">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <time dateTime={date} className="text-xs text-muted-foreground">
            {formattedDate}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}
