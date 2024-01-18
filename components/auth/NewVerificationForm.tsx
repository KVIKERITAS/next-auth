'use client'

import { newVerification } from '@/actions/new_verification'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { FormError } from '../FormError'
import { FormSuccess } from '../FormSuccess'
import { CardWrapper } from './CardWrapper'

export const NewVerificationForm = () => {
	const [error, setError] = useState<string | undefined>()
	const [success, setSuccess] = useState<string | undefined>()

	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const onSubmit = useCallback(() => {
		if (!token) return setError('Missing token')

		newVerification(token)
			.then(data => {
				setSuccess(data.success)
				setError(data.error)
			})
			.catch(() => {
				setError('Something went wrong!')
			})
	}, [token])

	useEffect(() => {
		onSubmit()
	}, [onSubmit])

	return (
		<CardWrapper
			headerLabel='Confirming your verification'
			backButtonLabel='Back to login'
			backButtonHref='/auth/login'
		>
			<div className='flex items-center w-full justify-center'>
				{!success && !error && <BeatLoader />}
				<FormSuccess message={success} />
				<FormError message={error} />
			</div>
		</CardWrapper>
	)
}
