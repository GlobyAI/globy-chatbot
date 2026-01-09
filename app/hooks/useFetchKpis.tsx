import { useEffect, useMemo, useRef, useState } from "react";
import { fetchKpis } from "~/services/appApis";
import { useAppContext } from "~/providers/AppContextProvider";
import { useWebSocketStore } from "~/stores/websocketStore";
import { MessageType } from "~/types/enums";
import useAppStore from "~/stores/appStore";
import { useWebSocket } from "~/providers/WSProdivder";

export function useFetchKpis() {
  const { userId } = useAppContext();
  const { isConnected, isWSPending } = useWebSocket();

  const lastType = useWebSocketStore(s => s.lastMessage?.type);
  const lastDoneId = useWebSocketStore(s =>
    s.lastMessage?.type === MessageType.ASSISTANT_DONE ? s.lastMessage?.message_id : undefined
  );

  const [confidence, setConfidence] = useState(-1);
  const prevConfidence = useRef<number>(-1);

  const setHasNews = useAppStore(s => s.setHasNews);

  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptsRef = useRef(0);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (retryTimer.current) {
      clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }

    if (!userId) return;
    if (!isConnected || isWSPending) return;
    if (lastType !== MessageType.ASSISTANT_DONE) return;

    attemptsRef.current = 0;

    let cancelled = false;

    const loadKpis = async () => {
      if (cancelled) return;
      if (inFlightRef.current) return;
      if (attemptsRef.current >= 3) return; 

      attemptsRef.current += 1;
      inFlightRef.current = true;

      try {
        const kpis = await fetchKpis(userId);
        const newConfidence = kpis.data.kpis.confidence;

        if (newConfidence !== prevConfidence.current) {
          prevConfidence.current = newConfidence;
          setHasNews(true);
          setConfidence(newConfidence);
          return; 
        }

       
        if (attemptsRef.current < 3) {
          retryTimer.current = setTimeout(loadKpis, 3000);
        }
      } catch (err) {
        console.error("Failed to fetch KPIs:", err);
      } finally {
        inFlightRef.current = false;
      }
    };

    loadKpis();

    return () => {
      cancelled = true;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      retryTimer.current = null;
    };
  }, [userId, isConnected, isWSPending, lastType, lastDoneId, setHasNews]);

  const hasIncreasedConfidence = useMemo(
    () => confidence > 0 && confidence >= prevConfidence.current,
    [confidence]
  );

  return { confidence, hasIncreasedConfidence };
}
