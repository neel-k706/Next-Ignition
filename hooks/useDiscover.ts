import { useState, useEffect } from 'react';

export interface Discover {
  id: string;
  title: string;
  category: string;
  description?: string;
}

const DUMMY_DISCOVER: Discover[] = [
  {
    id: '1',
    title: 'Top 10 Growth Hacking Strategies for 2024',
    category: 'Growth',
    description: 'Learn the latest strategies to scale your startup rapidly and efficiently.',
  },
  {
    id: '2',
    title: 'How to Pitch to Investors Successfully',
    category: 'Funding',
    description: 'Master the art of pitching and secure funding for your venture.',
  },
  {
    id: '3',
    title: 'Building a Strong Founding Team',
    category: 'Team',
    description: 'Essential tips for finding and retaining the right co-founders.',
  },
  {
    id: '4',
    title: 'Product-Market Fit: A Complete Guide',
    category: 'Product',
    description: 'Understand how to achieve and validate product-market fit.',
  },
];

export function useDiscover() {
  const [discover, setDiscover] = useState<Discover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscover();
  }, []);

  const fetchDiscover = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setDiscover(DUMMY_DISCOVER);
      setError(null);
    } catch (err) {
      console.error('Error fetching discover:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  return { discover, loading, error, refetch: fetchDiscover };
}
