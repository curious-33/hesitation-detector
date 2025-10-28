import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/routes'

export default function DemoPage() {
	// Server-side redirect to /demo/single
	redirect(ROUTES.DEMO.SINGLE)
}
