export { useHesitation } from './hooks/useHesitation'
export { useHesitationMetrics } from './hooks/useHesitationMetrics'
export { useHesitationSuggestion } from './hooks/useHesitationSuggestion'

// Re-export types from core package
export type {
	HesitationConfig,
	HesitationResult,
	BehaviorMetrics,
	MouseTrackingState,
} from '@hesitation-detector/core'

// Export React-specific types
export type { AggregatedMetrics } from './hooks/useHesitationMetrics'
export type {
	SuggestionResult,
	SuggestionMessages,
} from './hooks/useHesitationSuggestion'
