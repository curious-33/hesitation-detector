'use client'

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts'

interface DistributionData {
	range: string
	count: number
	percentage: number
}

interface HesitationDistributionProps {
	data: DistributionData[]
}

// Helper to get descriptive label for each hesitation range
const getHesitationLabel = (range: string): string => {
	const rangeMap: Record<string, string> = {
		'0-10%': 'Very Confident',
		'10-20%': 'Low Hesitation',
		'20-30%': 'Slight Hesitation',
		'30-40%': 'Moderate',
		'40-50%': 'Medium',
		'50-60%': 'Noticeable',
		'60-70%': 'High',
		'70-80%': 'Very High',
		'80-90%': 'Extreme',
		'90-100%': 'Maximum',
	}
	return rangeMap[range] || range
}

// Helper to get color based on hesitation level
const getBarColor = (range: string): string => {
	const index = parseInt(range.split('-')[0])
	if (index < 30) return '#10B981' // Green - low hesitation
	if (index < 60) return '#F59E0B' // Yellow - medium hesitation
	return '#EF4444' // Red - high hesitation
}

export default function HesitationDistribution({
	data,
}: HesitationDistributionProps) {
	return (
		<div className='bg-white dark:bg-gray-950 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-800'>
			<div className='mb-4'>
				<h3 className='text-lg font-semibold text-black dark:text-white mb-1'>
					Hesitation Score Distribution
				</h3>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					How users are distributed across different hesitation levels
				</p>
			</div>

			{/* Legend */}
			<div className='flex gap-4 mb-4 text-xs'>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 rounded' style={{ backgroundColor: '#10B981' }} />
					<span className='text-gray-600 dark:text-gray-400'>Low (0-30%)</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 rounded' style={{ backgroundColor: '#F59E0B' }} />
					<span className='text-gray-600 dark:text-gray-400'>Medium (30-60%)</span>
				</div>
				<div className='flex items-center gap-2'>
					<div className='w-3 h-3 rounded' style={{ backgroundColor: '#EF4444' }} />
					<span className='text-gray-600 dark:text-gray-400'>High (60-100%)</span>
				</div>
			</div>

			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
					<XAxis dataKey='range' stroke='#9CA3AF' />
					<YAxis stroke='#9CA3AF' label={{ value: 'Sessions', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
					<Tooltip
						contentStyle={{
							backgroundColor: '#1F2937',
							border: '1px solid #374151',
							borderRadius: '8px',
						}}
						labelStyle={{ color: '#F9FAFB' }}
						formatter={(value: number, _name: string, props: any) => {
							const label = getHesitationLabel(props.payload.range)
							return [value, label]
						}}
					/>
					<Bar dataKey='count'>
						{data.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={getBarColor(entry.range)} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
