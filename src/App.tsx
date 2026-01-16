import { useState, useMemo, useEffect } from 'react';
import { InputPanel, OutputPanel, TransposeControls, Navbar, SongList, SongPage } from './components';
import { genericDotsParser } from './parsers';
import { transposeAndValidate, extractErrors, sanitizeInput, type TransposedLine } from './core';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('songs');
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [transposeAmount, setTransposeAmount] = useState(0);

  // Handle URL changes
  useEffect(() => {
    const updatePageFromURL = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'transcode') {
        setCurrentPage('transcode');
        setSelectedSong(null);
      } else if (hash.startsWith('song/')) {
        const songId = hash.split('song/')[1];
        setCurrentPage('song');
        setSelectedSong(songId);
      } else {
        setCurrentPage('songs');
        setSelectedSong(null);
      }
    };

    updatePageFromURL();
    window.addEventListener('hashchange', updatePageFromURL);
    return () => window.removeEventListener('hashchange', updatePageFromURL);
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'transcode') {
      window.location.hash = 'transcode';
    } else {
      window.location.hash = '';
    }
  };

  const handleSongSelect = (songId: string) => {
    window.location.hash = `song/${songId}`;
  };

  const handleBackToSongs = () => {
    window.location.hash = 'songs';
  };

  // Process the input text through the parser and transposer
  const { transposedLines, errors } = useMemo(() => {
    if (!inputText.trim()) {
      return { 
        transposedLines: [] as TransposedLine[],
        errors: [] as Array<{ lineNumber: number; originalToken: string; reason: string }>,
      };
    }

    // Sanitize input (handle curly quotes etc)
    const sanitized = sanitizeInput(inputText);

    // Parse the input
    const parsed = genericDotsParser.parse(sanitized);

    // Transpose and validate in one pass (maintains line structure)
    const transposed = transposeAndValidate(parsed, transposeAmount);

    // Extract errors from transposed tokens
    const validationErrors = extractErrors(transposed);

    return {
      transposedLines: transposed,
      errors: validationErrors,
    };
  }, [inputText, transposeAmount]);

  const renderContent = () => {
    if (currentPage === 'songs') {
      return <SongList onSongSelect={handleSongSelect} />;
    }
    
    if (currentPage === 'song' && selectedSong) {
      return <SongPage songId={selectedSong} onBack={handleBackToSongs} />;
    }

    return (
      <>
        <TransposeControls value={transposeAmount} onChange={setTransposeAmount} />
        <div className="split-container">
          <InputPanel value={inputText} onChange={setInputText} />
          <OutputPanel transposedLines={transposedLines} errors={errors} />
        </div>
      </>
    );
  };

  return (
    <div className="app">
      <Navbar currentPage={currentPage === 'song' ? 'songs' : currentPage} onNavigate={handleNavigate} />

      {renderContent()}
    </div>
  );
}

export default App;
