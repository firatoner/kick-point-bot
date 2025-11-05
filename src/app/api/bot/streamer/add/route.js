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

    if (!bot.isRunning) {
      return NextResponse.json(
        { success: false, message: 'Bot must be running to add streamers' },
        { status: 400 }
      );
    }

    const success = await bot.addStreamer(streamer.trim());

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Successfully added ${streamer}`
      });
    } else {
      return NextResponse.json(
        { success: false, message: `Failed to add ${streamer}` },
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
