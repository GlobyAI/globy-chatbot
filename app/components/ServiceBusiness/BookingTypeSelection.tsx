import SparklesIcon from '/icons/sparkles.svg'

export type BookingType = 'globy' | 'external' | null;

interface Props {
  selectedType: BookingType;
  onSelectType: (type: BookingType) => void;
  onContinue: () => void;
}

export default function BookingTypeSelection({ selectedType, onSelectType, onContinue }: Props) {
  return (
    <div className="service-business__step">
      <div className="heading-container">
        <p className="heading">Set up your booking system</p>
        <p className="sub-heading">Choose how you want customers to book appointments with you</p>
      </div>

      <div className="booking-type-options">
        {/* Globy Booking - Recommended Option */}
        <div
          className={`option option--featured ${selectedType === 'globy' ? 'selected' : ''}`}
          onClick={() => onSelectType('globy')}
        >
          <div className="option__badge">Recommended</div>
          <div className="option__main">
            <span className={`option__avatar ${selectedType === 'globy' ? 'selected' : ''}`}>
              <img src={SparklesIcon} alt="Globy Booking" />
            </span>
            <div className="option__detail">
              <strong>Globy Booking</strong>
              <p>Our all-in-one booking solution - no prior setup needed</p>
            </div>
          </div>
          <div className="option__benefits">
            <div className="benefit">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4.7L6 12L2.7 8.7L3.4 8L6 10.6L12.6 4L13.3 4.7Z" fill="currentColor"/>
              </svg>
              <span>Online payments included</span>
            </div>
            <div className="benefit">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4.7L6 12L2.7 8.7L3.4 8L6 10.6L12.6 4L13.3 4.7Z" fill="currentColor"/>
              </svg>
              <span>AI-powered service suggestions</span>
            </div>
            <div className="benefit">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4.7L6 12L2.7 8.7L3.4 8L6 10.6L12.6 4L13.3 4.7Z" fill="currentColor"/>
              </svg>
              <span>Automatic reminders & calendar sync</span>
            </div>
            <div className="benefit">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3 4.7L6 12L2.7 8.7L3.4 8L6 10.6L12.6 4L13.3 4.7Z" fill="currentColor"/>
              </svg>
              <span>Ready in minutes</span>
            </div>
          </div>
        </div>

        {/* External Provider Option */}
        <div
          className={`option option--external ${selectedType === 'external' ? 'selected' : ''}`}
          onClick={() => onSelectType('external')}
        >
          <div className="option__main">
            <div className="option__detail">
              <strong>Connect Cal.com</strong>
              <p>Already using Cal.com? Connect it for two-way booking sync</p>
            </div>
          </div>
          <div className="option__providers">
            <p className="provider-note">Requires a Cal.com account</p>
          </div>
        </div>
      </div>

      <div className="action-container">
        <button onClick={onContinue} disabled={!selectedType}>
          Continue
        </button>
      </div>
    </div>
  );
}
