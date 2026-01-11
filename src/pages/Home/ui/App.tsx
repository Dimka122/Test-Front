import { useTranslation } from 'react-i18next'

import { useFilterData } from '../../../shared/api/hooks/useFilterData'
import { useFilterStore } from '../../../shared/store/filterStore'
import { FilterModal } from './FilterModal'

export const App = () => {
	const { t } = useTranslation()
	const filters = useFilterStore(state => state.filters)
	const { data: filterItems, isLoading, error } = useFilterData()

	if (isLoading) {
		return (
			<section className="w-full h-dvh flex items-center justify-center">
				<p className="text-xl text-gray-600">{t('loading')}</p>
			</section>
		)
	}

	if (error) {
		return (
			<section className="w-full h-dvh flex items-center justify-center">
				<p className="text-xl text-red-600">{t('error loading filters')}</p>
			</section>
		)
	}

	return (
		<section className="w-full min-h-dvh flex flex-col items-center justify-center bg-gray-50 p-8">
			<h1 className="text-4xl font-semibold text-gray-800 mb-8">
				{t('WinWinTravel')}
			</h1>

			<div className="w-full max-w-4xl space-y-8">
				<div className="flex justify-center">
					{filterItems && <FilterModal filterItems={filterItems} />}
				</div>

				{t(' Display Selected Filters ')}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						{t('Selected Filters (JSON)')}
					</h2>
					<pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
						{JSON.stringify(filters, null, 2)}
					</pre>
				</div>

				{t('Debug Information ')}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
					<h3 className="text-lg font-medium text-blue-900 mb-2">
						{t('Debug Information')}
					</h3>
					<p className="text-blue-800 text-sm">
						{t('Number of selected filters:')} {filters.length}
					</p>
					{filters.length > 0 && (
						<p className="text-blue-800 text-sm mt-1">
							{t('Total selected options:')}{' '}
							{filters.reduce(
								(acc, filter) => acc + filter.optionsIds.length,
								0
							)}
						</p>
					)}
				</div>
			</div>
		</section>
	)
}
