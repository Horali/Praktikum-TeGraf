import './App.css';
import { useState } from 'react';
import KnightsTour from './components/KnightsTour';
import LMIS from './components/LMIS';

function App() {
  const [mode, setMode] = useState('knights-tour'); // 'knights-tour' or 'lmis'

  return (
    <div className="app-wrapper">
      <div className="mode-switcher">
        <button
          className={`mode-btn ${mode === 'knights-tour' ? 'active' : ''}`}
          onClick={() => setMode('knights-tour')}
        >
          Knight's Tour
        </button>
        <button
          className={`mode-btn ${mode === 'lmis' ? 'active' : ''}`}
          onClick={() => setMode('lmis')}
        >
          LMIS
        </button>
      </div>

      {mode === 'knights-tour' ? <KnightsTour /> : <LMIS />}
    </div>
  );
}

export default App;