import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor() {
  const [code, setCode] = useState('<h1>Hello from AI Builder</h1>');

  useEffect(() => {
    window.parent.postMessage({ code }, '*');
  }, [code]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="html"
      value={code}
      onChange={(value) => setCode(value || '')}
      theme="vs-dark"
    />
  );
}
