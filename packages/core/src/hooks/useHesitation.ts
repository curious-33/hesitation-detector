import { useState, useEffect, useRef, useCallback } from 'react'
import {
	HesitationConfig,
	HesitationResult,
	BehaviorMetrics,
	MouseTrackingState,
} from '../types'
import {
	calculateHesitationScore,
	calculateCursorJitter,
	getSuggestion,
	mergeConfig,
} from '../core/detector'

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
	const config = mergeConfig({ selector, ...userConfig })

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

	const trackingState = useRef<MouseTrackingState>({
		positions: [],
		lastHoverStart: null,
		totalHoverTime: 0,
		hoverCount: 0,
	})

	const scrollCountRef = useRef(0)
	const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	)

	const updateHesitationScore = useCallback(() => {
		if (updateTimeoutRef.current) {
			clearTimeout(updateTimeoutRef.current)
		}

		updateTimeoutRef.current = setTimeout(() => {
			const state = trackingState.current
			const jitter = calculateCursorJitter(state.positions)

			const metrics: BehaviorMetrics = {
				hoverDuration: state.totalHoverTime,
				refocusCount: Math.max(state.hoverCount - 1, 0),
				cursorJitter: jitter,
				scrollCount: scrollCountRef.current,
				firstInteractionTime: state.positions[0]?.timestamp || 0,
				lastInteractionTime:
					state.positions[state.positions.length - 1]?.timestamp || 0,
			}

			const hesitationLevel = calculateHesitationScore(metrics, config)
			const suggestion = getSuggestion(hesitationLevel)

			setResult((prev) => ({
				...prev,
				hesitationLevel,
				metrics,
				suggestion,
			}))
		}, config.debounceMs)
	}, [config])

	useEffect(() => {
		const element = document.querySelector(selector)
		if (!element) {
			console.warn(`[useHesitation] Element not found: ${selector}`)
			return
		}

		const state = trackingState.current

		const handleMouseEnter = () => {
			state.lastHoverStart = Date.now()
			state.hoverCount++

			setResult((prev) => ({ ...prev, isHovering: true }))
		}

		const handleMouseLeave = () => {
			if (state.lastHoverStart !== null) {
				const hoverDuration = Date.now() - state.lastHoverStart
				state.totalHoverTime += hoverDuration
				state.lastHoverStart = null
			}

			setResult((prev) => ({ ...prev, isHovering: false }))
			updateHesitationScore()
		}

		const handleMouseMove = (e: MouseEvent) => {
			state.positions.push({
				x: e.clientX,
				y: e.clientY,
				timestamp: Date.now(),
			})

			if (state.positions.length > 20) {
				state.positions.shift()
			}

			updateHesitationScore()
		}

		const handleScroll = () => {
			if (!config.trackScroll) return

			const rect = element.getBoundingClientRect()
			const viewportHeight = window.innerHeight

			if (rect.top >= -200 && rect.bottom <= viewportHeight + 200) {
				scrollCountRef.current++
				updateHesitationScore()
			}
		}

		element.addEventListener('mouseenter', handleMouseEnter)
		element.addEventListener('mouseleave', handleMouseLeave)
		element.addEventListener('mousemove', handleMouseMove as EventListener)

		if (config.trackScroll) {
			window.addEventListener('scroll', handleScroll, { passive: true })
		}

		return () => {
			element.removeEventListener('mouseenter', handleMouseEnter)
			element.removeEventListener('mouseleave', handleMouseLeave)
			element.removeEventListener('mousemove', handleMouseMove as EventListener)

			if (config.trackScroll) {
				window.removeEventListener('scroll', handleScroll)
			}

			if (updateTimeoutRef.current) {
				clearTimeout(updateTimeoutRef.current)
			}
		}
	}, [selector, config, updateHesitationScore])

	return result
}
