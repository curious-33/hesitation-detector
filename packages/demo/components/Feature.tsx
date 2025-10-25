export default function Feature({
	icon,
	title,
	description,
}: {
	icon: React.ReactNode
	title: string
	description: string
}) {
	return (
		<div className='p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-xl dark:bg-gray-900/50 text-center'>
			<div className='inline-flex items-center justify-center w-10 h-10 mb-3 sm:mb-4 dark:bg-black border border-gray-200 bg-gray-100 dark:border-gray-800 rounded-full text-gray-700 dark:text-gray-300'>
				{icon}
			</div>
			<h3 className='text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 text-black dark:text-white'>
				{title}
			</h3>
			<p className='text-gray-600 dark:text-gray-400 leading-relaxed text-xs sm:text-sm'>
				{description}
			</p>
		</div>
	)
}
