import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const users = db.getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Er is iets fout gegaan tijdens het ophalen van de gebruikers, probeer het later opnieuw' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    const requiredFields = ['firstName', 'lastName', 'username', 'email', 'password', 'role'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} ontbreekt`}, { status: 400 });
      }
    }

    if (userData.active === undefined) {
      userData.active = true;
    }

    const newUser = db.createUser(userData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Er is iets fout gegaan tijdens het aanmaken van de gebruiker, controleer de gegevens of probeer het later opnieuw'}, { status: 500 });
  }
}