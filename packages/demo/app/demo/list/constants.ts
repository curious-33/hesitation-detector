export interface Product {
	id: string
	title: string
	price: number
	originalPrice: number
	image: string
	description: string
}

export const PRODUCTS: Product[] = [
	{
		id: 'premium-smartphone',
		title: 'Premium Smartphone',
		price: 499,
		originalPrice: 699,
		image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
		description: 'Latest flagship model with cutting-edge camera system',
	},
	{
		id: 'wireless-earbuds',
		title: 'Wireless Earbuds',
		price: 129,
		originalPrice: 199,
		image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop',
		description: 'Premium sound quality with active noise cancellation',
	},
	{
		id: 'smartwatch',
		title: 'Smartwatch Pro',
		price: 349,
		originalPrice: 449,
		image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
		description: 'Advanced health tracking and fitness features',
	},
	{
		id: 'laptop-stand',
		title: 'Laptop Stand',
		price: 59,
		originalPrice: 89,
		image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
		description: 'Ergonomic aluminum design for better posture',
	},
	{
		id: 'usb-c-hub',
		title: 'USB-C Hub',
		price: 79,
		originalPrice: 119,
		image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop',
		description: '8-in-1 connectivity with 100W power delivery',
	},
	{
		id: 'mechanical-keyboard',
		title: 'Mechanical Keyboard',
		price: 149,
		originalPrice: 199,
		image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
		description: 'Premium mechanical switches with RGB lighting',
	},
]
