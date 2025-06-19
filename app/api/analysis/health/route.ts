import { NextResponse } from "next/server";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;

export async function GET() {
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error;
    }

    const result = await response.json();
    return NextResponse.json({ ...result });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Service unavailable',
      },
      { status: 503 },
    )
  }
}