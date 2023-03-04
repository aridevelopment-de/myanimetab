import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import { metaDb } from "../utils/db";

const QueueScheduler = () => {
  const queues = useLiveQuery(() => metaDb.queues.filter(q => q.timed === true).toArray(), []);
  
  const queueInterval = useCallback(async () => {
    if (queues) {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const currentQueue = await metaDb.getCurrentTimedQueue(hour, minute);

      if (!currentQueue) {
        metaDb.setMeta("selected_queue", null);
      } else {
        metaDb.setMeta("selected_queue", currentQueue.id);
      }
    }
  }, [queues]);
  
  useEffect(() => {
    let interval = setInterval(queueInterval, 1000 * 60);
    queueInterval();

    return () => {
      if (interval) clearInterval(interval);
    }
  }, [queueInterval])
  
  return <></>
}

export default QueueScheduler;