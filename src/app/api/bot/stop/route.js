import { NextResponse } from 'next/server';

const { getBotInstance } = require('@/lib/botInstance');

export async function POST() {
  try {
    const bot = getBotInstance();
    const success = bot.stop();

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Bot stopped successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Bot is not running' },
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
