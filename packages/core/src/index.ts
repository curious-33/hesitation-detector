export { useHesitation } from './hooks/useHesitation'

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
