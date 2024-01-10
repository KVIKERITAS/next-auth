'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

type TBackButtonProps = {
	href: string
	label: string
}

export const BackButton = ({ href, label }: TBackButtonProps) => {
	return (
		<Button variant='link' className='font-normal w-full' size='sm' asChild>
			<Link href={href}>{label}</Link>
		</Button>
	)
}
