import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

export function ArticleCard(post: Post) {
  const { slug, title, date, excerpt, tags } = post;
  
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-border transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/blog/${slug}`} className="absolute inset-0 z-10" aria-label={`Leer más sobre ${title}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="absolute right-4 top-4 z-20 translate-x-12 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
             <ArrowUpRight className="size-6 text-white" />
          </div>
      </Link>
      <CardHeader className="z-20">
        <CardTitle className="font-headline text-xl leading-snug">
           <Link href={`/blog/${slug}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="z-20 flex-grow">
        <p className="text-muted-foreground">{excerpt}</p>
      </CardContent>
      <CardFooter className="z-20 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
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
  );
}
