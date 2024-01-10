import { CardWrapper } from '@/components/auth/CardWrapper'

export const LoginForm = () => {
	return (
		<CardWrapper
			headerLabel='Welcome back'
			backButtonLabel="Don't have an account?"
			backButtonHref='/auth/register'
			showSocial
		>
			Login From!
		</CardWrapper>
	)
}
