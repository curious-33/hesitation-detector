interface SpecialOfferProps {
	showOffer: boolean
	onClaimDiscount: () => void
}

export default function SpecialOffer({ showOffer, onClaimDiscount }: SpecialOfferProps) {
	if (showOffer) return null

	return (
		<div className='p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg'>
			<p className='font-semibold text-black dark:text-white mb-1 sm:mb-1.5 text-sm sm:text-base'>
				Special Offer
			</p>
			<p className='text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3'>
				We noticed you&apos;re interested. Get an additional 5% off right now.
			</p>
			<button
				onClick={onClaimDiscount}
				className='w-full bg-black dark:bg-white text-white dark:text-black font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base'
			>
				Claim Discount
			</button>
		</div>
	)
}
