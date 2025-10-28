/**
 * Mock data generator for analytics dashboard
 * Simulates 1000+ sessions with realistic hesitation patterns
 */

export interface SessionData {
	id: string
	timestamp: Date
	elementId: string
	elementName: string
	hesitationLevel: number
	metrics: {
		hoverDuration: number
		refocusCount: number
		cursorJitter: number
		scrollCount: number
	}
	converted: boolean
	offerShown: boolean
}

export interface DailyStats {
	date: string
	sessions: number
	avgHesitation: number
	highHesitationRate: number
	conversionRate: number
}

export interface ElementStats {
	elementName: string
	sessions: number
	avgHesitation: number
	conversionRate: number
}

// Generate realistic session data
const ELEMENTS = [
	{ id: 'buy-button', name: 'Buy Now Button' },
	{ id: 'add-to-cart', name: 'Add to Cart' },
	{ id: 'checkout-btn', name: 'Checkout Button' },
	{ id: 'pricing-card-pro', name: 'Pro Plan Card' },
	{ id: 'signup-button', name: 'Sign Up Button' },
]

function randomBetween(min: number, max: number): number {
	return Math.random() * (max - min) + min
}

function generateSession(index: number): SessionData {
	const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]
	const hesitationLevel = Math.random()

	// Higher hesitation = more metrics activity
	const hoverDuration = randomBetween(500, 8000) * (hesitationLevel + 0.3)
	const refocusCount = Math.floor(randomBetween(0, 5) * (hesitationLevel + 0.2))
	const cursorJitter = randomBetween(0, 150) * (hesitationLevel + 0.1)
	const scrollCount = Math.floor(randomBetween(0, 8) * (hesitationLevel + 0.1))

	const offerShown = hesitationLevel > 0.7
	const converted = offerShown
		? Math.random() > 0.4 // 60% conversion if offer shown
		: Math.random() > 0.8 // 20% conversion if no offer

	// Generate timestamp within last 30 days
	const daysAgo = Math.floor(Math.random() * 30)
	const timestamp = new Date()
	timestamp.setDate(timestamp.getDate() - daysAgo)
	timestamp.setHours(Math.floor(Math.random() * 24))
	timestamp.setMinutes(Math.floor(Math.random() * 60))

	return {
		id: `session-${index}`,
		timestamp,
		elementId: element.id,
		elementName: element.name,
		hesitationLevel: Math.round(hesitationLevel * 100) / 100,
		metrics: {
			hoverDuration: Math.round(hoverDuration),
			refocusCount,
			cursorJitter: Math.round(cursorJitter * 10) / 10,
			scrollCount,
		},
		converted,
		offerShown,
	}
}

// Generate 1000 sessions
export const MOCK_SESSIONS: SessionData[] = Array.from({ length: 1000 }, (_, i) =>
	generateSession(i)
)

// Calculate daily stats
export const DAILY_STATS: DailyStats[] = (() => {
	const statsMap = new Map<string, SessionData[]>()

	MOCK_SESSIONS.forEach((session) => {
		const dateKey = session.timestamp.toISOString().split('T')[0]
		if (!statsMap.has(dateKey)) {
			statsMap.set(dateKey, [])
		}
		statsMap.get(dateKey)!.push(session)
	})

	return Array.from(statsMap.entries())
		.map(([date, sessions]) => {
			const avgHesitation = sessions.reduce((sum, s) => sum + s.hesitationLevel, 0) / sessions.length
			const highHesitationCount = sessions.filter((s) => s.hesitationLevel > 0.7).length
			const convertedCount = sessions.filter((s) => s.converted).length

			return {
				date,
				sessions: sessions.length,
				avgHesitation: Math.round(avgHesitation * 100) / 100,
				highHesitationRate: Math.round((highHesitationCount / sessions.length) * 100),
				conversionRate: Math.round((convertedCount / sessions.length) * 100),
			}
		})
		.sort((a, b) => a.date.localeCompare(b.date))
})()

// Calculate element stats
export const ELEMENT_STATS: ElementStats[] = (() => {
	const statsMap = new Map<string, SessionData[]>()

	MOCK_SESSIONS.forEach((session) => {
		if (!statsMap.has(session.elementName)) {
			statsMap.set(session.elementName, [])
		}
		statsMap.get(session.elementName)!.push(session)
	})

	return Array.from(statsMap.entries())
		.map(([elementName, sessions]) => {
			const avgHesitation = sessions.reduce((sum, s) => sum + s.hesitationLevel, 0) / sessions.length
			const convertedCount = sessions.filter((s) => s.converted).length

			return {
				elementName,
				sessions: sessions.length,
				avgHesitation: Math.round(avgHesitation * 100) / 100,
				conversionRate: Math.round((convertedCount / sessions.length) * 100),
			}
		})
		.sort((a, b) => b.avgHesitation - a.avgHesitation)
})()

// Calculate overview stats
export const OVERVIEW_STATS = {
	totalSessions: MOCK_SESSIONS.length,
	avgHesitation: Math.round(
		(MOCK_SESSIONS.reduce((sum, s) => sum + s.hesitationLevel, 0) / MOCK_SESSIONS.length) * 100
	),
	highHesitationRate: Math.round(
		(MOCK_SESSIONS.filter((s) => s.hesitationLevel > 0.7).length / MOCK_SESSIONS.length) * 100
	),
	conversionRate: Math.round(
		(MOCK_SESSIONS.filter((s) => s.converted).length / MOCK_SESSIONS.length) * 100
	),
	offerShownCount: MOCK_SESSIONS.filter((s) => s.offerShown).length,
	offerConversionRate: Math.round(
		(MOCK_SESSIONS.filter((s) => s.offerShown && s.converted).length /
			MOCK_SESSIONS.filter((s) => s.offerShown).length) *
			100
	),
}

// Hesitation distribution (for histogram)
export const HESITATION_DISTRIBUTION = (() => {
	const buckets = Array.from({ length: 10 }, (_, i) => ({
		range: `${i * 10}-${(i + 1) * 10}%`,
		count: 0,
		percentage: 0,
	}))

	MOCK_SESSIONS.forEach((session) => {
		const bucketIndex = Math.min(Math.floor(session.hesitationLevel * 10), 9)
		buckets[bucketIndex].count++
	})

	buckets.forEach((bucket) => {
		bucket.percentage = Math.round((bucket.count / MOCK_SESSIONS.length) * 100)
	})

	return buckets
})()
