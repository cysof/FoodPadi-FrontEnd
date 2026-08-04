import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Configure email transporter
    // Note: You'll need to set up these environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'farmride@farmride.com.ng',
        pass: process.env.SMTP_PASS, // Use app password for Gmail
      },
    });

    // Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'farmride@farmride.com.ng',
      subject: `Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">Subject:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br/>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from your website contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission
        -------------------------
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send auto-reply to user
    const autoReplyOptions = {
      from: `"FarmRide" <farmride@farmride.com.ng>`,
      to: email,
      subject: 'Thank you for contacting FarmRide',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Contacting Us!</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to FarmRide. We have received your message and will get back to you within 24-48 hours.</p>
              <p>Here's a copy of your message:</p>
              <hr/>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br/>')}</p>
              <hr/>
              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Browse our <a href="https://farmride.com.ng/marketplace">Marketplace</a></li>
                <li>Call us at 09074366942, 09169029904, or 07080109521</li>
                <li>Visit our office at House 17 Road 251 FHA Guzape, Abuja</li>
              </ul>
              <p>Best regards,<br/>The FarmRide Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FarmRide. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Thank You for Contacting FarmRide!
        
        Dear ${name},
        
        Thank you for reaching out to FarmRide. We have received your message and will get back to you within 24-48 hours.
        
        Here's a copy of your message:
        Subject: ${subject}
        Message: ${message}
        
        In the meantime, feel free to:
        - Browse our Marketplace: https://farmride.com.ng/marketplace
        - Call us at 09074366942, 09169029904, or 07080109521
        - Visit our office at House 17 Road 251 FHA Guzape, Abuja
        
        Best regards,
        The FarmRide Team
      `,
    };

    await transporter.sendMail(autoReplyOptions);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
