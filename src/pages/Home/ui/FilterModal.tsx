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

	const handleCancel = () => {
		setTempFilters(filters)
		setShowConfirmDialog(false)
		setOpen(false)
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
					<Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
					<Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
						<div className="p-6">
							<div className="flex items-center justify-between mb-6">
								<Dialog.Title className="text-2xl font-semibold text-gray-900">
									{t('Filter Options')}
								</Dialog.Title>
								<Dialog.Close asChild>
									<button
										type="button"
										className="p-2 hover:bg-gray-100 rounded-full transition-colors"
									>
										<X size={24} />
									</button>
								</Dialog.Close>
							</div>

							<div className="space-y-8">
								{filterItems.map(filterItem => (
									<div
										key={filterItem.id}
										className="space-y-4"
									>
										<div>
											<h3 className="text-lg font-medium text-gray-900 mb-2">
												{filterItem.name}
											</h3>
											{filterItem.description && (
												<p className="text-sm text-gray-600 mb-4">
													{filterItem.description}
												</p>
											)}
										</div>
										<div className="space-y-3">
											{filterItem.options.map(option => (
												<label
													key={option.id}
													className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
												>
													<input
														type="checkbox"
														checked={isOptionSelected(filterItem.id, option.id)}
														onChange={() =>
															handleOptionToggle(filterItem.id, option.id)
														}
														className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
													/>
													<div className="flex-1">
														<p className="font-medium text-gray-900">
															{option.name}
														</p>
														{option.description && (
															<p className="text-sm text-gray-600 mt-1">
																{option.description}
															</p>
														)}
													</div>
												</label>
											))}
										</div>
									</div>
								))}
							</div>

							<div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
								<Dialog.Close asChild>
									<button
										type="button"
										onClick={handleCancel}
										className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
									>
										{t('Cancel')}
									</button>
								</Dialog.Close>
								<button
									type="button"
									onClick={handleApply}
									className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									{t('Apply')}
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
