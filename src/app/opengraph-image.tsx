import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Vola Health Istanbul - Premium Medical Tourism'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Vola Health Istanbul
          </div>
          <div
            style={{
              fontSize: 32,
              opacity: 0.9,
              marginBottom: '30px',
              maxWidth: '800px',
            }}
          >
            Premium Medical Tourism Services
          </div>
          <div
            style={{
              fontSize: 24,
              opacity: 0.8,
              display: 'flex',
              gap: '40px',
            }}
          >
            <span>🦷 Dental</span>
            <span>💇 Hair Transplant</span>
            <span>✨ Aesthetic Surgery</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 