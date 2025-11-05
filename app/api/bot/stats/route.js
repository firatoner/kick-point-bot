const { getBotInstance } = require('../../../../lib/botInstance');
const { NextResponse } = require('next/server');

export async function GET(request) {
  try {
    const bot = getBotInstance();
    const stats = bot.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
