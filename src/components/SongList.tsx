import { songs } from '../data/songs';

interface SongListProps {
  onSongSelect: (songId: string) => void;
}

export function SongList({ onSongSelect }: SongListProps) {
  return (
    <div className="song-list">
      <h2>Song Collection</h2>
      <div className="songs-grid">
        {songs.map((song) => (
          <div
            key={song.id}
            className="song-card"
            onClick={() => onSongSelect(song.id)}
          >
            <h3>{song.title}</h3>
            <p>Click to view and transpose</p>
          </div>
        ))}
      </div>
    </div>
  );
}