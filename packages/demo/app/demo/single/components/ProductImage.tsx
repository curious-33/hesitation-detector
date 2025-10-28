import Image from 'next/image'

interface ProductImageProps {
	image: string
	title: string
	imageLoaded: boolean
	onImageLoad: () => void
}

export default function ProductImage({ image, title, imageLoaded, onImageLoad }: ProductImageProps) {
	return (
		<div className='relative overflow-hidden rounded-lg mb-4 sm:mb-6 border border-gray-200 dark:border-gray-800'>
			<Image
				src={`${image}?w=50&h=50&fit=crop&blur=10`}
				alt={title}
				width={800}
				height={500}
				className={`absolute inset-0 w-full h-64 sm:h-80 object-cover scale-110 blur-2xl transition-all duration-1000 ease-in-out ${
					imageLoaded ? 'opacity-0 scale-100' : 'opacity-100'
				}`}
			/>
			<Image
				src={`${image}?w=800&h=500&fit=crop`}
				alt={title}
				width={800}
				height={500}
				className={`w-full h-64 sm:h-80 object-cover transition-all duration-1000 ease-in-out ${
					imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
				}`}
				onLoadingComplete={onImageLoad}
			/>
		</div>
	)
}
