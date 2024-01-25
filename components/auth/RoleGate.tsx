'use client'

import { FormError } from '@/components/FormError'
import { useCurrentRole } from '@/hooks/useCurrentRole'
import { UserRole } from '@prisma/client'

type TRoleGateProps = {
	children: React.ReactNode
	allowedRole: UserRole
}

export const RoleGate = ({ children, allowedRole }: TRoleGateProps) => {
	const role = useCurrentRole()

	if (role !== allowedRole)
		return (
			<FormError message="You don't have permission to view this content" />
		)

	return <>{children}</>
}
