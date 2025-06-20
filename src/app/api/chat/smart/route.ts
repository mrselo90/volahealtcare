import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Free, pattern-based smart chatbot for Vola Health Istanbul
// No API keys required, works offline

interface PatternResponse {
  keywords: string[];
  response: string;
  category: string;
  followUp?: string[];
}

// Pattern matching for intelligent responses
const patterns: PatternResponse[] = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'merhaba', 'selam', 'hola'],
    response: 'greeting',
    category: 'greeting'
  },
  
  // Dental Services
  {
    keywords: ['dental', 'teeth', 'tooth', 'veneer', 'veneers', 'implant', 'crown', 'smile', 'hollywood', 'whitening', 'diş', 'beyazlatma'],
    response: 'dental',
    category: 'dental'
  },
  
  // Hair Transplant
  {
    keywords: ['hair', 'transplant', 'fue', 'dhi', 'beard', 'eyebrow', 'baldness', 'hair loss', 'saç', 'ekimi', 'sakal', 'kaş'],
    response: 'hair',
    category: 'hair'
  }
];

function findBestMatch(message: string): { response: string; category: string } {
  const normalizedMessage = message.toLowerCase();
  
  // Find matching patterns
  const matches = patterns.filter(pattern => 
    pattern.keywords.some(keyword => normalizedMessage.includes(keyword.toLowerCase()))
  );
  
  if (matches.length > 0) {
    const bestMatch = matches[0];
    const responseKey = bestMatch.response;
    const responseArray = responses[responseKey as keyof typeof responses] || responses.en.default;
    
    return {
      response: Array.isArray(responseArray) ? responseArray[Math.floor(Math.random() * responseArray.length)] : responseArray,
      category: bestMatch.category
    };
  }
  
  // Default response
  const defaultResponses = responses.en.default;
  
  return {
    response: Array.isArray(defaultResponses) ? defaultResponses[Math.floor(Math.random() * defaultResponses.length)] : defaultResponses[0],
    category: 'general'
  };
}

const WHATSAPP_URL = 'https://wa.me/905444749881';
const APPOINTMENT_URL = '/consultation';

const redirectMessage = `For detailed information and prices, please contact us on WhatsApp or request a free consultation appointment.\n\n👉 <a href="${WHATSAPP_URL}" target="_blank" rel="noopener">Contact on WhatsApp</a>\n👉 <a href="${APPOINTMENT_URL}" target="_blank" rel="noopener">Request Appointment</a>`;

// Keywords for treatment and price
const treatmentKeywords = [
  'treatment', 'tedavi', 'saç', 'hair', 'dental', 'diş', 'implant', 'veneers', 'aesthetic', 'estetik', 'plastic', 'rhinoplasty', 'bbl', 'liposuction', 'transplant', 'fue', 'dhi', 'whitening', 'crown', 'smile', 'operation', 'surgery', 'breast', 'nose', 'burun', 'meme', 'karın', 'göz', 'kaş', 'brow', 'eyelid', 'face', 'yüz', 'body', 'vücut', 'hollywood', 'augmentation', 'reduction', 'lift', 'tuck', 'bichectomy', 'gynecomastia', 'aftercare', 'recovery', 'consultation', 'appointment', 'randevu'
];
const priceKeywords = [
  'price', 'cost', 'fiyat', 'ücret', 'maliyet', 'how much', 'ne kadar', 'fee', 'quote', 'offer', 'pricing', 'expensive', 'cheap', 'payment', 'finance', 'discount', 'kampanya', 'indirim'
];

function needsRedirect(message) {
  const lower = message.toLowerCase();
  return treatmentKeywords.some(k => lower.includes(k)) || priceKeywords.some(k => lower.includes(k));
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { message, sessionId } = data;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and session ID are required' },
        { status: 400 }
      );
    }

    // Always respond with the redirect message
    const response = redirectMessage;

    // Save AI response to database
    await prisma.chatMessage.create({
      data: {
        sessionId,
        content: response,
        type: 'smart_ai'
      },
    });

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
      aiType: 'redirect_only'
    });

  } catch (error) {
    console.error('Smart AI Chat error:', error);
    return NextResponse.json({
      response: 'Sorry, we are experiencing technical difficulties. Please contact us on WhatsApp.',
      timestamp: new Date().toISOString(),
      error: true,
      aiType: 'fallback'
    });
  }
} 