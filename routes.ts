/**
 * Array or routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/']

/**
 * Array or routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register']

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix will be used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = '/api/auth'

/**
 * Default redirect path for after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings'