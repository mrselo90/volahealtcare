import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'src/data/settings.json');

export async function GET() {
  const data = fs.readFileSync(settingsPath, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request: Request) {
  const body = await request.json();
  fs.writeFileSync(settingsPath, JSON.stringify(body, null, 2));
  return NextResponse.json({ success: true });
}
