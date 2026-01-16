import React from 'react';

interface NotationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotationModal: React.FC<NotationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🪈 Notation Guide</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <section className="notation-section">
            <h3>Octave Markers</h3>
            <div className="notation-grid">
              <div className="notation-row">
                <span className="sample">Lower Octave</span>
                <div className="swar-display">
                  <code>•S</code> <code>•r</code> <code>•R</code>
                  <p className="description">Dot <strong>before</strong> the swar</p>
                </div>
              </div>
              <div className="notation-row">
                <span className="sample">Middle Octave</span>
                <div className="swar-display">
                  <code>S</code> <code>r</code> <code>R</code>
                  <p className="description">No dots</p>
                </div>
              </div>
              <div className="notation-row">
                <span className="sample">Higher Octave</span>
                <div className="swar-display">
                  <code>S•</code> <code>r•</code> <code>R•</code>
                  <p className="description">Dot <strong>after</strong> the swar</p>
                </div>
              </div>
            </div>
          </section>

          <section className="notation-section">
            <h3>Hole Positions</h3>
            <div className="notation-grid">
              <div className="notation-row">
                <div className="notation-info">
                  <span className="sample">Half Closed</span>
                  <p className="description">Small letters</p>
                </div>
                <div className="swar-list">
                  <div className="swar-group">
                    <code>r</code> <code>g</code> <code>m</code> <code>d</code> <code>n</code>
                  </div>
                  <div className="hint">Komal swars + Shudh Ma (m)</div>
                </div>
              </div>
              <div className="notation-row">
                <div className="notation-info">
                  <span className="sample">Full Closed</span>
                  <p className="description">Capital letters</p>
                </div>
                <div className="swar-list">
                  <div className="swar-group">
                    <code>S</code> <code>R</code> <code>G</code> <code>M</code> <code>P</code> <code>D</code> <code>N</code>
                  </div>
                  <div className="hint">Shudh swars + Teevra Ma (M)</div>
                </div>
              </div>
            </div>
          </section>

          <div className="modal-footer-hint">
             <p><strong>Tip:</strong> You can mix octaves and finger positions, like <code>•m</code> for lower octave shudh ma.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
