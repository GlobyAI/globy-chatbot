import { useState, useEffect, useRef } from 'react'
import { fetchKpis } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'
import { useWebSocketStore } from '~/stores/websocketStore'
import { MessageType } from '~/types/enums'


export function useFetchKpis() {
  const { userId } = useAppContext()
  const [confidence, setConfidence] = useState(-1)
  const prevConfidence = useRef<number>(-1)
  const isConnected = useWebSocketStore.getState().isConnected
  const lastMessage = useWebSocketStore.getState().lastMessage
  useEffect(() => {
    
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
        if(newConfidence !== prevConfidence.current){
          prevConfidence.current= newConfidence
          setConfidence(kpis.data.kpis.confidence);
        }else{
          setTimeout(loadKpis,3000)
        }
      } catch (err) {
        console.error('Failed to fetch KPIs:', err);
        setConfidence(0);
      } finally {
        console.error('Finally to fetch KPIs:');
      }
    };

    const seconds = isConnected && lastMessage ? 3000:0
    setTimeout(() => {
      if (isConnected) {
        loadKpis();
      }
    }, seconds)
  }, [userId, lastMessage, isConnected]);

  return { confidence };
}