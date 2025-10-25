export default function MetricRow({
	label,
	value,
}: {
	label: string
	value: string
}) {
	return (
		<div className='flex justify-between items-center'>
			<span className='text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
				{label}
			</span>
			<span className='text-xs sm:text-sm font-semibold text-black dark:text-white'>
				{value}
			</span>
		</div>
	)
}
