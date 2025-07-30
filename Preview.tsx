import { useEffect, useRef } from 'react';

export default function Preview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (iframeRef.current && event.data.code) {
        const doc = iframeRef.current.contentDocument;
        if (doc) {
          doc.open();
          doc.write(event.data.code);
          doc.close();
        }
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return <iframe ref={iframeRef} style={{ width: '100%', height: '100%' }} />;
}
