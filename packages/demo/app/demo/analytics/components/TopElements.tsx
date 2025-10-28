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
			<h3 className='text-lg font-semibold mb-4 text-black dark:text-white'>
				Top Elements by Hesitation
			</h3>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data} layout='vertical'>
					<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
					<XAxis type='number' stroke='#9CA3AF' />
					<YAxis dataKey='elementName' type='category' stroke='#9CA3AF' />
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
