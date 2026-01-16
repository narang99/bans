interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-title">
        Hariom Narang's Bansuri 🪈
      </div>
      <div className="navbar-buttons">
        <button
          className={`nav-button ${currentPage === 'transcode' ? 'active' : ''}`}
          onClick={() => onNavigate('transcode')}
        >
          Transcode
        </button>
        <button
          className={`nav-button ${currentPage === 'songs' ? 'active' : ''}`}
          onClick={() => onNavigate('songs')}
        >
          Songs
        </button>
      </div>
    </nav>
  );
}