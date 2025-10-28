'use client'

import { useHesitation } from '@hesitation-detector/react'
import { useState, useEffect, useMemo } from 'react'
import ProductImage from './components/ProductImage'
import ProductPrice from './components/ProductPrice'
import ProductFeatures from './components/ProductFeatures'
import SpecialOffer from './components/SpecialOffer'
import HowToTest from './components/HowToTest'
import LiveMetricsPanel from './components/LiveMetricsPanel'
import { PRODUCT } from './constants'

export default function SingleProductDemo() {
	const [showOffer, setShowOffer] = useState(false)
	const [mounted, setMounted] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)

	const config = useMemo(
		() => ({
			hoverThreshold: 2000,
			refocusThreshold: 2,
		}),
		[]
	)

	const { hesitationLevel, metrics, isHovering } = useHesitation('#buy-button', config)
	const shouldShowOffer = hesitationLevel > 0.7

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<div className='max-w-5xl mx-auto'>
			<div className='grid lg:grid-cols-5 gap-8 lg:gap-12'>
				{/* Product Details */}
				<div className='lg:col-span-3'>
					<h1 className='text-xl sm:text-2xl font-bold text-black dark:text-white mb-6 sm:mb-8'>
						{PRODUCT.title}
					</h1>

					<div className='mb-6 sm:mb-8'>
						<ProductImage
							image={PRODUCT.image}
							title={PRODUCT.title}
							imageLoaded={imageLoaded}
							onImageLoad={() => setImageLoaded(true)}
						/>
						<ProductPrice price={PRODUCT.price} originalPrice={PRODUCT.originalPrice} />
						<p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 sm:mb-6'>
							{PRODUCT.description}
						</p>
						<ProductFeatures features={PRODUCT.features} />
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

						{shouldShowOffer && (
							<SpecialOffer showOffer={showOffer} onClaimDiscount={() => setShowOffer(true)} />
						)}
					</div>

					<HowToTest />
				</div>

				{/* Live Metrics Sidebar */}
				<div className='lg:col-span-2'>
					<LiveMetricsPanel
						hesitationLevel={hesitationLevel}
						metrics={metrics}
						isHovering={isHovering}
						mounted={mounted}
					/>
				</div>
			</div>
		</div>
	)
}
