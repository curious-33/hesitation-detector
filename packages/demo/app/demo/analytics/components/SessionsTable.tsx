'use client'

import { useState } from 'react'
import { SessionData } from '../lib/mock-data'

interface SessionsTableProps {
	data: SessionData[]
}

export default function SessionsTable({ data }: SessionsTableProps) {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10
	const totalPages = Math.ceil(data.length / itemsPerPage)

	const paginatedData = data.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	)

	const getHesitationColor = (level: number) => {
		if (level < 0.3) return 'text-green-600 dark:text-green-400'
		if (level < 0.7) return 'text-yellow-600 dark:text-yellow-400'
		return 'text-red-600 dark:text-red-400'
	}

	return (
		<div className='bg-white dark:bg-gray-950 rounded-lg p-6 shadow-md border border-gray-100 dark:border-gray-800'>
			<h3 className='text-lg font-semibold mb-4 text-black dark:text-white'>
				Recent Sessions
			</h3>

			<div className='overflow-x-auto'>
				<table className='w-full text-sm'>
					<thead>
						<tr className='border-b border-gray-200 dark:border-gray-800'>
							<th className='text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium'>
								Timestamp
							</th>
							<th className='text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium'>
								Element
							</th>
							<th className='text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium'>
								Hesitation
							</th>
							<th className='text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium'>
								Hover (ms)
							</th>
							<th className='text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium'>
								Refocus
							</th>
							<th className='text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium'>
								Converted
							</th>
						</tr>
					</thead>
					<tbody>
						{paginatedData.map((session) => (
							<tr
								key={session.id}
								className='border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900'
							>
								<td className='py-3 px-4 text-gray-700 dark:text-gray-300'>
									{session.timestamp.toLocaleString('en-US', {
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit',
									})}
								</td>
								<td className='py-3 px-4 text-gray-700 dark:text-gray-300'>
									{session.elementName}
								</td>
								<td
									className={`py-3 px-4 font-semibold ${getHesitationColor(
										session.hesitationLevel
									)}`}
								>
									{(session.hesitationLevel * 100).toFixed(0)}%
								</td>
								<td className='py-3 px-4 text-gray-700 dark:text-gray-300'>
									{session.metrics.hoverDuration.toLocaleString()}
								</td>
								<td className='py-3 px-4 text-gray-700 dark:text-gray-300'>
									{session.metrics.refocusCount}
								</td>
								<td className='py-3 px-4'>
									{session.converted ? (
										<span className='text-green-600 dark:text-green-400'>
											✓
										</span>
									) : (
										<span className='text-gray-400'>✗</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-between mt-4'>
				<div className='text-sm text-gray-600 dark:text-gray-400'>
					Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
					{Math.min(currentPage * itemsPerPage, data.length)} of {data.length}{' '}
					sessions
				</div>
				<div className='flex gap-2'>
					<button
						onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						disabled={currentPage === 1}
						className='px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
					>
						Previous
					</button>
					<button
						onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
						disabled={currentPage === totalPages}
						className='px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
					>
						Next
					</button>
				</div>
			</div>
		</div>
	)
}
