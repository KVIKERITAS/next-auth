import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { useTransition } from 'react'

type TFormErrorProps = {
	message?: string
}

export const FormError = ({ message }: TFormErrorProps) => {
	if (!message) return null

	return (
		<div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive'>
			<ExclamationTriangleIcon className='h-4 w-4' />
			<p>{message}</p>
		</div>
	)
}
