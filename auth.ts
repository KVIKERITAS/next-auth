import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'

import { getUserById } from '@/data/user'
import { db } from '@/lib/db'

import authConfig from '@/auth.config'

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
	callbacks: {
		async signIn({ user }) {
			const existingUser = await getUserById(user.id)

			if (!existingUser || existingUser.role === 'USER') {
				return false
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
