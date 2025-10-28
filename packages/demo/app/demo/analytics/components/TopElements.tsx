'use client'

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'
import { ElementStats } from '../lib/mock-data'

interface TopElementsProps {
	data: ElementStats[]
}

export default function TopElements({ data }: TopElementsProps) {
	return (
		<div className='bg-white dark:bg-gray-950 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-800'>
			<div className='mb-4'>
				<h3 className='text-lg font-semibold text-black dark:text-white mb-1'>
					Top Elements by Hesitation
				</h3>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					Elements sorted by average hesitation score
				</p>
			</div>
			<ResponsiveContainer width='100%' height={350}>
				<BarChart
					data={data}
					layout='vertical'
					margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
					<XAxis type='number' stroke='#9CA3AF' />
					<YAxis
						dataKey='elementName'
						type='category'
						stroke='#9CA3AF'
						width={110}
						tick={{ fontSize: 12 }}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: '#1F2937',
							border: '1px solid #374151',
							borderRadius: '8px',
						}}
						labelStyle={{ color: '#F9FAFB' }}
					/>
					<Legend />
					<Bar
						dataKey='avgHesitation'
						fill='#8B5CF6'
						name='Avg Hesitation'
					/>
					<Bar
						dataKey='conversionRate'
						fill='#10B981'
						name='Conversion %'
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
