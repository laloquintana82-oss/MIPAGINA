'use client';
import PaperForm from '@/components/paper-form';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, use } from 'react';
import { db } from '@/lib/firebase';
import { Paper } from '@/components/paper-card';

export default function EditPaperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPaper = async () => {
      try {
        const docRef = doc(db, 'papers', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPaper({ id, ...docSnap.data() } as Paper);
        } else {
          setError('Paper not found.');
        }
      } catch (err) {
        setError('Failed to fetch paper.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <PaperForm paper={paper} />;
}
