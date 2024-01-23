import crypto from 'crypto'

import { getPasswordResetTokenByEmail } from '@/data/password_reset_token'
import { getTwoFactorTokenByEmail } from '@/data/two_factor_token'
import { getVerificationTokenByEmail } from '@/data/verification_token'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export const generatePasswordResetToken = async (email: string) => {
	const token = uuidv4()
	const expires_at = new Date(new Date().getTime() + 3600 * 1000)

	const existingToken = await getPasswordResetTokenByEmail(email)

	if (existingToken) {
		await db.passwordResetToken.delete({
			where: { id: existingToken.id },
		})
	}

	const passwordResetToken = await db.passwordResetToken.create({
		data: {
			email,
			token,
			expires_at,
		},
	})

	return passwordResetToken
}

export const generateVerificationToken = async (email: string) => {
	const token = uuidv4()
	const expires_at = new Date(new Date().getTime() + 3600 * 1000)

	const existingToken = await getVerificationTokenByEmail(email)

	if (existingToken) {
		await db.verificationToken.delete({ where: { id: existingToken.id } })
	}

	const verificationToken = await db.verificationToken.create({
		data: {
			email,
			token,
			expires_at,
		},
	})

	return verificationToken
}

export const generateTwoFactorToken = async (email: string) => {
	const token = crypto.randomInt(100_000, 1_000_000).toString()
	const expires_at = new Date(new Date().getTime() + 5 * 60 * 1000)

	const existingToken = await getTwoFactorTokenByEmail(email)

	if (existingToken)
		await db.twoFactorToken.delete({ where: { id: existingToken.id } })

	const twoFactorToken = await db.twoFactorToken.create({
		data: {
			email,
			token,
			expires_at,
		},
	})

	return twoFactorToken
}
