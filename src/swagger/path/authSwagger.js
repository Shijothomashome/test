/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication & Authorization APIs
 */

/**
 * @swagger
 * /auth/customer/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+971501234567"
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *               verification_ids:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *               addressList:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     emirate:
 *                       type: string
 *                     city:
 *                       type: string
 *                     area:
 *                       type: string
 *                     street:
 *                       type: string
 *                     building:
 *                       type: string
 *                     apartment:
 *                       type: string
 *                     landmark:
 *                       type: string
 *                     coordinates:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                         lng:
 *                           type: number
 *     responses:
 *       201:
 *         description: Registered successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /auth/customer/login:
 *   post:
 *     summary: Login using email/phone and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential, password]
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Email or phone number
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /auth/customer/otp-login:
 *   post:
 *     summary: Login using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verification_id, purpose]
 *             properties:
 *               verification_id:
 *                 type: string
 *                 example: "abcd1234"
 *               purpose:
 *                 type: string
 *                 enum: [login-email, login-phone]
 *                 example: login-email
 *     responses:
 *       200:
 *         description: OTP login successful
 */

/**
 * @swagger
 * /auth/customer/password-reset:
 *   post:
 *     summary: Reset password via OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verification_id, new_password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+971501234567"
 *               verification_id:
 *                 type: string
 *                 example: "abc123"
 *               new_password:
 *                 type: string
 *                 example: newSecurePass456
 *     responses:
 *       200:
 *         description: Password reset successfully
 */

/**
 * @swagger
 * /auth/otp/send:
 *   post:
 *     summary: Send OTP for various purposes
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [purpose]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+971501234567"
 *               purpose:
 *                 type: string
 *                 enum:
 *                   - verify-email
 *                   - verify-phone
 *                   - login-email
 *                   - login-phone
 *                   - reset-password
 *                 description: |
 *                   OTP purpose options:
 *                   - verify-email: Verifying email during signup
 *                   - verify-phone: Verifying phone during signup
 *                   - login-email: OTP-based login via email
 *                   - login-phone: OTP-based login via phone
 *                   - reset-password: Resetting password using OTP
 *                 example: verify-email
 *     responses:
 *       200:
 *         description: OTP sent
 */

/**
 * @swagger
 * /auth/otp/verify:
 *   post:
 *     summary: Verify received OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp, purpose]
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: "+971501234567"
 *               otp:
 *                 type: string
 *                 example: "654321"
 *               purpose:
 *                 type: string
 *                 enum:
 *                   - verify-email
 *                   - verify-phone
 *                   - login-email
 *                   - login-phone
 *                   - reset-password
 *                 example: verify-email
 *     responses:
 *       200:
 *         description: OTP verified
 */

/**
 * @swagger
 * /auth/regenerate-accessToken:
 *   get:
 *     summary: Regenerate access token from refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently logged-in user's details
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User details fetched successfully
 */


/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout the currently logged-in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Start Google OAuth login
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google login
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback handler
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Callback handled successfully
 */
