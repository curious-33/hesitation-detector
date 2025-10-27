import { useState, useEffect, useRef } from 'react'
import {
	HesitationDetector,
	HesitationConfig,
	HesitationResult,
	HesitationCallback,
} from '@hesitation-detector/core'

/**
 * React hook for detecting user hesitation on a specific element
 *
 * @param selector - CSS selector for the target element
 * @param config - Optional configuration overrides
 * @returns HesitationResult with score, metrics, and suggestions
 *
 * @example
 * ```tsx
 * const { hesitationLevel, isHovering } = useHesitation('#buy-button', {
 *   hoverThreshold: 5000,
 *   refocusThreshold: 3
 * });
 *
 * if (hesitationLevel > 0.8) {
 *   return <DiscountOffer />;
 * }
 * ```
 */
export function useHesitation(
	selector: string,
	userConfig?: Omit<HesitationConfig, 'selector'>
): HesitationResult {
	const [result, setResult] = useState<HesitationResult>({
		hesitationLevel: 0,
		metrics: {
			hoverDuration: 0,
			refocusCount: 0,
			cursorJitter: 0,
			scrollCount: 0,
			firstInteractionTime: 0,
			lastInteractionTime: 0,
		},
		isHovering: false,
		suggestion: null,
	})

	const detectorRef = useRef<HesitationDetector | null>(null)
	const callbackRef = useRef<HesitationCallback | null>(null)

	callbackRef.current = (state) => {
		setResult({
			hesitationLevel: state.hesitationLevel,
			metrics: state.metrics,
			isHovering: state.isHovering,
			suggestion: state.suggestion,
		})
	}

	useEffect(() => {
		const callback: HesitationCallback = (state) => {
			callbackRef.current?.(state)
		}

		const detector = new HesitationDetector(selector, userConfig, callback)

		detectorRef.current = detector
		detector.start()

		return () => {
			detector.stop()
			detectorRef.current = null
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selector])

	return result
}
