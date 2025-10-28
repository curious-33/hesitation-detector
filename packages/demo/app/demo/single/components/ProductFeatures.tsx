interface ProductFeaturesProps {
	features: string[]
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
	return (
		<div className='flex flex-wrap gap-2 mb-6 sm:mb-8'>
			{features.map((feature, index) => (
				<>
					<span key={feature} className='text-sm text-gray-600 dark:text-gray-400'>
						{feature}
					</span>
					{index < features.length - 1 && (
						<span key={`separator-${index}`} className='text-gray-300 dark:text-gray-700'>
							·
						</span>
					)}
				</>
			))}
		</div>
	)
}
