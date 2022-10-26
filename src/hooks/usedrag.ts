import { useRef, useState, useEffect } from 'react';

export const useDrag = (initialTop?: number, initialLeft?: number) => {
  const ref = useRef<HTMLElement>();
  const [position, setPosition] = useState({ top: initialTop || 0, left: initialLeft || 0 });
  const positionRef = useRef(position);
  positionRef.current = position;

  useEffect(() => {
    if (ref.current !== undefined) {
      const handleDrag = (e: MouseEvent) => {
        let x = positionRef.current!.left;
        let y = positionRef.current!.top;

        console.log(x, y);

        x = Math.max(0, Math.min(x + e.movementX, window.innerWidth - ref.current!.clientWidth));
        y = Math.max(0, Math.min(y + e.movementY, window.innerHeight - ref.current!.clientHeight));
        
        console.log("TO", x, y);
        console.log("=======")

        setPosition({ top: y, left: x });
      };

      const node = ref.current;
      node.addEventListener('mousedown', () => {
        node.addEventListener('mousemove', handleDrag);
      });

      window.addEventListener('mouseup', () => {
        node.removeEventListener('mousemove', handleDrag);
      });

      return () => {
        node.removeEventListener('mousedown', () => {
          node.addEventListener('mousemove', handleDrag);
        });

        window.removeEventListener('mouseup', () => {
          node.removeEventListener('mousemove', handleDrag);
        });
      };
    }
  }, [ref]);

  return { ref, ...position };
}
