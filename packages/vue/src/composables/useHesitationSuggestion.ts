import { computed } from 'vue'
import type { HesitationConfig } from '@hesitation-detector/core'
import { useHesitation } from './useHesitation'

export interface SuggestionResult {
	/** Suggested action based on hesitation level */
	suggestion: 'offer' | 'help' | 'compare' | null

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
 * Vue composable for getting actionable suggestions based on user hesitation
 *
 * @param selector - CSS selector for the target element
 * @param config - Optional configuration overrides
 * @param messages - Custom messages for each suggestion type
 * @returns Reactive suggestion result with action, level, and message
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHesitationSuggestion } from 'hesitation-detector-vue'
 *
 * const { suggestion, message, hesitationLevel } = useHesitationSuggestion(
 *   '#checkout-button',
 *   { hoverThreshold: 4000 },
 *   { offer: 'Free shipping on orders over $50!' }
 * )
 * </script>
 *
 * <template>
 *   <Banner v-if="suggestion === 'offer'" :message="message" />
 * </template>
 * ```
 */
export function useHesitationSuggestion(
	selector: string,
	userConfig?: Omit<HesitationConfig, 'selector'>,
	customMessages?: SuggestionMessages
) {
	const result = useHesitation(selector, userConfig)

	const messages = { ...DEFAULT_MESSAGES, ...customMessages }

	const message = computed(() => {
		if (!result.suggestion.value) return null
		return messages[result.suggestion.value] || null
	})

	return {
		suggestion: result.suggestion,
		hesitationLevel: result.hesitationLevel,
		isHovering: result.isHovering,
		message,
	}
}
