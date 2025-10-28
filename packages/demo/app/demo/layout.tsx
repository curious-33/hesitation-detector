'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DEMO_NAV_ITEMS } from '@/lib/routes'

export default function DemoLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	return (
		<main className='min-h-screen bg-white dark:bg-black antialiased'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
				{/* Tab Navigation */}
				<div className='flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800'>
					{DEMO_NAV_ITEMS.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
								pathname === item.href
									? 'text-black dark:text-white'
									: 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'
							}`}
						>
							{item.label}
							{pathname === item.href && (
								<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white' />
							)}
						</Link>
					))}
				</div>

				{children}
			</div>
		</main>
	)
}
