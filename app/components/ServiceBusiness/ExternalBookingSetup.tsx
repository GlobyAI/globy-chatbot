import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import SpinnerLoading from '../ui/SpinnerLoading/SpinnerLoading';
import { getCalComConnectUrl, getCalComStatus } from '~/services/bookingApis';

interface Props {
  onBack: () => void;
  onComplete: () => void;
}

export default function ExternalBookingSetup({ onBack, onComplete }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const response = await getCalComConnectUrl();
      if (response.data.success && response.data.authorization_url) {
        window.open(response.data.authorization_url, '_blank');
        startPolling();
      } else {
        toast.error('Failed to get authorization URL');
      }
    } catch (error) {
      console.error('getCalComConnectUrl error:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to connect to Cal.com');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const startPolling = () => {
    setIsPolling(true);
    pollingRef.current = setInterval(async () => {
      try {
        const response = await getCalComStatus();
        if (response.data.success && response.data.connected) {
          if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
          }
          setIsPolling(false);
          toast.success('Cal.com connected successfully!');
          onComplete();
        }
      } catch {
        // Keep polling on error
      }
    }, 3000);
  };

  return (
    <div className="service-business__step">
      <div className="heading-container">
        <p className="heading">Connect Cal.com</p>
        <p className="sub-heading">
          Link your Cal.com account for two-way booking sync. Bookings created on
          Cal.com will appear in your Availability calendar, and bookings created
          here will sync to Cal.com.
        </p>
      </div>

      {isPolling ? (
        <div className="calcom-polling">
          <SpinnerLoading />
          <p>Waiting for Cal.com authorization...</p>
          <p className="calcom-polling__hint">Complete the sign-in in the new tab that opened</p>
        </div>
      ) : (
        <div className="calcom-connect">
          <button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? <SpinnerLoading /> : 'Connect Cal.com'}
          </button>
        </div>
      )}

      <div className="action-container">
        <button className="secondary" onClick={onBack} disabled={isPolling}>
          Back
        </button>
      </div>
    </div>
  );
}
