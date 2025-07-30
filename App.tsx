import CodeEditor from './Editor';
import Preview from './Preview';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%' }}>
        <CodeEditor />
      </div>
      <div style={{ width: '50%', borderLeft: '1px solid #ccc' }}>
        <Preview />
      </div>
    </div>
  );
}
