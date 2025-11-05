import { NextResponse } from 'next/server';

const { getBotInstance } = require('@/lib/botInstance');

export async function POST() {
  try {
    const bot = getBotInstance();
    const success = await bot.start();

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Bot started successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Failed to start bot' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
