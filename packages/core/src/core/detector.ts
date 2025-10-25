import { BehaviorMetrics, HesitationConfig, HesitationResult } from '../types'

const DEFAULT_CONFIG: Required<Omit<HesitationConfig, 'selector'>> = {
	hoverThreshold: 3000,
	jitterThreshold: 100,
	refocusThreshold: 2,
	trackScroll: true,
	debounceMs: 100,
}

export function calculateHesitationScore(
	metrics: BehaviorMetrics,
	config: Required<HesitationConfig>
): number {
	const { hoverDuration, refocusCount, cursorJitter, scrollCount } = metrics

	const hoverScore = Math.min(hoverDuration / config.hoverThreshold, 1)
	const refocusScore = Math.min(refocusCount / config.refocusThreshold, 1)
	const jitterScore = Math.min(cursorJitter / config.jitterThreshold, 1)
	const scrollScore = Math.min(scrollCount / 5, 1)

	const score =
		hoverScore * 0.4 +
		refocusScore * 0.3 +
		jitterScore * 0.2 +
		scrollScore * 0.1

	return Math.min(Math.max(score, 0), 1)
}

export function calculateCursorJitter(
	positions: Array<{ x: number; y: number; timestamp: number }>
): number {
	if (positions.length < 3) return 0

	let totalSpeed = 0
	let speedVariance = 0
	const speeds: number[] = []

	for (let i = 1; i < positions.length; i++) {
		const prev = positions[i - 1]
		const curr = positions[i]
		const distance = Math.sqrt(
			Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
		)
		const timeDelta = Math.max(curr.timestamp - prev.timestamp, 1)
		const speed = distance / timeDelta

		speeds.push(speed)
		totalSpeed += speed
	}

	const avgSpeed = totalSpeed / speeds.length
	for (const speed of speeds) {
		speedVariance += Math.pow(speed - avgSpeed, 2)
	}

	return Math.sqrt(speedVariance / speeds.length)
}

export function getSuggestion(
	hesitationLevel: number
): HesitationResult['suggestion'] {
	if (hesitationLevel >= 0.8) return 'offer'
	if (hesitationLevel >= 0.6) return 'help'
	if (hesitationLevel >= 0.4) return 'compare'
	return null
}

export function mergeConfig(
	config: HesitationConfig
): Required<HesitationConfig> {
	return {
		...DEFAULT_CONFIG,
		...config,
	}
}
