import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import SpinnerLoading from '../ui/SpinnerLoading/SpinnerLoading';
import { setupExternalBooking, getExternalInstructions, type ExternalBookingConfig, type ExternalInstructions } from '~/services/bookingApis';

type Provider = 'fresha' | 'booksy' | 'treatwell' | null;
type Step = 'select-provider' | 'setup';

interface Props {
  onBack: () => void;
  onComplete: (provider: 'fresha' | 'booksy' | 'treatwell') => void;
}

const PROVIDERS = [
  { id: 'fresha' as const, name: 'Fresha', description: 'Free booking software for salons and spas' },
  { id: 'booksy' as const, name: 'Booksy', description: 'Appointment scheduling for health and beauty' },
  { id: 'treatwell' as const, name: 'Treatwell', description: 'European booking platform for wellness' },
];

export default function ExternalBookingSetup({ onBack, onComplete }: Props) {
  const [step, setStep] = useState<Step>('select-provider');
  const [selectedProvider, setSelectedProvider] = useState<Provider>(null);
  const [instructions, setInstructions] = useState<ExternalInstructions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');

  useEffect(() => {
    if (step === 'setup' && selectedProvider) {
      fetchInstructions();
    }
  }, [step, selectedProvider]);

  const fetchInstructions = async () => {
    if (!selectedProvider) return;

    setIsLoading(true);
    try {
      const response = await getExternalInstructions(selectedProvider);
      if (response.status === 200) {
        setInstructions(response.data);
      }
    } catch (error) {
      console.error('getExternalInstructions error:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Failed to load instructions');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleContinueToSetup = () => {
    if (selectedProvider) {
      setStep('setup');
    }
  };

  const handleSubmit = async () => {
    if (!selectedProvider) return;

    if (!embedCode && !bookingUrl) {
      toast.error('Please provide either an embed code or booking URL');
      return;
    }

    setIsLoading(true);
    try {
      const config: ExternalBookingConfig = {
        provider: selectedProvider,
        embedCode: embedCode || undefined,
        bookingUrl: bookingUrl || undefined,
      };
      const response = await setupExternalBooking(config);
      if (response.status === 200) {
        toast.success('External booking connected successfully!');
        onComplete(selectedProvider);
      }
    } catch (error) {
      console.error('setupExternalBooking error:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error('Failed to setup external booking. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'select-provider') {
    return (
      <div className="service-business__step">
        <div className="heading-container">
          <p className="heading">Select your booking provider</p>
          <p className="sub-heading">Choose the platform you're currently using</p>
        </div>

        <div className="provider-options">
          {PROVIDERS.map((provider) => (
            <div
              key={provider.id}
              className={`option ${selectedProvider === provider.id ? 'selected' : ''}`}
              onClick={() => handleProviderSelect(provider.id)}
            >
              <div className="option__detail">
                <strong>{provider.name}</strong>
                <p>{provider.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="action-container">
          <button className="secondary" onClick={onBack}>
            Back
          </button>
          <button onClick={handleContinueToSetup} disabled={!selectedProvider}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="service-business__step">
      <div className="heading-container">
        <p className="heading">Connect {selectedProvider}</p>
        <p className="sub-heading">Follow the instructions below to integrate your booking system</p>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <SpinnerLoading />
        </div>
      ) : (
        <>
          {instructions && (
            <div className="instructions">
              <h4>Setup Instructions:</h4>
              <ol>
                {instructions.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="embedCode">Embed Code</label>
            <textarea
              id="embedCode"
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder="Paste your embed code here..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="bookingUrl">Or Booking URL</label>
            <input
              type="url"
              id="bookingUrl"
              value={bookingUrl}
              onChange={(e) => setBookingUrl(e.target.value)}
              placeholder="https://your-booking-page.com"
            />
          </div>
        </>
      )}

      <div className="action-container">
        <button className="secondary" onClick={() => setStep('select-provider')}>
          Back
        </button>
        <button onClick={handleSubmit} disabled={isLoading || (!embedCode && !bookingUrl)}>
          {isLoading ? <SpinnerLoading /> : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}
