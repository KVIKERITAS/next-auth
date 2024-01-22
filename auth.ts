import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { getUserById } from '@/data/user'
import { db } from '@/lib/db'

import authConfig from '@/auth.config'
import { getTwoFactorConfirmationByUserId } from '@/data/two_factor_confirmation'

type TUserRole = 'ADMIN' | 'USER'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: 'ADMIN' | 'USER'
			username: string
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
				session.user.username = token.username as string
			}

			return session
		},
		async jwt({ token }) {
			if (!token.sub) return token

			const existingUser = await getUserById(token.sub)
			if (!existingUser) return token

			token.username = existingUser.username
			token.role = existingUser.role

			return token
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
})
