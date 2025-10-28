'use client'

import { useHesitation } from '@hesitation-detector/react'
import { useState, useMemo } from 'react'
import Image from 'next/image'

export interface ProductCardProps {
	id: string
	title: string
	price: number
	originalPrice: number
	image: string
	description: string
	mounted: boolean
}

// Utility functions
const calculateDiscount = (price: number, originalPrice: number): number => {
	return Math.round(((originalPrice - price) / originalPrice) * 100)
}

const getHesitationColor = (level: number): string => {
	if (level > 0.7) return 'text-red-500 bg-red-500'
	if (level > 0.4) return 'text-yellow-500 bg-yellow-500'
	return 'text-green-500 bg-green-500'
}

// Sub-components
function OfferBadge() {
	return (
		<div className='absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse'>
			🎁 Extra 5% Off!
		</div>
	)
}

function DiscountBadge({ discount }: { discount: number }) {
	if (discount <= 0) return null
	return (
		<div className='absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
			-{discount}%
		</div>
	)
}

interface ProductImageProps {
	image: string
	title: string
	imageLoaded: boolean
	onImageLoad: () => void
	discount: number
}

function ProductImage({ image, title, imageLoaded, onImageLoad, discount }: ProductImageProps) {
	return (
		<div className='relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900'>
			<Image
				src={`${image}&blur=10`}
				alt={title}
				width={400}
				height={300}
				className={`absolute inset-0 w-full h-full object-cover scale-110 blur-2xl transition-all duration-700 ${
					imageLoaded ? 'opacity-0' : 'opacity-100'
				}`}
			/>
			<Image
				src={image}
				alt={title}
				width={400}
				height={300}
				className={`w-full h-full object-cover transition-all duration-700 ${
					imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
				}`}
				onLoadingComplete={onImageLoad}
			/>
			<DiscountBadge discount={discount} />
		</div>
	)
}

interface HesitationMetricsProps {
	hesitationLevel: number
	hoverDuration: number
	refocusCount: number
}

function HesitationMetrics({ hesitationLevel, hoverDuration, refocusCount }: HesitationMetricsProps) {
	const colors = getHesitationColor(hesitationLevel)
	const [textColor, bgColor] = colors.split(' ')

	return (
		<div className='mb-3 p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-800'>
			<div className='flex justify-between items-center mb-1'>
				<span className='text-xs text-gray-600 dark:text-gray-400'>Hesitation</span>
				<span className={`text-sm font-bold ${textColor}`}>
					{(hesitationLevel * 100).toFixed(0)}%
				</span>
			</div>
			<div className='w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1 overflow-hidden'>
				<div
					className={`h-full transition-all duration-500 ${bgColor}`}
					style={{ width: `${hesitationLevel * 100}%` }}
				/>
			</div>
			<div className='mt-2 grid grid-cols-2 gap-1 text-xs'>
				<MetricItem label='Hover' value={`${(hoverDuration / 1000).toFixed(1)}s`} />
				<MetricItem label='Refocus' value={refocusCount.toString()} />
			</div>
		</div>
	)
}

function MetricItem({ label, value }: { label: string; value: string }) {
	return (
		<div className='flex justify-between'>
			<span className='text-gray-500 dark:text-gray-600'>{label}:</span>
			<span className='text-gray-700 dark:text-gray-300'>{value}</span>
		</div>
	)
}

// Main component
export default function ProductCard({
	id,
	title,
	price,
	originalPrice,
	image,
	description,
	mounted,
}: ProductCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false)

	const config = useMemo(
		() => ({
			hoverThreshold: 2000,
			refocusThreshold: 2,
			debounceMs: 150,
		}),
		[]
	)

	const { hesitationLevel, metrics, isHovering, suggestion } = useHesitation(
		`#card-${id}`,
		config
	)

	const discount = calculateDiscount(price, originalPrice)
	const shouldShowOffer = suggestion === 'offer' || hesitationLevel > 0.7

	return (
		<div
			id={`card-${id}`}
			className='relative bg-white dark:bg-gray-950 rounded-lg overflow-hidden transition-all shadow-md hover:shadow-xl'
		>
			{shouldShowOffer && <OfferBadge />}

			<ProductImage
				image={image}
				title={title}
				imageLoaded={imageLoaded}
				onImageLoad={() => setImageLoaded(true)}
				discount={discount}
			/>

			<div className='p-4'>
				<h3 className='font-semibold text-black dark:text-white mb-2 text-sm'>
					{title}
				</h3>
				<p className='text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
					{description}
				</p>

				<div className='flex items-baseline gap-2 mb-4'>
					<span className='text-lg font-bold text-black dark:text-white'>${price}</span>
					<span className='text-sm text-gray-400 line-through'>${originalPrice}</span>
				</div>

				<HesitationMetrics
					hesitationLevel={hesitationLevel}
					hoverDuration={metrics.hoverDuration}
					refocusCount={metrics.refocusCount}
				/>

				<button
					className={`w-full bg-black dark:bg-white text-white dark:text-black font-semibold px-4 py-2 rounded-lg transition-opacity text-sm ${
						mounted && isHovering ? 'opacity-80' : 'hover:opacity-90'
					}`}
				>
					{mounted && isHovering ? 'Interested?' : 'Add to Cart'}
				</button>
			</div>
		</div>
	)
}
