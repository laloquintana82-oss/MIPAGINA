import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, FileText } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AboutContent {
  intro: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  imageUrl: string;
  linkedinUrl: string;
  orcidUrl: string;
  email: string;
}

async function getAboutContent(): Promise<AboutContent | null> {
    try {
        const docRef = doc(db, "content", "about");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as AboutContent;
        } else {
            console.log("No such document!");
            // Return a default structure or handle it as an error
            return {
                intro: "Researcher, writer, and lifelong learner.",
                paragraph1: "I am a passionate researcher and writer with a deep interest in the intersection of technology, philosophy, and human potential. My academic journey has led me through the fascinating worlds of artificial intelligence and cognitive science, where I explore the nature of intelligence, both artificial and natural.",
                paragraph2: "Beyond my research, I find solace and expression in writing. This blog is my canvas for sharing ideas, exploring complex topics, and engaging in thoughtful discourse. Whether I'm dissecting a new scientific discovery, reflecting on an ancient philosophical text, or simply sharing personal insights, my goal is to spark curiosity and foster a deeper understanding of our world.",
                paragraph3: "Thank you for joining me on this journey of discovery.",
                imageUrl: "https://placehold.co/400x400.png",
                linkedinUrl: "#",
                orcidUrl: "#",
                email: "hello@example.com"
            };
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}


export default async function AboutPage() {
  const content = await getAboutContent();

  if (!content) {
    return <div>Error loading content. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          About Me
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          {content.intro}
        </p>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="flex justify-center md:col-span-1">
          <Image
            src={content.imageUrl || "https://placehold.co/400x400.png"}
            alt="Portrait of the author"
            data-ai-hint="portrait author"
            width={250}
            height={250}
            className="rounded-full object-cover"
          />
        </div>
        <div className="md:col-span-2">
          <p className="mb-4 text-muted-foreground">
            {content.paragraph1}
          </p>
          <p className="mb-4 text-muted-foreground">
            {content.paragraph2}
          </p>
          <p className="text-muted-foreground">
            {content.paragraph3}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
             <Button asChild>
              <Link href={content.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href={content.orcidUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" /> ORCID
              </Link>
            </Button>
             <Button variant="secondary" asChild>
              <Link href={`mailto:${content.email}`}>
                <Mail className="mr-2 h-4 w-4" /> Email
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
