import { useState, useEffect } from 'react'
import { fetchKpis } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'
import { useWebSocket } from '~/providers/WSProdivder'
import { SENDER } from '~/types/enums'




export function useFetchKpis() {
  const { userId } = useAppContext()
  const [confidence, setConfidence] = useState(0)
  const { messages } = useWebSocket()
  const { assistantResponseCount } = useWebSocket()


  useEffect(() => {
    if (!userId || messages.length === 0) {
      return;
    }

    const loadKpis = async () => {
      if (!userId) {
        return;
      }

      try {
        const kpis = await fetchKpis(userId);
        setConfidence(kpis.data.kpis.confidence || 0);
      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
        setConfidence(0);
      } finally {
        console.error('Failed to fetch KPIs:');
      }
    };

    loadKpis();
  }, [ userId, assistantResponseCount ]);

  return { confidence };
}