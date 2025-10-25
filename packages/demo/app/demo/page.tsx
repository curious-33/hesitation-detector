'use client'

import { useHesitation } from 'hesitation-detector'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import MetricRow from '@/components/MetricRow'

export default function DemoPage() {
	const [showOffer, setShowOffer] = useState(false)
	const [mounted, setMounted] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)
	const { hesitationLevel, metrics, isHovering } = useHesitation(
		'#buy-button',
		{
			hoverThreshold: 2000,
			refocusThreshold: 2,
		}
	)

	const shouldShowOffer = hesitationLevel > 0.7

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<main className='min-h-screen bg-white dark:bg-black antialiased'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12'>
				<div className='grid lg:grid-cols-5 gap-8 lg:gap-12'>
					<div className='lg:col-span-3'>
						<h1 className='text-xl sm:text-2xl font-bold text-black dark:text-white mb-6 sm:mb-8'>
							Premium Smartphone
						</h1>

						<div className='mb-6 sm:mb-8'>
							<div className='relative overflow-hidden rounded-lg mb-4 sm:mb-6 border border-gray-200 dark:border-gray-800'>
								<Image
									src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=50&h=50&fit=crop&blur=10'
									alt='Smartphone'
									width={800}
									height={500}
									className={`absolute inset-0 w-full h-64 sm:h-80 object-cover scale-110 blur-2xl transition-all duration-1000 ease-in-out ${imageLoaded ? 'opacity-0 scale-100' : 'opacity-100'}`}
								/>
								<Image
									src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=500&fit=crop'
									alt='Smartphone'
									width={800}
									height={500}
									className={`w-full h-64 sm:h-80 object-cover transition-all duration-1000 ease-in-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
									onLoadingComplete={() => setImageLoaded(true)}
								/>
							</div>

							<div className='flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4'>
								<p className='text-3xl sm:text-4xl font-bold text-black dark:text-white'>
									$499
								</p>
								<span className='text-lg sm:text-xl text-gray-400 line-through'>
									$699
								</span>
							</div>

							<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6'>
								Latest flagship model with cutting-edge camera system,
								blazing-fast performance, and all-day battery life.
							</p>

							<div className='flex flex-wrap gap-2 mb-6 sm:mb-8'>
								<span className='text-sm text-gray-600 dark:text-gray-400'>
									Free Shipping
								</span>
								<span className='text-gray-300 dark:text-gray-700'>·</span>
								<span className='text-sm text-gray-600 dark:text-gray-400'>
									2-Year Warranty
								</span>
								<span className='text-gray-300 dark:text-gray-700'>·</span>
								<span className='text-sm text-gray-600 dark:text-gray-400'>
									30-Day Returns
								</span>
							</div>
						</div>

						<div className='space-y-3 sm:space-y-4 mb-8 sm:mb-10'>
							<button
								id='buy-button'
								className={`w-full bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-lg transition-opacity text-sm sm:text-base ${
									mounted && isHovering ? 'opacity-80' : 'hover:opacity-90'
								}`}
								onClick={() => setShowOffer(true)}
							>
								{mounted && isHovering ? 'Thinking about it?' : 'Add to Cart'}
							</button>

							{shouldShowOffer && !showOffer && (
								<div className='p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg'>
									<p className='font-semibold text-black dark:text-white mb-1 sm:mb-1.5 text-sm sm:text-base'>
										Special Offer
									</p>
									<p className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3'>
										We noticed you&apos;re interested. Get an additional 5% off
										right now.
									</p>
									<button className='w-full bg-black dark:bg-white text-white dark:text-black font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base'>
										Claim Discount
									</button>
								</div>
							)}
						</div>

						<div className='pt-8 sm:pt-10 border-t border-gray-200 dark:border-gray-800'>
							<p className='text-xs sm:text-sm font-semibold text-black dark:text-white mb-2 sm:mb-3'>
								How to test
							</p>
							<ol className='text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1.5 sm:space-y-2 list-decimal list-inside'>
								<li>
									Hover over the &quot;Add to Cart&quot; button and hold for 2+
									seconds
								</li>
								<li>Move your cursor in circles while hovering</li>
								<li>Leave and return to the button multiple times</li>
								<li>Watch the metrics update in real-time on the right</li>
							</ol>
						</div>
					</div>

					<div className='lg:col-span-2'>
						<div className='lg:sticky lg:top-12'>
							<h2 className='text-sm sm:text-base font-semibold text-black dark:text-white mb-4 sm:mb-6'>
								Live Metrics
							</h2>

							<div className='mb-6 sm:mb-8 p-4 sm:p-5 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800'>
								<div className='flex justify-between items-center mb-2 sm:mb-3'>
									<span className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400'>
										Score
									</span>
									<span
										className={`text-xl sm:text-2xl font-bold ${
											hesitationLevel > 0.7
												? 'text-red-500'
												: hesitationLevel > 0.4
												? 'text-yellow-500'
												: 'text-green-500'
										}`}
									>
										{(hesitationLevel * 100).toFixed(0)}%
									</span>
								</div>
								<div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 sm:h-2 overflow-hidden'>
									<div
										className={`h-full transition-all duration-500 ${
											hesitationLevel > 0.7
												? 'bg-red-500'
												: hesitationLevel > 0.4
												? 'bg-yellow-500'
												: 'bg-green-500'
										}`}
										style={{ width: `${hesitationLevel * 100}%` }}
									/>
								</div>
							</div>

							<div className='space-y-3 sm:space-y-4'>
								<MetricRow
									label='Hover Duration'
									value={`${(metrics.hoverDuration / 1000).toFixed(1)}s`}
								/>
								<MetricRow
									label='Refocus Count'
									value={metrics.refocusCount.toString()}
								/>
								<MetricRow
									label='Cursor Jitter'
									value={metrics.cursorJitter.toFixed(1)}
								/>
								<MetricRow
									label='Scroll Count'
									value={metrics.scrollCount.toString()}
								/>
								<MetricRow label='Hovering' value={mounted && isHovering ? 'Yes' : 'No'} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
