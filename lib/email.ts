// Mock email service for MVP
export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  // In MVP, just log to console
  console.log('📧 Email sent:', {
    to: template.to,
    subject: template.subject
  })
  
  // In production, integrate with SendGrid/Resend/etc
  return true
}

export function bookingConfirmationEmail(
  email: string,
  booking: {
    studentName: string
    instructorName: string
    date: string
    time: string
  }
): EmailTemplate {
  return {
    to: email,
    subject: 'Booking Confirmation - Driving School',
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Dear ${booking.studentName},</p>
      <p>Your driving lesson has been confirmed:</p>
      <ul>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time}</li>
        <li><strong>Instructor:</strong> ${booking.instructorName}</li>
        <li><strong>Duration:</strong> 2 hours</li>
        <li><strong>Price:</strong> 200 PLN</li>
      </ul>
      <p>Please arrive 5 minutes early.</p>
      <p>Best regards,<br>Driving School Team</p>
    `
  }
}

export function bookingCancellationEmail(
  email: string,
  booking: {
    studentName: string
    date: string
    time: string
  }
): EmailTemplate {
  return {
    to: email,
    subject: 'Booking Cancelled - Driving School',
    html: `
      <h2>Booking Cancelled</h2>
      <p>Dear ${booking.studentName},</p>
      <p>Your driving lesson on ${booking.date} at ${booking.time} has been cancelled.</p>
      <p>You can book a new lesson through your dashboard.</p>
      <p>Best regards,<br>Driving School Team</p>
    `
  }
}