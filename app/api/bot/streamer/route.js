const { getBotInstance } = require('../../../../lib/botInstance');
const { NextResponse } = require('next/server');

export async function POST(request) {
  try {
    const { action, streamerName } = await request.json();
    const bot = getBotInstance();

    if (action === 'add') {
      await bot.startMonitoring(streamerName);
      return NextResponse.json({
        success: true,
        message: `Started monitoring ${streamerName}`
      });
    } else if (action === 'remove') {
      bot.stopMonitoring(streamerName);
      return NextResponse.json({
        success: true,
        message: `Stopped monitoring ${streamerName}`
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid action'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
