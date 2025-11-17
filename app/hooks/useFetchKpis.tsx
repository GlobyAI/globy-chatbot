import { useState, useEffect } from 'react'
import { fetchKpis } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'
import { useWebSocketStore } from '~/stores/websocketStore'
import { MessageType } from '~/types/enums'


export function useFetchKpis() {
  const { userId } = useAppContext()
  const [confidence, setConfidence] = useState(0)
  const lastMessage = useWebSocketStore(state => state.lastMessage);



  useEffect(() => {
    if (!userId) {
      return;
    }

    if (lastMessage?.type !== MessageType.ASSISTANT_DONE) return;


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
  }, [ userId, lastMessage ]);

  return { confidence };
}