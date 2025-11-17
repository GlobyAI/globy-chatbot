import { useState, useEffect } from 'react'
import { fetchKpis } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider';



export function useKpis() {
  const { userId } = useAppContext()
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadKpis = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const kpis = await fetchKpis(userId);
        // Adjust based on your actual API response structure
        setConfidence(kpis.kpis.confidence || 0);
      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch KPIs'));
        setConfidence(0);
      } finally {
        setLoading(false);
      }
    };

    loadKpis();
  }, [ userId ]);

  return { confidence, loading, error };
}