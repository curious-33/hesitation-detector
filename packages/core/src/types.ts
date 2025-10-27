export interface HesitationConfig {
	/** CSS selector for the target element */
	selector: string

	/** Hover duration threshold in milliseconds (default: 3000) */
	hoverThreshold?: number

	/** Cursor movement speed threshold for jitter detection (default: 100) */
	jitterThreshold?: number

	/** Number of re-hovers to consider high hesitation (default: 2) */
	refocusThreshold?: number

	/** Enable scroll tracking around the element (default: true) */
	trackScroll?: boolean

	/** Debounce time for score updates in milliseconds (default: 100) */
	debounceMs?: number
}

export interface BehaviorMetrics {
	/** Total hover duration in milliseconds */
	hoverDuration: number

	/** Number of times cursor returned to element */
	refocusCount: number

	/** Cursor movement speed variance (higher = more jitter) */
	cursorJitter: number

	/** Number of scroll events near the element */
	scrollCount: number

	/** Timestamp of first interaction */
	firstInteractionTime: number

	/** Timestamp of last interaction */
	lastInteractionTime: number
}

export interface HesitationResult {
	/** Hesitation score from 0 (no hesitation) to 1 (high hesitation) */
	hesitationLevel: number

	/** Raw behavioral metrics */
	metrics: BehaviorMetrics

	/** Whether the user is currently hovering */
	isHovering: boolean

	/** Suggested action based on hesitation level */
	suggestion: 'offer' | 'help' | 'compare' | null
}

export interface MouseTrackingState {
	positions: Array<{ x: number; y: number; timestamp: number }>
	lastHoverStart: number | null
	totalHoverTime: number
	hoverCount: number
}
