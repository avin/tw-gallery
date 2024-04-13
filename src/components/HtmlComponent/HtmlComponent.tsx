import React, { useEffect, useRef, useState } from 'react';
import cn from 'clsx';
import hljs from 'highlight.js';
import { nanoid } from 'nanoid';
import 'highlight.js/styles/vs.css';

const template = `\
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
<div class="m-2">
{{content}}
</div>
</body>
<script>
 function sendHeight() {
    const height = document.documentElement.scrollHeight;
    window.parent.postMessage({ frameHeight: height, pageId: '{{pageId}}' }, '*');
  }

  window.onload = sendHeight;
  window.onresize = sendHeight;

  const observer = new MutationObserver((mutations) => {
    sendHeight();
  });

  observer.observe(document.body, {
    childList: true,   
    subtree: true,     
    attributes: true,  
    attributeFilter: ['style', 'class'] 
  });
</script>
</html>
`;

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  name: string;
  path: string;
}

const HtmlComponent = ({ className, name, path, ...props }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const codeElRef = useRef<HTMLPreElement>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [mode, setMode] = useState<'preview' | 'code'>('preview');
  const [iframeHeight, setIframeHeight] = useState(200);
  const pageIdRef = useRef(nanoid());

  useEffect(() => {
    // Функция для выполнения GET-запроса для загрузки HTML-файла
    const fetchHtmlContent = async () => {
      try {
        const response = await fetch('assets/components' + path);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        setHtmlContent(html);

        const resultHtml = template
          .replace('{{content}}', html)
          .replace('{{pageId}}', pageIdRef.current!);

        const iframe = iframeRef.current!;
        const blob = new Blob([resultHtml], { type: 'text/html' });
        iframe.src = URL.createObjectURL(blob);
      } catch (error) {
        console.error('Failed to fetch HTML content:', error);
      }
    };

    void fetchHtmlContent();
  }, [path]);

  useEffect(() => {
    const handleResize = (event: any) => {
      if (event.origin !== window.location.origin) {
        // Необходимо проверить, что сообщение исходит от вашего домена или от доверенного источника
        return;
      }

      if (event.data.frameHeight && event.data.pageId === pageIdRef.current) {
        setIframeHeight(Math.max(event.data.frameHeight, 400));
      }
    };

    window.addEventListener('message', handleResize);

    return () => {
      window.removeEventListener('message', handleResize);
    };
  }, []);

  useEffect(() => {
    if (htmlContent) {
      hljs.highlightElement(codeElRef.current!);
    }
  }, [htmlContent]);

  return (
    <div
      className={cn('border border-gray-400 rounded-tl rounded-tr overflow-hidden mb-4', className)}
      {...props}
    >
      <div className="p-2 border-b border-gray-400 bg-gray-100 flex justify-between">
        <div className="font-bold ">{name}</div>
        <div>
          <button
            type="button"
            onClick={() => setMode((v) => (v === 'preview' ? 'code' : 'preview'))}
          >
            {mode === 'preview' ? 'Code' : 'Preview'}
          </button>
        </div>
      </div>
      <div className="">
        <div className={cn({ hidden: mode === 'code' })}>
          <iframe
            ref={iframeRef}
            style={{ width: '100%', height: `${iframeHeight}px`, border: 'none' }}
            title={name}
          />
        </div>

        <div className={cn('overflow-auto min-h-[200px]', { hidden: mode === 'preview' })}>
          <pre className="overflow-auto whitespace-pre-wrap max-w-full">
            <code className="language-html" ref={codeElRef}>
              {htmlContent}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HtmlComponent;
