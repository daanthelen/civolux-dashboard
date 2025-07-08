import { type NextRequest, NextResponse } from "next/server";

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${PYTHON_SERVICE_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: body.address,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();
    return NextResponse.json(result);
  }
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}