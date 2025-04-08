import nodemailer from "nodemailer";

// Function to send an email
export const sendEmail = async (to: string, subject: string, code: string) => {
  // Create the transport configuration
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const plainText = `Hello,

Here is your verification code:

${code}

If you did not request this code, feel free to ignore this email.

Best regards,  
Bio Pharma Stock Support Team`;

  const htmlText = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <p>Hello,</p>
      <p>Here is your verification code:</p>
      <p style="font-size: 20px; font-weight: bold; color: #2c3e50; margin: 10px 0;">${code}</p>
      <p>If you did not request this code, feel free to ignore this email.</p>
      <br />
      <p style="color: #888;">Best regards,<br/>Bio Pharma Stock Support Team</p>
    </div>
  `;

  try {
    await transport.sendMail({
      from: process.env.EMAIL_USER_SENDER,
      to,
      subject,
      text: plainText,
      html: htmlText,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error("Failed to send email");
  }
};
