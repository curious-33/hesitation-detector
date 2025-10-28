'use client'
import dynamic from 'next/dynamic'

import HesitationTrends from './components/HesitationTrends'
import HesitationDistribution from './components/HesitationDistribution'
import TopElements from './components/TopElements'
import {
	OVERVIEW_STATS,
	DAILY_STATS,
	HESITATION_DISTRIBUTION,
	ELEMENT_STATS,
	MOCK_SESSIONS,
} from './lib/mock-data'

const MetricCard = dynamic(() => import('./components/MetricCard'), {
	ssr: false,
})
const SessionsTable = dynamic(() => import('./components/SessionsTable'), {
	ssr: false,
})

export default function AnalyticsPage() {
	return (
		<div className='space-y-8'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold text-black dark:text-white mb-2'>
					Analytics Dashboard
				</h1>
				<p className='text-gray-600 dark:text-gray-400'>
					Track user hesitation patterns and conversion metrics across your
					application
				</p>
			</div>

			{/* Overview Metrics */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<MetricCard
					title='Total Sessions'
					value={OVERVIEW_STATS.totalSessions.toLocaleString()}
					subtitle='Last 30 days'
				/>
				<MetricCard
					title='Avg Hesitation'
					value={`${OVERVIEW_STATS.avgHesitation}%`}
					subtitle='Across all elements'
				/>
				<MetricCard
					title='High Hesitation Rate'
					value={`${OVERVIEW_STATS.highHesitationRate}%`}
					subtitle='Sessions > 70% hesitation'
				/>
				<MetricCard
					title='Conversion Rate'
					value={`${OVERVIEW_STATS.conversionRate}%`}
					subtitle={`${OVERVIEW_STATS.offerConversionRate}% with offer shown`}
				/>
			</div>

			{/* Charts Row 1 */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<HesitationTrends data={DAILY_STATS} />
				<HesitationDistribution data={HESITATION_DISTRIBUTION} />
			</div>

			{/* Charts Row 2 */}
			<div className='grid grid-cols-1 gap-6'>
				<TopElements data={ELEMENT_STATS} />
			</div>

			{/* Sessions Table */}
			<SessionsTable data={MOCK_SESSIONS} />
		</div>
	)
}
