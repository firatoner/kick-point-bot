import { NextResponse } from 'next/server';

const { getBotInstance } = require('@/lib/botInstance');

export async function POST(request) {
  try {
    const { streamer } = await request.json();

    if (!streamer || !streamer.trim()) {
      return NextResponse.json(
        { success: false, message: 'Streamer name is required' },
        { status: 400 }
      );
    }

    const bot = getBotInstance();
    const success = bot.removeStreamer(streamer.trim());

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Successfully removed ${streamer}`
      });
    } else {
      return NextResponse.json(
        { success: false, message: `Failed to remove ${streamer}` },
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
