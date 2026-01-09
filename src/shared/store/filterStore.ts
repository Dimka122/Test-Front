import { create } from 'zustand'

import type { SearchRequestFilter } from '../api/types/SearchRequest/SearchRequestFilter'

interface FilterState {
	filters: SearchRequestFilter
	setFilters: (filters: SearchRequestFilter) => void
	updateFilterOption: (filterId: string, optionIds: string[]) => void
	resetFilters: () => void
}

export const useFilterStore = create<FilterState>(set => ({
	filters: [],
	setFilters: filters => set({ filters }),
	updateFilterOption: (filterId, optionIds) =>
		set(state => ({
			filters: state.filters.map(filter =>
				filter.id === filterId ? { ...filter, optionsIds: optionIds } : filter
			)
		})),
	resetFilters: () => set({ filters: [] })
}))
