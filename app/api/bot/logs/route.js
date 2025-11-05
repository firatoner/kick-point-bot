const { getBotInstance } = require('../../../../lib/botInstance');
const { NextResponse } = require('next/server');

export async function GET(request) {
  try {
    const bot = getBotInstance();
    const logs = bot.getLogs();

    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
