import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export type Paper = {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  link: string;
  year: string;
};

export function PaperCard({ title, authors, abstract, link, year }: Paper) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          <Link href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {title}
          </Link>
        </CardTitle>
        <CardDescription>
          {Array.isArray(authors) ? authors.join(", ") : authors} &middot; {year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{abstract}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href={link} target="_blank" rel="noopener noreferrer">
            Read Paper <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
