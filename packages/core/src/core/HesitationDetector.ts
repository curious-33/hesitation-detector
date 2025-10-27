import { BehaviorMetrics, HesitationConfig, MouseTrackingState } from '../types'
import {
	calculateHesitationScore,
	calculateCursorJitter,
	getSuggestion,
	mergeConfig,
} from './detector'

export type HesitationCallback = (state: {
	hesitationLevel: number
	metrics: BehaviorMetrics
	isHovering: boolean
	suggestion: 'offer' | 'help' | 'compare' | null
}) => void

/**
 * Framework-agnostic hesitation detector
 * Tracks user behavior on a DOM element and calculates hesitation metrics
 */
export class HesitationDetector {
	private config: Required<HesitationConfig>
	private element: Element | null = null
	private trackingState: MouseTrackingState = {
		positions: [],
		lastHoverStart: null,
		totalHoverTime: 0,
		hoverCount: 0,
	}
	private scrollCount = 0
	private isHovering = false
	private isInViewport = false
	private updateTimeout?: ReturnType<typeof setTimeout>
	private scrollTimeout?: ReturnType<typeof setTimeout>
	private isScrolling = false
	private lastMouseMoveTime = 0
	private intersectionObserver?: IntersectionObserver
	private callback?: HesitationCallback
	private cleanupFunctions: Array<() => void> = []

	constructor(
		selector: string,
		config?: Omit<HesitationConfig, 'selector'>,
		callback?: HesitationCallback
	) {
		this.config = mergeConfig({ selector, ...config })
		this.callback = callback
	}

	start(): void {
		this.element = document.querySelector(this.config.selector)
		if (!this.element) {
			console.warn(
				`[HesitationDetector] Element not found: ${this.config.selector}`
			)
			return
		}

		this.attachListeners()
	}

	stop(): void {
		this.cleanupFunctions.forEach((cleanup) => cleanup())
		this.cleanupFunctions = []

		if (this.updateTimeout) {
			clearTimeout(this.updateTimeout)
		}

		if (this.scrollTimeout) {
			clearTimeout(this.scrollTimeout)
		}

		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect()
			this.intersectionObserver = undefined
		}
	}

	getState() {
		const metrics = this.getCurrentMetrics()
		const hesitationLevel = calculateHesitationScore(metrics, this.config)
		const suggestion = getSuggestion(hesitationLevel)

		return {
			hesitationLevel,
			metrics,
			isHovering: this.isHovering,
			suggestion,
		}
	}

	setCallback(callback: HesitationCallback): void {
		this.callback = callback
	}

	private getCurrentMetrics(): BehaviorMetrics {
		const jitter = calculateCursorJitter(this.trackingState.positions)

		// Include current hover session time if actively hovering
		const currentHoverTime = this.trackingState.lastHoverStart
			? Date.now() - this.trackingState.lastHoverStart
			: 0

		return {
			hoverDuration: this.trackingState.totalHoverTime + currentHoverTime,
			refocusCount: Math.max(this.trackingState.hoverCount - 1, 0),
			cursorJitter: jitter,
			scrollCount: this.scrollCount,
			firstInteractionTime: this.trackingState.positions[0]?.timestamp || 0,
			lastInteractionTime:
				this.trackingState.positions[this.trackingState.positions.length - 1]
					?.timestamp || 0,
		}
	}

	private updateHesitationScore(): void {
		if (this.updateTimeout) {
			clearTimeout(this.updateTimeout)
		}

		this.updateTimeout = setTimeout(() => {
			if (this.callback) {
				this.callback(this.getState())
			}
		}, this.config.debounceMs)
	}

	private attachListeners(): void {
		if (!this.element) return

		const handleMouseEnter = () => {
			this.trackingState.lastHoverStart = Date.now()
			this.trackingState.hoverCount++
			this.isHovering = true

			if (this.callback) {
				this.callback(this.getState())
			}
		}

		const handleMouseLeave = () => {
			if (this.trackingState.lastHoverStart !== null) {
				const hoverDuration = Date.now() - this.trackingState.lastHoverStart
				this.trackingState.totalHoverTime += hoverDuration
				this.trackingState.lastHoverStart = null
			}

			this.isHovering = false
			this.updateHesitationScore()
		}

		const handleMouseMove = (e: MouseEvent) => {
			const now = Date.now()

			// Throttle to ~60fps (16ms) to reduce overhead
			if (now - this.lastMouseMoveTime < 16) {
				return
			}

			this.lastMouseMoveTime = now

			this.trackingState.positions.push({
				x: e.clientX,
				y: e.clientY,
				timestamp: now,
			})

			if (this.trackingState.positions.length > 20) {
				this.trackingState.positions.shift()
			}

			this.updateHesitationScore()
		}

		const handleScroll = () => {
			if (!this.isInViewport) return

			if (!this.isScrolling) {
				this.scrollCount++
				this.isScrolling = true
				this.updateHesitationScore()
			}

			if (this.scrollTimeout) {
				clearTimeout(this.scrollTimeout)
			}

			this.scrollTimeout = setTimeout(() => {
				this.isScrolling = false
			}, 150)
		}

		this.element.addEventListener('mouseenter', handleMouseEnter, { passive: true })
		this.element.addEventListener('mouseleave', handleMouseLeave, { passive: true })
		this.element.addEventListener('mousemove', handleMouseMove as EventListener, {
			passive: true,
		})

		this.cleanupFunctions.push(() => {
			this.element?.removeEventListener('mouseenter', handleMouseEnter)
			this.element?.removeEventListener('mouseleave', handleMouseLeave)
			this.element?.removeEventListener(
				'mousemove',
				handleMouseMove as EventListener
			)
		})

		if (this.config.trackScroll) {
			this.intersectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						this.isInViewport = entry.isIntersecting
					})
				},
				{
					rootMargin: '200px',
					threshold: [0, 0.25, 0.5, 0.75, 1],
				}
			)

			this.intersectionObserver.observe(this.element)

			window.addEventListener('scroll', handleScroll, { passive: true })
			this.cleanupFunctions.push(() => {
				window.removeEventListener('scroll', handleScroll)
			})
		}
	}
}
