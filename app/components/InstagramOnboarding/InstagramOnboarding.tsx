import { useState } from 'react';
import Modal from '../ui/Modal/Modal';
import PlusIcon from '/icons/plus.svg';
import axiosInstance from '~/services/axiosInstance';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InstagramOnboarding({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const resp = await axiosInstance.post('/chatbot/v1/instagram_connect');
      const { authorization_url } = resp.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      }
    } catch (err) {
      console.error('Failed to start Instagram connect:', err);
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="instagram-onboarding-modal">
      <div className="instagram-onboarding">
        <div className="brand-logo">
          <img src="/images/globy_symbol.png" alt="Globy" />
        </div>

        <button className="close-btn" onClick={onClose}>
          <img src={PlusIcon} alt="Close" />
        </button>

        <div className="instagram-onboarding__container">
          <div className="instagram-onboarding__step">
            <div className="heading-container">
              <div className="instagram-onboarding__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <h2 className="heading">Connect your Instagram</h2>
              <p className="sub-heading">
                Supercharge your website with content straight from your Instagram feed.
              </p>
            </div>

            <div className="instagram-onboarding__benefits">
              <div className="benefit">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M16.67 5L7.5 14.17 3.33 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>Auto-sync your feed</strong>
                  <p>Your latest Instagram posts appear on your website automatically — no manual uploads needed.</p>
                </div>
              </div>
              <div className="benefit">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M16.67 5L7.5 14.17 3.33 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>Real photos, real trust</strong>
                  <p>Showcase authentic images from your business to build credibility with visitors.</p>
                </div>
              </div>
              <div className="benefit">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M16.67 5L7.5 14.17 3.33 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>Keep your site fresh</strong>
                  <p>Every new post updates your website — your online presence stays current without extra effort.</p>
                </div>
              </div>
              <div className="benefit">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M16.67 5L7.5 14.17 3.33 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>Drive engagement</strong>
                  <p>Link visitors back to your Instagram and grow your social following from your website.</p>
                </div>
              </div>
            </div>

            <div className="action-container">
              <button className="secondary" onClick={onClose}>Maybe later</button>
              <button onClick={handleConnect} disabled={loading}>
                {loading ? (
                  'Connecting...'
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    Connect Instagram
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
