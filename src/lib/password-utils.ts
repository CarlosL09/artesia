import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

/**
 * Generate a secure random password
 */
export function generatePassword(length = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'

  const allChars = lowercase + uppercase + numbers + symbols
  let password = ''

  // Ensure at least one character from each category
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Set password for user and mark as needing password change
 */
export async function setUserPassword(userId: string, password: string, needsChange = true) {
  const hashedPassword = await bcrypt.hash(password, 12)

  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      needsPasswordChange: needsChange,
      isEmailVerified: true
    }
  })
}

/**
 * Send password email to user
 * In production, you'd use a service like SendGrid, AWS SES, or Resend
 */
export async function sendPasswordEmail(email: string, password: string, packageName: string) {
  // For development, we'll just log the email content
  // In production, replace this with actual email sending

  const emailContent = {
    to: email,
    subject: "Welcome to Artesia - Your Account Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Artesia!</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Your Account is Ready! 🎉</h2>

          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for purchasing the <strong>${packageName}</strong>! Your payment has been processed successfully.
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Your Login Credentials:</h3>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 14px;">${password}</code></p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Important:</strong> Please change this password after your first login for security reasons.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/auth/signin"
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      padding: 12px 30px;
                      text-decoration: none;
                      border-radius: 6px;
                      display: inline-block;
                      font-weight: bold;">
              Sign In to Artesia
            </a>
          </div>

          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Questions? Reply to this email or contact us at support@artesia.com
            </p>
          </div>
        </div>
      </div>
    `
  }

  // In development, log the email
  console.log('📧 Password Email to be sent:')
  console.log('To:', emailContent.to)
  console.log('Subject:', emailContent.subject)
  console.log('Password:', password)
  console.log('HTML Content:', emailContent.html)

  // TODO: Replace with actual email service in production
  // Example with SendGrid:
  // await sendGridMail.send(emailContent)

  // Example with AWS SES:
  // await sesClient.send(new SendEmailCommand(emailContent))

  // Example with Resend:
  // await resend.emails.send(emailContent)

  return { success: true, message: 'Email would be sent in production' }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
