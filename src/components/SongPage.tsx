import { useState, useMemo, useEffect } from 'react';
import { songs } from '../data/songs';
import { OutputPanel, TransposeControls } from '.';
import { genericDotsParser } from '../parsers';
import { transposeAndValidate, extractErrors, sanitizeInput } from '../core';

interface SongPageProps {
  songId: string;
  onBack: () => void;
}

export function SongPage({ songId, onBack }: SongPageProps) {
  const song = songs.find(s => s.id === songId);
  const [transposeAmount, setTransposeAmount] = useState(song?.defaultTranspose ?? 0);
  
  useEffect(() => {
    setTransposeAmount(song?.defaultTranspose ?? 0);
  }, [song?.defaultTranspose]);
  
  if (!song) {
    return (
      <div className="song-page">
        <button onClick={onBack} className="back-button">← Back to Songs</button>
        <div>Song not found</div>
      </div>
    );
  }

  const { transposedLines, errors } = useMemo(() => {
    const sanitized = sanitizeInput(song.content);
    const parsed = genericDotsParser.parse(sanitized);
    const transposed = transposeAndValidate(parsed, transposeAmount);
    const validationErrors = extractErrors(transposed);

    return {
      transposedLines: transposed,
      errors: validationErrors,
    };
  }, [song.content, transposeAmount]);

  return (
    <div className="song-page">
      <div className="song-header">
        <button onClick={onBack} className="back-button">← Back to Songs</button>
        <h2>{song.title}</h2>
      </div>
      
      <TransposeControls value={transposeAmount} onChange={setTransposeAmount} />
      
      <div className="song-content">
        <OutputPanel transposedLines={transposedLines} errors={errors} centered />
      </div>
    </div>
  );
}