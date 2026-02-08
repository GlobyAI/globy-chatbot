import { useState } from 'react';
import Modal from '../ui/Modal/Modal';
import BookingTypeSelection, { type BookingType } from './BookingTypeSelection';
import GlobyBookingSetup from './GlobyBookingSetup';
import ExternalBookingSetup from './ExternalBookingSetup';
import PlusIcon from '/icons/plus.svg';

type Step = 'type-selection' | 'globy-setup' | 'external-setup' | 'success';

type BookingProvider = 'globy' | 'fresha' | 'booksy' | 'treatwell';

interface Props {
  open: boolean;
  onClose: () => void;
  onSetupComplete?: (provider: BookingProvider, servicesCount?: number) => void;
  isReconfiguring?: boolean;
}

export default function ServiceBusiness({ open, onClose, onSetupComplete, isReconfiguring = false }: Props) {
  const [step, setStep] = useState<Step>('type-selection');
  const [bookingType, setBookingType] = useState<BookingType>(null);
  const [acknowledgedReconfigure, setAcknowledgedReconfigure] = useState(false);
  const [completedProvider, setCompletedProvider] = useState<BookingProvider | null>(null);
  const [completedServicesCount, setCompletedServicesCount] = useState<number>(0);

  const handleSelectType = (type: BookingType) => {
    setBookingType(type);
  };

  const handleContinueFromTypeSelection = () => {
    if (bookingType === 'globy') {
      setStep('globy-setup');
    } else if (bookingType === 'external') {
      setStep('external-setup');
    }
  };

  const handleBack = () => {
    setStep('type-selection');
  };

  const handleGlobyComplete = (servicesCount: number) => {
    setCompletedProvider('globy');
    setCompletedServicesCount(servicesCount);
    setStep('success');
    onSetupComplete?.('globy', servicesCount);
  };

  const handleExternalComplete = (provider: 'fresha' | 'booksy' | 'treatwell') => {
    setCompletedProvider(provider);
    setCompletedServicesCount(0);
    setStep('success');
    onSetupComplete?.(provider, 0);
  };

  const handleClose = () => {
    setStep('type-selection');
    setBookingType(null);
    setAcknowledgedReconfigure(false);
    setCompletedProvider(null);
    setCompletedServicesCount(0);
    onClose();
  };

  const renderReconfigureWarning = () => {
    if (!isReconfiguring || acknowledgedReconfigure || step !== 'type-selection') {
      return null;
    }

    return (
      <div className="reconfigure-warning">
        <div className="reconfigure-warning__content">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <strong>Booking system already configured</strong>
            <p>Continuing will replace your current booking setup. Your existing services and settings may be affected.</p>
          </div>
        </div>
        <button className="reconfigure-warning__btn" onClick={() => setAcknowledgedReconfigure(true)}>
          I understand, continue
        </button>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'type-selection':
        return (
          <>
            {renderReconfigureWarning()}
            <BookingTypeSelection
              selectedType={bookingType}
              onSelectType={handleSelectType}
              onContinue={handleContinueFromTypeSelection}
            />
          </>
        );
      case 'globy-setup':
        return <GlobyBookingSetup onBack={handleBack} onComplete={handleGlobyComplete} />;
      case 'external-setup':
        return <ExternalBookingSetup onBack={handleBack} onComplete={handleExternalComplete} />;
      case 'success':
        return (
          <div className="service-business__step service-business__success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill="#22C55E" fillOpacity="0.2" />
                <circle cx="32" cy="32" r="24" fill="#22C55E" />
                <path d="M26 32L30 36L38 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="heading-container">
              <p className="heading">{isReconfiguring ? 'Booking Updated!' : 'Setup Complete!'}</p>
              <p className="sub-heading">
                {completedProvider === 'globy'
                  ? `Your Globy Booking system is ready with ${completedServicesCount} service${completedServicesCount !== 1 ? 's' : ''}. Customers can start booking appointments on your website.`
                  : `Your ${completedProvider} booking widget is now connected. Customers can book appointments through your website.`
                }
              </p>
            </div>
            <div className="action-container">
              <button onClick={handleClose}>Done</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose} className="service-business-modal">
      <div className="service-business">
        <div className="brand-logo">
          <img src="/images/globy-logo.svg" alt="Globy logo" />
        </div>
        <button className="close-btn" onClick={handleClose}>
          <img src={PlusIcon} alt="Close" />
        </button>
        <div className="service-business__container">
          {renderStep()}
        </div>
      </div>
    </Modal>
  );
}
