import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { getUserById } from '@/data/user'
import { db } from '@/lib/db'

import authConfig from '@/auth.config'
import { getTwoFactorConfirmationByUserId } from '@/data/two_factor_confirmation'
import { getAccountByUserId } from './data/account'

type TUserRole = 'ADMIN' | 'USER'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: 'ADMIN' | 'USER'
			username: string
			image: string
			name: string
			email: string
			isTwoFactorEnabled: boolean
			isOAuth: boolean
		}
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			})
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// Allow only role "ADMIN" to login
			// const existingUser = await getUserById(user.id)

			// if (!existingUser || existingUser.role === 'USER') {
			// 	return false
			// }

			// Allow OAuth without email verification
			if (account?.provider !== 'credentials') return true

			const existingUser = await getUserById(user.id)

			// Allow only email verified users to login
			if (!existingUser?.emailVerified) return false

			// Enable 2FA authentication
			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id,
				)

				if (!twoFactorConfirmation) return false

				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				})
			}

			return true
		},

		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub
			}

			if (token.role && session.user) {
				session.user.role = token.role as TUserRole
			}

			if (session.user) {
				session.user.username = token.username as string
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
				session.user.name = token.name as string
				session.user.email = token.email as string
				session.user.isOAuth = token.isOAuth as boolean
			}

			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserById(token.sub)
			if (!existingUser) return token

			const existingAccount = await getAccountByUserId(existingUser.id)

			token.isOAuth = !!existingAccount
			token.username = existingUser.username
			token.role = existingUser.role
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
			token.name = existingUser.name
			token.email = existingUser.email

			return token
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
})
