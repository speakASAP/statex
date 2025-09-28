import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For development, return a default location
    // In production, you can integrate with a real geolocation service
    const defaultLocation = {
      country: 'CZ', // Czech Republic
      region: 'Prague',
      city: 'Prague',
      timezone: 'Europe/Prague',
      latitude: 50.0755,
      longitude: 14.4378
    };

    return NextResponse.json(defaultLocation);
  } catch (error) {
    console.error('Error getting geo-location:', error);
    return NextResponse.json(
      { error: 'Failed to get location' },
      { status: 500 }
    );
  }
}
