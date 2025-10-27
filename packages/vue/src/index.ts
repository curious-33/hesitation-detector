export { useHesitation } from './composables/useHesitation'
export { useHesitationMetrics } from './composables/useHesitationMetrics'
export { useHesitationSuggestion } from './composables/useHesitationSuggestion'

export type {
	HesitationConfig,
	HesitationResult,
	BehaviorMetrics,
	MouseTrackingState,
} from '@hesitation-detector/core'

export type { AggregatedMetrics } from './composables/useHesitationMetrics'
export type {
	SuggestionResult,
	SuggestionMessages,
} from './composables/useHesitationSuggestion'
