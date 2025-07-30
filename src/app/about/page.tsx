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
                intro: "Investigador, escritor y aprendiz permanente.",
                paragraph1: "Soy un apasionado investigador y escritor con un profundo interés en la intersección de la tecnología, la filosofía y el potencial humano. Mi viaje académico me ha llevado a través de los fascinantes mundos de la inteligencia artificial y la ciencia cognitiva, donde exploro la naturaleza de la inteligencia, tanto artificial como natural.",
                paragraph2: "Más allá de mi investigación, encuentro consuelo y expresión en la escritura. Este blog es mi lienzo para compartir ideas, explorar temas complejos y participar en un discurso reflexivo. Ya sea que esté analizando un nuevo descubrimiento científico, reflexionando sobre un antiguo texto filosófico o simplemente compartiendo ideas personales, mi objetivo es despertar la curiosidad y fomentar una comprensión más profunda de nuestro mundo.",
                paragraph3: "Gracias por acompañarme en este viaje de descubrimiento.",
                imageUrl: "https://placehold.co/400x400.png",
                linkedinUrl: "#",
                orcidUrl: "#",
                email: "hola@example.com"
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
    return <div>Error al cargar el contenido. Por favor, inténtalo de nuevo más tarde.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Sobre Mí
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          {content.intro}
        </p>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <div className="flex justify-center md:col-span-1">
          <Image
            src={content.imageUrl || "https://placehold.co/400x400.png"}
            alt="Retrato del autor"
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
                <Mail className="mr-2 h-4 w-4" /> Correo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
