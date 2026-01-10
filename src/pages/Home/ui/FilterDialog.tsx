import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface FilterDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	children: React.ReactNode
	footer: React.ReactNode
}

export const FilterDialog = ({
	open,
	onOpenChange,
	title,
	children,
	footer
}: FilterDialogProps) => (
	<Dialog.Root
		open={open}
		onOpenChange={onOpenChange}
	>
		<Dialog.Portal>
			<Dialog.Overlay className="fixed inset-0 bg-[#BFBFBF]" />

			<Dialog.Content
				className="
        fixed left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[1120px] max-w-[calc(100vw-64px)]
        max-h-[90vh]
        bg-white rounded-xl shadow-xl
        flex flex-col

        sm:left-0 sm:top-0
        sm:translate-x-0 sm:translate-y-0
        sm:w-full sm:h-full
        sm:max-h-none
        sm:rounded-none
      "
			>
				<div className="relative px-10 sm:px-4 pt-8 pb-6 border-b">
					<Dialog.Title className="text-2xl sm:text-lg font-semibold text-center">
						{title}
					</Dialog.Title>

					<Dialog.Close asChild>
						<button className="absolute right-6 top-6 text-gray-500">
							<X size={20} />
						</button>
					</Dialog.Close>
				</div>

				<div className="flex-1 overflow-y-auto">{children}</div>

				{footer}
			</Dialog.Content>
		</Dialog.Portal>
	</Dialog.Root>
)
