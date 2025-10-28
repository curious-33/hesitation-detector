/**
 * Application route constants
 * Centralized route definitions for easier navigation and maintenance
 */

export const ROUTES = {
	HOME: '/',
	DEMO: {
		ROOT: '/demo',
		SINGLE: '/demo/single',
		LIST: '/demo/list',
		ANALYTICS: '/demo/analytics',
	},
} as const

/**
 * Navigation items for demo tabs
 */
export const DEMO_NAV_ITEMS = [
	{
		label: 'Single Product',
		href: ROUTES.DEMO.SINGLE,
		description: 'Track user hesitation on a single product page',
	},
	{
		label: 'Product List',
		href: ROUTES.DEMO.LIST,
		description: 'See how the detector works with multiple cards',
	},
	{
		label: 'Analytics',
		href: ROUTES.DEMO.ANALYTICS,
		description: 'View hesitation analytics and conversion metrics',
	},
] as const

/**
 * Type-safe route helper
 */
export type Route = typeof ROUTES
export type DemoRoute = Route['DEMO'][keyof Route['DEMO']]
