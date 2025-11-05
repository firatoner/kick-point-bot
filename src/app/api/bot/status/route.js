import { NextResponse } from 'next/server';

const { getBotInstance } = require('@/lib/botInstance');

export async function GET() {
  try {
    const bot = getBotInstance();
    const status = bot.getStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
