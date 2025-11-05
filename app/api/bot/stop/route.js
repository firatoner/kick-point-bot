const { getBotInstance } = require('../../../../lib/botInstance');
const { NextResponse } = require('next/server');

export async function POST(request) {
  try {
    const bot = getBotInstance();
    bot.stop();

    return NextResponse.json({
      success: true,
      message: 'Bot stopped successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
