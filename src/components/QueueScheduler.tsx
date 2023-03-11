import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect } from "react";
import { metaDb, useMeta } from "../utils/db";

const QueueScheduler = () => {
  const [shouldSwitchQueue, _1] = useMeta("should_switch_queue", (e: any) => e, false);
  const [defaultQueue, _2] = useMeta("default_queue");
  const queues = useLiveQuery(() => metaDb.queues.filter(q => q.timed === true).toArray(), []);
  
  const queueInterval = useCallback(async () => {
    if (queues && queues.length > 0) {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      const currentQueue = await metaDb.getCurrentTimedQueue(hour, minute);

      if (!currentQueue) {
        metaDb.setMeta("selected_queue", defaultQueue ?? null);
      } else {
        metaDb.setMeta("selected_queue", currentQueue.id);
      }
    }
  }, [queues, defaultQueue]);
  
  useEffect(() => {
    if (shouldSwitchQueue === true) {
      let interval = setInterval(queueInterval, 1000 * 60);
      queueInterval();
  
      return () => {
        if (interval) clearInterval(interval);
      }
    }
  }, [queueInterval, shouldSwitchQueue]);

  useEffect(() => {
    if (queues !== undefined && queues.length > 0) {
      metaDb.registerMeta("default_queue", queues[0].id);
    }
  }, [queues])
  
  return <p style={{display: "none"}}>Nope, nothin' here to see. Now enjoy some waifus!</p>
}

export default QueueScheduler;