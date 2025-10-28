import Link from 'next/link'
import { BsEye, BsLightning, BsGear } from 'react-icons/bs'

import Feature from '@/components/Feature'
import { ROUTES } from '@/lib/routes'

export default function Home() {
	return (
		<main className='min-h-screen bg-white dark:bg-black antialiased'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 md:py-20'>
				<div className='mb-16 sm:mb-20 md:mb-24'>
					<h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 tracking-tight text-black dark:text-white leading-tight'>
						Turn user hesitation into
						<br className='hidden sm:block' />
						<span className='sm:hidden'> </span>business opportunity
					</h1>
					<p className='text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed mb-6 sm:mb-8'>
						Detect micro-behaviors and respond with empathy-driven UI that
						converts.
					</p>
					<Link
						href={ROUTES.DEMO.ROOT}
						className='inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-80 transition-opacity text-sm sm:text-base'
					>
						<span>See it in action</span>
						<span>→</span>
					</Link>
				</div>

				<div className='mb-16 sm:mb-20 md:mb-24'>
					<h2 className='text-xl sm:text-2xl font-bold text-black dark:text-white  mb-6 sm:mb-8 text-center'>
						Core Features
					</h2>
					<div className='grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4'>
						<Feature
							icon={<BsEye className='w-4 h-4' />}
							title='Behavioral Tracking'
							description='Track hover duration, cursor jitter, refocus count, and scroll patterns in real-time.'
						/>
						<Feature
							icon={<BsLightning className='w-4 h-4' />}
							title='Real-time Scoring'
							description='Compute hesitation score (0-1) using rule-based heuristics for instant insights.'
						/>
						<Feature
							icon={<BsGear className='w-4 h-4' />}
							title='Fully Customizable'
							description='Configure triggers and thresholds to match your specific use cases.'
						/>
					</div>
				</div>

				<div className='mb-12 sm:mb-16 md:mb-20'>
					<h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-black dark:text-white'>
						Get started in seconds
					</h2>
					<div className='bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-800'>
						<pre className='text-xs sm:text-sm text-gray-800 dark:text-gray-200 overflow-x-auto font-mono'>
							<code>{`import { useHesitation } from "hesitation-detector";

function ProductButton() {
  const { hesitationLevel } = useHesitation("#buy-button");

  if (hesitationLevel > 0.8) {
    return <Offer>You deserve a 5% discount!</Offer>;
  }

  return <button id="buy-button">Buy Now</button>;
}`}</code>
						</pre>
					</div>
				</div>
			</div>
		</main>
	)
}
