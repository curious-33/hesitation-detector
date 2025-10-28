interface ProductFeaturesProps {
	features: string[]
}

export default function ProductFeatures({ features }: ProductFeaturesProps) {
	return (
		<div className='flex flex-wrap gap-2 mb-6 sm:mb-8'>
			{features.map((feature, index) => (
				<div key={index} className='flex gap-2 items-center'>
					<span
						key={feature}
						className='text-sm text-gray-600 dark:text-gray-400'
					>
						{feature}
					</span>
					{index < features.length - 1 && (
						<span
							key={`separator-${index}`}
							className='w-1 h-1 rounded-full bg-gray-500 dark:bg-gray-700'
						/>
					)}
				</div>
			))}
		</div>
	)
}
