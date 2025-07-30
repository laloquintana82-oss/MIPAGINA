import { PaperCard } from "@/components/paper-card";

const papers = [
  {
    title: "Quantum Entanglement and its Implications for Information Theory",
    authors: ["A. Author", "B. Coauthor"],
    abstract: "This paper explores the fundamental connection between quantum entanglement and classical information theory, proposing a new framework for secure communication channels.",
    link: "#",
    year: "2023",
  },
  {
    title: "The Role of Neural Networks in Predicting Protein Folding",
    authors: ["C. Researcher", "D. Scientist"],
    abstract: "We present a novel deep learning model that achieves state-of-the-art accuracy in predicting the three-dimensional structure of proteins from their amino acid sequences.",
    link: "#",
    year: "2022",
  },
  {
    title: "A Historical Analysis of Economic Bubbles",
    authors: ["E. Historian"],
    abstract: "A comprehensive review of major economic bubbles throughout history, identifying common patterns and behavioral biases that contribute to their formation and collapse.",
    link: "#",
    year: "2021",
  },
];

export default function PapersPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:py-16 md:py-20">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Research & Publications
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          A selection of my academic work and research papers.
        </p>
      </section>

      <section className="mt-12 flex flex-col gap-8">
        {papers.map((paper, index) => (
          <PaperCard key={index} {...paper} />
        ))}
      </section>
    </div>
  );
}
