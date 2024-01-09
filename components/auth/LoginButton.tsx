'use client'

import { useRouter } from 'next/navigation'

type TLoginButtonProps = {
	children: React.ReactNode
	mode?: 'modal' | 'redirect'
	asChild?: boolean
}

export const LoginButton = ({
	children,
	mode = 'redirect',
	asChild,
}: TLoginButtonProps) => {
	const router = useRouter()

	const onClick = () => {
		router.push('/auth/login')
	}

	if (mode === 'modal') {
		return <span>Make a modal</span>
	}

	return (
		<span onClick={onClick} className='cursor-pointer'>
			{children}
		</span>
	)
}
