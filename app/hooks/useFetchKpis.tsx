import { useState, useEffect, useRef, useMemo } from 'react'
import { fetchKpis } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'
import { useWebSocketStore } from '~/stores/websocketStore'
import { MessageType } from '~/types/enums'
import useAppStore from '~/stores/appStore'


export function useFetchKpis() {
  const { userId } = useAppContext()
  const [confidence, setConfidence] = useState(-1)
  const prevConfidence = useRef<number>(-1)
  const isConnected = useWebSocketStore.getState().isConnected
  const lastMessage = useWebSocketStore.getState().lastMessage
  const setHasNews = useAppStore(s => s.setHasNews)
  const retryTimer = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current)
      retryTimer.current = null
    }

    if (!userId || (lastMessage && lastMessage.type !== MessageType.ASSISTANT_DONE)) {
      return;
    }
    const loadKpis = async () => {
      if (!userId || (lastMessage && lastMessage.type !== MessageType.ASSISTANT_DONE)) {
        return;
      }
      try {
        const kpis = await fetchKpis(userId);
        const newConfidence = kpis.data.kpis.confidence
        if (newConfidence !== prevConfidence.current) {
          prevConfidence.current = newConfidence
          setHasNews(true)
          setConfidence(kpis.data.kpis.confidence);
          retryTimer.current = null
        } else {
          retryTimer.current = setTimeout(loadKpis, 3000)
        }

      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
        setConfidence(0);
      } finally {
        console.error('Finally to fetch KPIs:');
      }
    };

    if (isConnected) {
      loadKpis();
    }
  }, [userId, lastMessage, isConnected]);

  const hasIncreasedConfidence = useMemo(() => confidence > 0 && confidence >= prevConfidence.current, [confidence])


  return { confidence, hasIncreasedConfidence };
}