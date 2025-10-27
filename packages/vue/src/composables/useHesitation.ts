import { ref, reactive, onMounted, onUnmounted } from 'vue'
import {
	HesitationDetector,
	HesitationConfig,
	HesitationCallback,
	BehaviorMetrics,
} from '@hesitation-detector/core'

/**
 * Vue composable for detecting user hesitation on a specific element
 *
 * @param selector - CSS selector for the target element
 * @param config - Optional configuration overrides
 * @returns Reactive hesitation result with score, metrics, and suggestions
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHesitation } from '@hesitation-detector/vue'
 *
 * const { hesitationLevel, isHovering } = useHesitation('#buy-button', {
 *   hoverThreshold: 5000,
 *   refocusThreshold: 3
 * })
 * </script>
 *
 * <template>
 *   <DiscountOffer v-if="hesitationLevel > 0.8" />
 * </template>
 * ```
 */
export function useHesitation(
	selector: string,
	userConfig?: Omit<HesitationConfig, 'selector'>
) {
	const hesitationLevel = ref(0)
	const metrics = reactive<BehaviorMetrics>({
		hoverDuration: 0,
		refocusCount: 0,
		cursorJitter: 0,
		scrollCount: 0,
		firstInteractionTime: 0,
		lastInteractionTime: 0,
	})
	const isHovering = ref(false)
	const suggestion = ref<'offer' | 'help' | 'compare' | null>(null)

	let detector: HesitationDetector | null = null

	onMounted(() => {
		const callback: HesitationCallback = (state) => {
			hesitationLevel.value = state.hesitationLevel
			Object.assign(metrics, state.metrics)
			isHovering.value = state.isHovering
			suggestion.value = state.suggestion
		}

		const config = userConfig ? { ...userConfig } : undefined
		detector = new HesitationDetector(selector, config, callback)
		detector.start()
	})

	onUnmounted(() => {
		detector?.stop()
	})

	return {
		hesitationLevel,
		metrics,
		isHovering,
		suggestion,
	}
}
