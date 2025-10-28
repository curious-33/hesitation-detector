'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import TestInstructions from './components/TestInstructions'
import { PRODUCTS } from './constants'

export default function ProductListDemo() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<div className='max-w-7xl mx-auto'>
			<div className='mb-8'>
				<h1 className='text-xl sm:text-2xl font-bold text-black dark:text-white mb-3'>
					Featured Products
				</h1>
				<p className='text-sm text-gray-600 dark:text-gray-400'>
					Hover over each card to see individual hesitation detection in action
				</p>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{PRODUCTS.map((product) => (
					<ProductCard key={product.id} {...product} mounted={mounted} />
				))}
			</div>

			<TestInstructions />
		</div>
	)
}
