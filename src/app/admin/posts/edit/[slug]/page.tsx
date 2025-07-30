'use client';
import PostForm from '@/components/post-form';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { Post } from '@/components/article-card';

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ slug, ...docSnap.data() } as Post);
        } else {
          setError('Post not found.');
        }
      } catch (err) {
        setError('Failed to fetch post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <PostForm post={post} />;
}
