import { NextResponse } from "next/server";

const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY;

export async function GET() {
  if (!MAPTILER_API_KEY) {
    return NextResponse.json({ error: 'MapTiler API Key not found.' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: `MapTiler API error: ${response.status} ${response.statusText}`, details: errorData }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data);
  }
  catch {
    return NextResponse.json({ error: 'Failed to fetch MapTiler map style.' }, { status: 500 });
  }
}