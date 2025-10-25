import Link from 'next/link'

export default function Header() {
	return (
		<header className='border-b border-gray-200 dark:border-gray-800'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center'>
				<Link
					href='/'
					className='text-sm sm:text-base font-semibold text-black dark:text-white'
				>
					Hesitation Detector
				</Link>
				<nav className='flex items-center gap-4 sm:gap-6'>
					<Link
						href='/demo'
						className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors'
					>
						Demo
					</Link>
				</nav>
			</div>
		</header>
	)
}
