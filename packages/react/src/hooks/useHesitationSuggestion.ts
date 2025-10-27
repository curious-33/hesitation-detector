import { useMemo } from 'react'
import { HesitationConfig, HesitationResult } from '@hesitation-detector/core'
import { useHesitation } from './useHesitation'

export interface SuggestionResult {
	/** Suggested action based on hesitation level */
	suggestion: HesitationResult['suggestion']

	/** Current hesitation level */
	hesitationLevel: number

	/** Whether the user is currently hovering */
	isHovering: boolean

	/** Suggested message to display based on suggestion type */
	message: string | null
}

export interface SuggestionMessages {
	/** Message to show for 'offer' suggestion (high hesitation) */
	offer?: string

	/** Message to show for 'help' suggestion (medium-high hesitation) */
	help?: string

	/** Message to show for 'compare' suggestion (medium hesitation) */
	compare?: string
}

const DEFAULT_MESSAGES: Required<SuggestionMessages> = {
	offer: 'Special offer! Get 10% off if you buy now.',
	help: 'Need help? Chat with our support team.',
	compare: 'View comparison to see which option is best for you.',
}

/**
 * React hook for getting actionable suggestions based on user hesitation
 *
 * @param selector - CSS selector for the target element
 * @param config - Optional configuration overrides
 * @param messages - Custom messages for each suggestion type
 * @returns Suggestion result with action, level, and message
 *
 * @example
 * ```tsx
 * const { suggestion, message, hesitationLevel } = useHesitationSuggestion(
 *   '#checkout-button',
 *   { hoverThreshold: 4000 },
 *   { offer: 'Free shipping on orders over $50!' }
 * );
 *
 * if (suggestion === 'offer') {
 *   return <Banner message={message} />;
 * }
 * ```
 */
export function useHesitationSuggestion(
	selector: string,
	userConfig?: Omit<HesitationConfig, 'selector'>,
	customMessages?: SuggestionMessages
): SuggestionResult {
	const result = useHesitation(selector, userConfig)

	const messages = useMemo(
		() => ({ ...DEFAULT_MESSAGES, ...customMessages }),
		[customMessages]
	)

	const message = useMemo(() => {
		if (!result.suggestion) return null

		return messages[result.suggestion] || null
	}, [result.suggestion, messages])

	return {
		suggestion: result.suggestion,
		hesitationLevel: result.hesitationLevel,
		isHovering: result.isHovering,
		message,
	}
}
