import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeText } from '@/lib/sanitize';

// POST - Odeslat žádost o práci
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobPositionId,
      firstName,
      lastName,
      email,
      phone,
      coverLetter
    } = body;

    // Validace povinných polí
    if (!jobPositionId || !firstName || !lastName || !email || !coverLetter) {
      return NextResponse.json(
        { error: 'Všechna povinná pole musí být vyplněna' },
        { status: 400 }
      );
    }

    // Validace email formátu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatný email formát' },
        { status: 400 }
      );
    }

    // Ověření, že pozice existuje a je aktivní
    const position = await prisma.jobPosition.findUnique({
      where: { id: jobPositionId, isActive: true },
    });

    if (!position) {
      return NextResponse.json(
        { error: 'Pozice nenalezena nebo není aktivní' },
        { status: 404 }
      );
    }

    // Sanitizace vstupů
    const sanitizedData = {
      jobPositionId,
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizeText(email.toLowerCase()),
      phone: phone ? sanitizeText(phone) : null,
      coverLetter: sanitizeText(coverLetter),
      status: 'NEW' as const
    };

    const application = await prisma.jobApplication.create({
      data: sanitizedData,
      include: {
        jobPosition: true,
      },
    });

    // Odeslání notifikačního emailu (zde by byl kód pro odeslání emailu)
    // Zatím jen logování
    console.log(`Nová žádost o práci: ${application.firstName} ${application.lastName} - ${position.title}`);

    return NextResponse.json({ 
      message: 'Žádost byla úspěšně odeslána',
      application: {
        id: application.id,
        firstName: application.firstName,
        lastName: application.lastName,
        email: application.email,
        jobPosition: application.jobPosition?.title
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { error: 'Chyba při odesílání žádosti' },
      { status: 500 }
    );
  }
}