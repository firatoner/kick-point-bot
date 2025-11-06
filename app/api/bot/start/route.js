const { getBotInstance } = require('../../../../lib/botInstance');
const { NextResponse } = require('next/server');

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const otpCode = body.otpCode || null;

    const bot = getBotInstance();
    const result = await bot.start(otpCode);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else if (result.otpRequired) {
      return NextResponse.json({
        success: false,
        otpRequired: true,
        message: result.message
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
