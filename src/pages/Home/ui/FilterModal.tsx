import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as Dialog from '@radix-ui/react-dialog'
import { Filter, X } from 'lucide-react'

import type { FilterItem } from '../../../shared/api/types/Filter/FilterItem'
import { FilterType } from '../../../shared/api/types/Filter/FilterType'
import type { SearchRequestFilter } from '../../../shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '../../../shared/store/filterStore'

interface FilterModalProps {
	filterItems: FilterItem[]
}

export const FilterModal = ({ filterItems }: FilterModalProps) => {
	const { t } = useTranslation()
	const { filters, setFilters } = useFilterStore()
	const [open, setOpen] = useState(false)
	const [tempFilters, setTempFilters] = useState<SearchRequestFilter>(filters)
	const [showConfirmDialog, setShowConfirmDialog] = useState(false)

	const handleOpenChange = (isOpen: boolean) => {
		if (isOpen) {
			setTempFilters(filters)
		}
		setOpen(isOpen)
	}

	const handleOptionToggle = (filterId: string, optionId: string) => {
		setTempFilters(prevFilters => {
			const existingFilter = prevFilters.find(filter => filter.id === filterId)

			if (existingFilter) {
				const newOptionsIds = existingFilter.optionsIds.includes(optionId)
					? existingFilter.optionsIds.filter(id => id !== optionId)
					: [...existingFilter.optionsIds, optionId]

				if (newOptionsIds.length === 0) {
					return prevFilters.filter(filter => filter.id !== filterId)
				}

				return prevFilters.map(filter =>
					filter.id === filterId
						? { ...filter, optionsIds: newOptionsIds }
						: filter
				)
			}
			return [
				...prevFilters,
				{
					id: filterId,
					type: FilterType.OPTION,
					optionsIds: [optionId]
				}
			]
		})
	}

	const handleApply = () => {
		setShowConfirmDialog(true)
	}

	const handleConfirmApply = () => {
		setFilters(tempFilters)
		setShowConfirmDialog(false)
		setOpen(false)
	}

	const handleClearAll = () => {
		setTempFilters([])
	}

	const handleResetAll = () => {
		setTempFilters([])
	}

	const isOptionSelected = (filterId: string, optionId: string) => {
		const filter = tempFilters.find(filter => filter.id === filterId)
		return filter?.optionsIds.includes(optionId) ?? false
	}

	return (
		<>
			<Dialog.Root
				open={open}
				onOpenChange={handleOpenChange}
			>
				<Dialog.Trigger asChild>
					<button
						type="button"
						className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						<Filter size={20} />
						{/* eslint-disable-next-line i18next/no-literal-string */}
						<span>Open Filter</span>
					</button>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 bg-[#BFBFBF] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
					<Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1120px] max-w-[calc(100vw-32px)] max-h-[100vh-32зч] bg-white rounded-xl shadow-xl flex flex-col ">
						<div className="shrink-0 px-10 pt-8 pb-6 border-b">
							<Dialog.Title className="text-2xl font-semibold text-center">
								{t('Filter Options')}
							</Dialog.Title>
							<Dialog.Close asChild>
								<button
									type="button"
									className="absolute right-6 top-6 text-gray-500 hover:text-gray-900"
								>
									<X size={20} />
								</button>
							</Dialog.Close>
						</div>
						<div className="flex-1 overflow-y-auto px-10 py-8">
							{filterItems.map(section => (
								<div key={section.id}>
									<h3 className="text-sm font-medium text-gray-900 mb-4">
										{section.name}
									</h3>
									<div className="grid grid-cols-3 gap-y-3">
										{section.options.map(option => (
											<label
												key={option.id}
												className="flex items-center gap-2 text-sm text-gray-700"
											>
												<input
													type="checkbox"
													className="w-4 h-4 rounded border-gray-300"
													checked={isOptionSelected(section.id, option.id)}
													onChange={() =>
														handleOptionToggle(section.id, option.id)
													}
												/>
												{option.name}
											</label>
										))}
									</div>
								</div>
							))}
						</div>
						<div className="shrink-0 px-10 py-6 border-t">
							{/* Mobile */}
							<div className="flex sm:flex flex-col gap-4 md:hidden">
								<button
									onClick={handleApply}
									className="w-full py-3 bg-orange-500 text-white rounded-full"
								>
									{t('Primary')}
								</button>
								<button
									onClick={handleResetAll}
									className="text-sm text-blue-600"
								>
									{t('Reset all parameters')}
								</button>

								<button
									onClick={handleClearAll}
									className="text-sm text-blue-600"
								>
									{t('Clear all parameters')}
								</button>
							</div>
							{/* Desktop */}
							<div className="hidden md:flex items-center justify-between">
								<button
									onClick={handleResetAll}
									className="text-sm text-blue-600 hover:underline"
								>
									{t('Reset all parameters')}
								</button>
								<button
									onClick={handleApply}
									className="px-10 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600"
								>
									{t('Primary')}
								</button>
								<button
									onClick={handleClearAll}
									className="text-sm text-blue-600 hover:underline"
								>
									{t('Clear all parameters')}
								</button>
							</div>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

			<AlertDialog.Root
				open={showConfirmDialog}
				onOpenChange={setShowConfirmDialog}
			>
				<AlertDialog.Portal>
					<AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
					<AlertDialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-white rounded-lg shadow-lg p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
						<AlertDialog.Title className="text-xl font-semibold text-gray-900 mb-2">
							{t('Confirm Changes')}
						</AlertDialog.Title>
						<AlertDialog.Description className="text-gray-600 mb-6">
							{t('Are you sure you want to apply these filter changes?')}
						</AlertDialog.Description>
						<div className="flex gap-4">
							<AlertDialog.Cancel asChild>
								<button
									type="button"
									className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									{t('Cancel')}
								</button>
							</AlertDialog.Cancel>
							<AlertDialog.Action asChild>
								<button
									type="button"
									onClick={handleConfirmApply}
									className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									{t('Confirm')}
								</button>
							</AlertDialog.Action>
						</div>
					</AlertDialog.Content>
				</AlertDialog.Portal>
			</AlertDialog.Root>
		</>
	)
}
