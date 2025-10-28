interface ProductPriceProps {
	price: number
	originalPrice: number
}

export default function ProductPrice({ price, originalPrice }: ProductPriceProps) {
	return (
		<div className='flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4'>
			<p className='text-3xl sm:text-4xl font-bold text-black dark:text-white'>
				${price}
			</p>
			<span className='text-lg sm:text-xl text-gray-400 line-through'>
				${originalPrice}
			</span>
		</div>
	)
}
