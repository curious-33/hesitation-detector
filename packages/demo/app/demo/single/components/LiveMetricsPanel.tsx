import MetricRow from '@/components/MetricRow'

interface LiveMetricsPanelProps {
	hesitationLevel: number
	metrics: {
		hoverDuration: number
		refocusCount: number
		cursorJitter: number
		scrollCount: number
	}
	isHovering: boolean
	mounted: boolean
}

const getHesitationColor = (level: number): string => {
	if (level > 0.7) return 'text-red-500 bg-red-500'
	if (level > 0.4) return 'text-yellow-500 bg-yellow-500'
	return 'text-green-500 bg-green-500'
}

export default function LiveMetricsPanel({
	hesitationLevel,
	metrics,
	isHovering,
	mounted,
}: LiveMetricsPanelProps) {
	const colors = getHesitationColor(hesitationLevel)
	const [textColor, bgColor] = colors.split(' ')

	return (
		<div className='lg:sticky lg:top-12'>
			<h2 className='text-sm sm:text-base font-semibold text-black dark:text-white mb-4 sm:mb-6'>
				Live Metrics
			</h2>

			<div className='mb-6 sm:mb-8 p-4 sm:p-5 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800'>
				<div className='flex justify-between items-center mb-2 sm:mb-3'>
					<span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400'>
						Score
					</span>
					<span className={`text-xl sm:text-2xl font-bold ${textColor}`}>
						{(hesitationLevel * 100).toFixed(0)}%
					</span>
				</div>
				<div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden'>
					<div
						className={`h-full transition-all duration-500 ${bgColor}`}
						style={{ width: `${hesitationLevel * 100}%` }}
					/>
				</div>
			</div>

			<div className='space-y-3 sm:space-y-4'>
				<MetricRow
					label='Hover Duration'
					value={`${(metrics.hoverDuration / 1000).toFixed(1)}s`}
				/>
				<MetricRow label='Refocus Count' value={metrics.refocusCount.toString()} />
				<MetricRow label='Cursor Jitter' value={metrics.cursorJitter.toFixed(1)} />
				<MetricRow label='Scroll Count' value={metrics.scrollCount.toString()} />
				<MetricRow label='Hovering' value={mounted && isHovering ? 'Yes' : 'No'} />
			</div>
		</div>
	)
}
