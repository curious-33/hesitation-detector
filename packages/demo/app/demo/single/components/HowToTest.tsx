export default function HowToTest() {
	return (
		<div className='pt-8 sm:pt-10 border-t border-gray-200 dark:border-gray-800'>
			<p className='text-xs sm:text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3'>
				How to test
			</p>
			<ol className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 list-decimal list-inside'>
				<li>Hover over the &quot;Add to Cart&quot; button and hold for 2+ seconds</li>
				<li>Move your cursor in circles while hovering</li>
				<li>Leave and return to the button multiple times</li>
				<li>Watch the metrics update in real-time on the right</li>
			</ol>
		</div>
	)
}
