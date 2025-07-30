import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, FileText } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About Me
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          Researcher, writer, and lifelong learner.
        </p>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="flex justify-center md:col-span-1">
          <Image
            src="https://placehold.co/400x400.png"
            alt="Portrait of the author"
            data-ai-hint="portrait author"
            width={250}
            height={250}
            className="rounded-full object-cover"
          />
        </div>
        <div className="md:col-span-2">
          <p className="mb-4 text-muted-foreground">
            I am a passionate researcher and writer with a deep interest in the intersection of technology, philosophy, and human potential. My academic journey has led me through the fascinating worlds of artificial intelligence and cognitive science, where I explore the nature of intelligence, both artificial and natural.
          </p>
          <p className="mb-4 text-muted-foreground">
            Beyond my research, I find solace and expression in writing. This blog is my canvas for sharing ideas, exploring complex topics, and engaging in thoughtful discourse. Whether I'm dissecting a new scientific discovery, reflecting on an ancient philosophical text, or simply sharing personal insights, my goal is to spark curiosity and foster a deeper understanding of our world.
          </p>
          <p className="text-muted-foreground">
            Thank you for joining me on this journey of discovery.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
             <Button asChild>
              <Link href="#">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="#">
                <FileText className="mr-2 h-4 w-4" /> ORCID
              </Link>
            </Button>
             <Button variant="secondary" asChild>
              <Link href="mailto:hello@example.com">
                <Mail className="mr-2 h-4 w-4" /> Email
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
