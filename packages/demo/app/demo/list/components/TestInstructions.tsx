export default function TestInstructions() {
	return (
		<div className='mt-12 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg'>
			<p className='text-sm font-semibold text-black dark:text-white mb-3'>
				How to test the list
			</p>
			<ul className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside'>
				<li>Each card has its own independent hesitation detector</li>
				<li>Hover over different cards to see individual tracking</li>
				<li>Try hovering and moving your cursor in circles on a card</li>
				<li>Leave and return to the same card multiple times</li>
				<li>Notice how each card shows offers independently based on your behavior</li>
			</ul>
		</div>
	)
}
