 interface QualityScoreProps {
    title: string;
    percentage: number;
    brandStartingPoint: string;
    brandDetails: string
 }
 
 export const QualityScore = ({ title, percentage, brandStartingPoint, brandDetails }: QualityScoreProps ) => {
  return (
    <div className="quality-score">
      <div className="quality-score__top">
        <span className="quality-score__title"><img src="/icons/ai.svg" alt="Quality Score AI" /> {title}</span>
        <button className="quality-score__icon"><img src="/icons/help.svg" alt="Quality Score Help" /></button>
      </div>

      <div className="quality-score__percentage">
        {percentage}%
      </div>

      <div className="quality-score__footer">
        <p className="quality-score__footer-title">{brandStartingPoint}</p>
        <p className="quality-score__footer-text">{brandDetails}</p>
      </div>
    </div>
  );
};

export default QualityScore;