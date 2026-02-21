import { useState } from 'react';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import SpinnerLoading from '../ui/SpinnerLoading/SpinnerLoading';
import { startOnboarding, acceptServices, type Service, type ServiceCategory } from '~/services/bookingApis';
import { useAppContext } from '~/providers/AppContextProvider';

type Step = 'business-info' | 'review-services';

interface Props {
  onBack: () => void;
  onComplete: (servicesCount: number) => void;
}

interface FormState {
  business_name: string;
  business_type: string;
  currency: string;
  description: string;
}

const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
];

const BUSINESS_TYPE_TO_CATEGORY: Record<string, ServiceCategory> = {
  salon: 'hair',
  barbershop: 'barber',
  spa: 'spa',
  beauty: 'nails',
  massage: 'massage',
  fitness: 'consultation',
  medical: 'consultation',
  dental: 'consultation',
  other: 'other',
};

type TemplateService = Omit<Service, 'business_id' | 'currency'>;

const SERVICE_TEMPLATES: Record<string, TemplateService[]> = {
  salon: [
    { name: 'Haircut', duration_minutes: 30, price: 35, category: 'hair' },
    { name: 'Hair Coloring', duration_minutes: 90, price: 85, category: 'hair' },
    { name: 'Highlights', duration_minutes: 120, price: 120, category: 'hair' },
    { name: 'Blowout', duration_minutes: 45, price: 45, category: 'hair' },
    { name: 'Deep Conditioning Treatment', duration_minutes: 30, price: 40, category: 'hair' },
  ],
  barbershop: [
    { name: 'Haircut', duration_minutes: 30, price: 25, category: 'barber' },
    { name: 'Beard Trim', duration_minutes: 15, price: 15, category: 'barber' },
    { name: 'Haircut & Beard', duration_minutes: 45, price: 35, category: 'barber' },
    { name: 'Hot Towel Shave', duration_minutes: 30, price: 30, category: 'barber' },
    { name: 'Kids Haircut', duration_minutes: 20, price: 18, category: 'barber' },
  ],
  spa: [
    { name: 'Swedish Massage (60 min)', duration_minutes: 60, price: 90, category: 'massage' },
    { name: 'Deep Tissue Massage (60 min)', duration_minutes: 60, price: 110, category: 'massage' },
    { name: 'Facial Treatment', duration_minutes: 60, price: 85, category: 'facial' },
    { name: 'Body Wrap', duration_minutes: 90, price: 120, category: 'spa' },
    { name: 'Aromatherapy Session', duration_minutes: 45, price: 70, category: 'spa' },
  ],
  beauty: [
    { name: 'Manicure', duration_minutes: 30, price: 30, category: 'nails' },
    { name: 'Pedicure', duration_minutes: 45, price: 45, category: 'nails' },
    { name: 'Gel Nails', duration_minutes: 60, price: 55, category: 'nails' },
    { name: 'Eyebrow Waxing', duration_minutes: 15, price: 18, category: 'brows' },
    { name: 'Makeup Application', duration_minutes: 45, price: 65, category: 'makeup' },
  ],
  massage: [
    { name: 'Swedish Massage (60 min)', duration_minutes: 60, price: 80, category: 'massage' },
    { name: 'Swedish Massage (90 min)', duration_minutes: 90, price: 110, category: 'massage' },
    { name: 'Deep Tissue Massage (60 min)', duration_minutes: 60, price: 95, category: 'massage' },
    { name: 'Sports Massage', duration_minutes: 60, price: 100, category: 'massage' },
    { name: 'Hot Stone Massage', duration_minutes: 75, price: 120, category: 'massage' },
  ],
  fitness: [
    { name: 'Personal Training Session', duration_minutes: 60, price: 70, category: 'consultation' },
    { name: 'Group Fitness Class', duration_minutes: 45, price: 20, category: 'other' },
    { name: 'Nutrition Consultation', duration_minutes: 45, price: 50, category: 'consultation' },
    { name: 'Fitness Assessment', duration_minutes: 60, price: 60, category: 'consultation' },
    { name: 'Yoga Private Session', duration_minutes: 60, price: 65, category: 'other' },
  ],
  medical: [
    { name: 'General Consultation', duration_minutes: 30, price: 100, category: 'consultation' },
    { name: 'Follow-up Visit', duration_minutes: 15, price: 60, category: 'consultation' },
    { name: 'Health Screening', duration_minutes: 45, price: 150, category: 'consultation' },
    { name: 'Vaccination', duration_minutes: 15, price: 40, category: 'other' },
    { name: 'Physical Examination', duration_minutes: 60, price: 200, category: 'consultation' },
  ],
  dental: [
    { name: 'Dental Cleaning', duration_minutes: 45, price: 100, category: 'other' },
    { name: 'Dental Exam', duration_minutes: 30, price: 75, category: 'consultation' },
    { name: 'Teeth Whitening', duration_minutes: 60, price: 300, category: 'other' },
    { name: 'Filling', duration_minutes: 45, price: 150, category: 'other' },
    { name: 'Consultation', duration_minutes: 20, price: 50, category: 'consultation' },
  ],
  other: [
    { name: 'Consultation', duration_minutes: 30, price: 50, category: 'consultation' },
    { name: 'Standard Service', duration_minutes: 60, price: 75, category: 'other' },
    { name: 'Premium Service', duration_minutes: 90, price: 120, category: 'other' },
  ],
};

export default function GlobyBookingSetup({ onBack, onComplete }: Props) {
  const { userId } = useAppContext();
  const [step, setStep] = useState<Step>('business-info');
  const [isLoading, setIsLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [suggestedServices, setSuggestedServices] = useState<Service[]>([]);
  const [showTemplateConfirm, setShowTemplateConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    business_name: '',
    business_type: '',
    currency: 'EUR',
    description: '',
  });

  const getCurrencySymbol = () => {
    return CURRENCIES.find(c => c.code === formState.currency)?.symbol || formState.currency;
  };

  const handleFormChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const getTemplateServices = (): Service[] => {
    const template = SERVICE_TEMPLATES[formState.business_type];
    if (!template) return [];
    return template.map(s => ({
      ...s,
      currency: formState.currency,
    }));
  };

  const applyTemplate = () => {
    const templateServices = getTemplateServices();
    if (templateServices.length > 0) {
      setSuggestedServices(templateServices);
      toast.success('Template applied successfully');
    }
    setShowTemplateConfirm(false);
  };

  const handleApplyTemplateClick = () => {
    if (suggestedServices.length > 0) {
      setShowTemplateConfirm(true);
    } else {
      applyTemplate();
    }
  };

  const handleClearAll = () => {
    setSuggestedServices([]);
    setShowClearConfirm(false);
    toast.success('All services cleared');
  };

  const handleClearClick = () => {
    if (suggestedServices.length > 0) {
      setShowClearConfirm(true);
    }
  };

  const handleStartOnboarding = async () => {
    if (!formState.business_name || !formState.business_type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!userId) {
      toast.error('User not authenticated');
      return;
    }

    const newBusinessId = crypto.randomUUID();
    setIsLoading(true);
    try {
      const response = await startOnboarding({
        business_id: newBusinessId,
        user_id: userId,
        business_name: formState.business_name,
        business_type: formState.business_type,
        description: formState.description || undefined,
      });
      if (response.status === 200 && response.data) {
        const { businessId: id, suggestedServices: services } = response.data;
        setBusinessId(id || newBusinessId);

        // Use API-suggested services if available, otherwise auto-fill from template
        const apiServices = Array.isArray(services) ? services : [];
        if (apiServices.length > 0) {
          setSuggestedServices(apiServices);
        } else {
          // Auto-fill with template services if none from API
          const templateServices = getTemplateServices();
          setSuggestedServices(templateServices);
        }
        setStep('review-services');
      } else {
        toast.error('Failed to start onboarding. Please try again.');
      }
    } catch (error) {
      console.error('startOnboarding error:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error('Failed to start onboarding. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceChange = (index: number, field: keyof Service, value: string | number) => {
    setSuggestedServices(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveService = (index: number) => {
    setSuggestedServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddService = () => {
    const defaultCategory = BUSINESS_TYPE_TO_CATEGORY[formState.business_type] || 'other';
    setSuggestedServices(prev => [
      ...prev,
      {
        name: '',
        duration_minutes: 30,
        price: 0,
        category: defaultCategory,
        currency: formState.currency,
      }
    ]);
  };

  const handleAcceptServices = async () => {
    if (!businessId) return;

    const validServices = suggestedServices
      .filter(s => s.name.trim() !== '')
      .map(s => ({
        ...s,
        user_id: businessId,
        currency: formState.currency,
      }));

    if (validServices.length === 0) {
      toast.error('Please add at least one service');
      return;
    }

    setIsLoading(true);
    try {
      const response = await acceptServices(businessId, validServices);
      if (response.status === 200) {
        toast.success('Booking system set up successfully!');
        onComplete(validServices.length);
      }
    } catch (error) {
      console.error('acceptServices error:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error('Failed to save services. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'business-info') {
    return (
      <div className="service-business__step">
        <div className="heading-container">
          <p className="heading">Tell us about your business</p>
          <p className="sub-heading">We'll use this to suggest services for your booking system</p>
        </div>

        <div className="form-group">
          <label htmlFor="businessName">Business Name *</label>
          <input
            type="text"
            id="businessName"
            value={formState.business_name}
            onChange={(e) => handleFormChange('business_name', e.target.value)}
            placeholder="Enter your business name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessType">Business Type *</label>
          <select
            id="businessType"
            value={formState.business_type}
            onChange={(e) => handleFormChange('business_type', e.target.value)}
          >
            <option value="">Select a type</option>
            <option value="salon">Hair Salon</option>
            <option value="barbershop">Barbershop</option>
            <option value="spa">Spa & Wellness</option>
            <option value="beauty">Beauty & Cosmetics</option>
            <option value="massage">Massage Therapy</option>
            <option value="fitness">Fitness & Personal Training</option>
            <option value="medical">Medical & Healthcare</option>
            <option value="dental">Dental</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency *</label>
          <select
            id="currency"
            value={formState.currency}
            onChange={(e) => handleFormChange('currency', e.target.value)}
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={formState.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            placeholder="Describe your services..."
            rows={3}
          />
        </div>

        <div className="action-container">
          <button className="secondary" onClick={onBack}>
            Back
          </button>
          <button onClick={handleStartOnboarding} disabled={isLoading}>
            {isLoading ? <SpinnerLoading /> : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  const hasTemplate = SERVICE_TEMPLATES[formState.business_type]?.length > 0;
  const currencySymbol = getCurrencySymbol();

  return (
    <div className="service-business__step">
      <div className="heading-container">
        <p className="heading">Review your services</p>
        <p className="sub-heading">We've suggested services based on your business type. Feel free to modify or add more.</p>
      </div>

      {showTemplateConfirm && (
        <div className="template-confirm">
          <div className="template-confirm__content">
            <p className="template-confirm__warning">
              This will replace your existing {suggestedServices.length} service{suggestedServices.length !== 1 ? 's' : ''} with the template.
            </p>
            <div className="template-confirm__actions">
              <button className="secondary" onClick={() => setShowTemplateConfirm(false)}>
                Cancel
              </button>
              <button className="danger" onClick={applyTemplate}>
                Replace Services
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="template-confirm">
          <div className="template-confirm__content">
            <p className="template-confirm__warning">
              This will remove all {suggestedServices.length} service{suggestedServices.length !== 1 ? 's' : ''} from your list.
            </p>
            <div className="template-confirm__actions">
              <button className="secondary" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className="danger" onClick={handleClearAll}>
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="services-header">
        <div className="services-header__left">
          <span className="service-count">
            {suggestedServices.length} service{suggestedServices.length !== 1 ? 's' : ''}
          </span>
          {suggestedServices.length > 0 && (
            <button
              type="button"
              className="clear-btn"
              onClick={handleClearClick}
            >
              Clear All
            </button>
          )}
        </div>
        {hasTemplate && (
          <button
            type="button"
            className="template-btn"
            onClick={handleApplyTemplateClick}
          >
            Use Template
          </button>
        )}
      </div>

      <div className="services-list">
        {suggestedServices.length === 0 ? (
          <div className="services-empty">
            <p>No services added yet.</p>
            <p>Add services manually or use a template to get started.</p>
          </div>
        ) : (
          suggestedServices.map((service, index) => (
            <div key={index} className="service-item">
              <div className="service-item__header">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                  placeholder="Service name"
                  className="service-name"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleRemoveService(index)}
                >
                  &times;
                </button>
              </div>
              <div className="service-item__details">
                <div className="field">
                  <label>Duration (min)</label>
                  <input
                    type="number"
                    value={service.duration_minutes}
                    onChange={(e) => handleServiceChange(index, 'duration_minutes', parseInt(e.target.value) || 0)}
                    min={5}
                    step={5}
                  />
                </div>
                <div className="field">
                  <label>Price ({currencySymbol})</label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </div>
          ))
        )}

        <button type="button" className="add-service-btn" onClick={handleAddService}>
          + Add Service
        </button>
      </div>

      <div className="action-container">
        <button className="secondary" onClick={() => setStep('business-info')}>
          Back
        </button>
        <button onClick={handleAcceptServices} disabled={isLoading || suggestedServices.length === 0}>
          {isLoading ? <SpinnerLoading /> : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}
