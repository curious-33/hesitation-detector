'use client'

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'
import { DailyStats } from '../lib/mock-data'

interface HesitationTrendsProps {
	data: DailyStats[]
}

export default function HesitationTrends({ data }: HesitationTrendsProps) {
	return (
		<div className='bg-white dark:bg-gray-950 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-800'>
			<h3 className='text-lg font-semibold mb-4 text-black dark:text-white'>
				Hesitation Trends (Last 30 Days)
			</h3>
			<ResponsiveContainer width='100%' height={300}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
					<XAxis
						dataKey='date'
						tickFormatter={(value) => {
							const date = new Date(value)
							return `${date.getMonth() + 1}/${date.getDate()}`
						}}
						stroke='#9CA3AF'
					/>
					<YAxis stroke='#9CA3AF' />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1F2937',
							border: '1px solid #374151',
							borderRadius: '8px',
						}}
						labelStyle={{ color: '#F9FAFB' }}
					/>
					<Legend />
					<Line
						type='monotone'
						dataKey='avgHesitation'
						stroke='#8B5CF6'
						name='Avg Hesitation'
						strokeWidth={2}
					/>
					<Line
						type='monotone'
						dataKey='highHesitationRate'
						stroke='#EF4444'
						name='High Hesitation %'
						strokeWidth={2}
					/>
					<Line
						type='monotone'
						dataKey='conversionRate'
						stroke='#10B981'
						name='Conversion %'
						strokeWidth={2}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}
