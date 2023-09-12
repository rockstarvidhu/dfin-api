import { RoleType } from './user'

export type SessionTokenPayload = {
	email: string
	sessionId: string
	role: RoleType
}

export type AuthToken = {
	accessToken: string
	refreshToken: string
}

