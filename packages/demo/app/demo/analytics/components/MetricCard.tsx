interface MetricCardProps {
	title: string
	value: string | number
	subtitle?: string
	trend?: {
		value: number
		isPositive: boolean
	}
}

export default function MetricCard({
	title,
	value,
	subtitle,
	trend,
}: MetricCardProps) {
	return (
		<div className='bg-white dark:bg-gray-950 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-800'>
			<div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
				{title}
			</div>
			<div className='text-3xl font-bold text-black dark:text-white mb-1'>
				{value}
			</div>
			{subtitle && (
				<div className='text-sm text-gray-600 dark:text-gray-400'>
					{subtitle}
				</div>
			)}
			{trend && (
				<div
					className={`text-sm mt-2 ${
						trend.isPositive
							? 'text-green-600 dark:text-green-400'
							: 'text-red-600 dark:text-red-400'
					}`}
				>
					{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
				</div>
			)}
		</div>
	)
}
