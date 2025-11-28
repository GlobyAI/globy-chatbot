import { useFetchKpis } from '~/hooks/useFetchKpis';
import QualityScore from './quality-score';

type Props = {}

export default function QualityScoreCard({ }: Props) {
    const { confidence, hasIncreasedConfidence, } = useFetchKpis();

    const percentage = Math.round(confidence * 100);
    return (
        <div className='sidebar__quality-score'>
            <QualityScore
                hasIncreasedConfidence={hasIncreasedConfidence}
                percentage={percentage}
                title='Identity Insight'
                brandStartingPoint='Starting point'
                brandDetails='No brand details yet'
            />
        </div>
    )
}