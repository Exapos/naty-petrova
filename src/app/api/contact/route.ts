import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    // Validate environment variables
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email environment variables:', {
        EMAIL_HOST: !!process.env.EMAIL_HOST,
        EMAIL_PORT: !!process.env.EMAIL_PORT,
        EMAIL_USER: !!process.env.EMAIL_USER,
        EMAIL_PASS: !!process.env.EMAIL_PASS,
      });
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const { 
      name, 
      email, 
      phone, 
      projectType, 
      budget, 
      timeline, 
      location, 
      message, 
      website 
    } = await req.json();

    // Honeypot check
    if (website) {
      return NextResponse.json({ error: 'Spam detected' }, { status: 400 });
    }

    if (!name || !email || !projectType || !budget || !timeline || !location || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const projectTypeLabels = {
      residential: 'Rodinný dům',
      apartment: 'Bytový dům',
      commercial: 'Komerční budova'
    };

    const budgetLabels = {
      'under-1m': 'Do 1 mil. Kč',
      '1-3m': '1 - 3 mil. Kč',
      '3-5m': '3 - 5 mil. Kč',
      '5-10m': '5 - 10 mil. Kč',
      'over-10m': 'Nad 10 mil. Kč'
    };

    const timelineLabels = {
      'asap': 'Co nejdříve',
      '1-3months': '1 - 3 měsíce',
      '3-6months': '3 - 6 měsíců',
      '6-12months': '6 - 12 měsíců',
      'flexible': 'Flexibilní'
    };

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@maxprojekty.cz', 
      subject: `Nová projektová poptávka od ${name}`,
      text: `Jméno: ${name}
Email: ${email}
Telefon: ${phone || 'neuvedeno'}

Typ projektu: ${projectTypeLabels[projectType]}
Rozpočet: ${budgetLabels[budget]}
Časový rámec: ${timelineLabels[timeline]}
Lokalita: ${location}

Zpráva:
${message}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
