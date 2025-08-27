import { Paper, PaperCard } from "@/components/paper-card";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export const dynamic = 'force-dynamic';

async function getPapers(): Promise<Paper[]> {
    try {
        const papersCollection = collection(db, 'papers');
        const q = query(papersCollection, orderBy('year', 'desc'));
        const querySnapshot = await getDocs(q);
        const papers = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Paper));
        return papers;
    } catch (error) {
        console.error("Error fetching papers: ", error);
        return [];
    }
}


export default async function PapersPage() {
  const papers = await getPapers();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Investigación y Publicaciones
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          una seleccion de articulos interesantes y de investigacion que recomiendo.
        </p>
      </section>

      <section className="mt-12 flex flex-col gap-8">
        {papers.map((paper) => (
          <PaperCard key={paper.id} {...paper} />
        ))}
      </section>
    </div>
  );
}
