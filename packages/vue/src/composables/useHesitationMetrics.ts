import { reactive, watch } from 'vue'
import type {
	BehaviorMetrics,
	HesitationConfig,
} from '@hesitation-detector/core'
import { useHesitation } from './useHesitation'

export interface AggregatedMetrics extends BehaviorMetrics {
	/** Average hesitation level across all tracked elements */
	averageHesitationLevel: number

	/** Highest hesitation level among tracked elements */
	maxHesitationLevel: number

	/** Number of elements currently being tracked */
	elementCount: number

	/** Number of elements currently being hovered */
	activeHoverCount: number
}

/**
 * Vue composable for tracking aggregated hesitation metrics across multiple elements
 *
 * @param selectors - Array of CSS selectors for target elements
 * @param config - Optional configuration overrides
 * @returns Reactive aggregated metrics across all tracked elements
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHesitationMetrics } from 'hesitation-detector-vue'
 *
 * const metrics = useHesitationMetrics(['#buy-button', '#add-to-cart'], {
 *   hoverThreshold: 5000
 * })
 * </script>
 *
 * <template>
 *   <div>Average hesitation: {{ metrics.averageHesitationLevel }}</div>
 *   <div>Total hover time: {{ metrics.hoverDuration }}ms</div>
 * </template>
 * ```
 */
export function useHesitationMetrics(
	selectors: string[],
	userConfig?: Omit<HesitationConfig, 'selector'>
) {
	const results = selectors.map((selector) =>
		useHesitation(selector, userConfig)
	)

	const aggregated = reactive<AggregatedMetrics>({
		hoverDuration: 0,
		refocusCount: 0,
		cursorJitter: 0,
		scrollCount: 0,
		firstInteractionTime: 0,
		lastInteractionTime: 0,
		averageHesitationLevel: 0,
		maxHesitationLevel: 0,
		elementCount: 0,
		activeHoverCount: 0,
	})

	watch(
		() => results.map((r) => ({ ...r })),
		() => {
			if (results.length === 0) {
				return
			}

			// Aggregate metrics
			let totalHoverDuration = 0
			let totalRefocusCount = 0
			let totalCursorJitter = 0
			let totalScrollCount = 0
			let totalHesitationLevel = 0
			let maxHesitation = 0
			let minFirstInteraction = Number.POSITIVE_INFINITY
			let maxLastInteraction = 0
			let activeHovers = 0

			for (const result of results) {
				totalHoverDuration += result.metrics.hoverDuration
				totalRefocusCount += result.metrics.refocusCount
				totalCursorJitter += result.metrics.cursorJitter
				totalScrollCount += result.metrics.scrollCount
				totalHesitationLevel += result.hesitationLevel.value

				if (result.hesitationLevel.value > maxHesitation) {
					maxHesitation = result.hesitationLevel.value
				}

				if (
					result.metrics.firstInteractionTime > 0 &&
					result.metrics.firstInteractionTime < minFirstInteraction
				) {
					minFirstInteraction = result.metrics.firstInteractionTime
				}

				if (result.metrics.lastInteractionTime > maxLastInteraction) {
					maxLastInteraction = result.metrics.lastInteractionTime
				}

				if (result.isHovering.value) {
					activeHovers++
				}
			}

			Object.assign(aggregated, {
				hoverDuration: totalHoverDuration,
				refocusCount: totalRefocusCount,
				cursorJitter: totalCursorJitter / results.length,
				scrollCount: totalScrollCount,
				firstInteractionTime:
					minFirstInteraction === Number.POSITIVE_INFINITY
						? 0
						: minFirstInteraction,
				lastInteractionTime: maxLastInteraction,
				averageHesitationLevel: totalHesitationLevel / results.length,
				maxHesitationLevel: maxHesitation,
				elementCount: results.length,
				activeHoverCount: activeHovers,
			})
		},
		{ deep: true, immediate: true }
	)

	return aggregated
}
