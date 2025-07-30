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
import { ArrowUpRight } from "lucide-react";

export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
};

export function ArticleCard(post: Post) {
  const { slug, title, date, excerpt, tags, imageUrl } = post;
  
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-border transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
       <Link href={`/blog/${slug}`} className="absolute inset-0 z-10" aria-label={`Leer más sobre ${title}`}/>
        
        {imageUrl ? (
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint="post image"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </div>
        ) : null}

        <div className="absolute right-4 top-4 z-20 translate-x-12 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100">
             <ArrowUpRight className="size-6" />
        </div>
      
      <CardHeader className="z-20">
        <CardTitle className="font-headline text-xl leading-snug">
           <Link href={`/blog/${slug}`} className="relative hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow z-20">
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between z-20">
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
