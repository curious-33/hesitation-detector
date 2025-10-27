export { HesitationDetector } from './core/HesitationDetector'
export type { HesitationCallback } from './core/HesitationDetector'

export {
	calculateHesitationScore,
	calculateCursorJitter,
	getSuggestion,
	mergeConfig,
} from './core/detector'

export type {
	HesitationConfig,
	HesitationResult,
	BehaviorMetrics,
	MouseTrackingState,
} from './types'
