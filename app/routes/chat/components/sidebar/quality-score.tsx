interface QualityScoreProps {
  title: string;
  percentage: number;
  brandStartingPoint: string;
  brandDetails: string,
  hasIncreasedConfidence: boolean
}

import GrowthIcon from '/icons/growth-arrow.svg'

export const QualityScore = ({ title, percentage, brandStartingPoint, brandDetails, hasIncreasedConfidence }: QualityScoreProps) => {
  return (
    <div className="quality-score">
      <div className="quality-score__top">
        <span className="quality-score__title"><img src="/icons/ai.svg" alt="Quality Score AI" /> {title}</span>
        <button className="quality-score__icon"><img src="/icons/help.svg" alt="Quality Score Help" />
          <p className='brand-insight-tip'>
            The more Globy learns about your business the more your website reflects it.
          </p></button>

      </div>

      <div className="quality-score__percentage">
        {
          percentage >= 0 &&
          `${percentage}%`
        }
        {
          hasIncreasedConfidence &&
          <img src={GrowthIcon} />
        }
      </div>

      <div className="quality-score__footer">
        <p className="quality-score__footer-title">{brandStartingPoint}</p>
        <p className="quality-score__footer-text">{brandDetails}</p>
      </div>
    </div>
  );
};

export default QualityScore;