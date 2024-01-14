'use server'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db'
import { RegisterSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import * as z from 'zod'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values)

	if (!validatedFields.success) return { error: 'Invalid credentials' }

	const { email, password, username } = validatedFields.data
	const hash = await bcrypt.hash(password, 10)

	const existingUser = await getUserByEmail(email)

	if (existingUser) return { error: 'Email already in use!' }

	await db.user.create({ data: { username, email, password: hash } })

	return { success: 'User created!' }
}
