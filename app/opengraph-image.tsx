import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Norvex Sports — Football development in Hyderabad';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '64px',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0303 60%, #cc0000 130%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#cc0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: 44,
            }}
          >
            N
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 36, fontWeight: 900, letterSpacing: 6, color: '#ffffff' }}>NORVEX</span>
            <span style={{ fontSize: 14, letterSpacing: 8, color: '#c0c0c0', marginTop: -4 }}>SPORTS</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, letterSpacing: 5, color: '#cc0000', fontWeight: 700 }}>HYDERABAD · EST. 2026</span>
          <span style={{ fontSize: 84, fontWeight: 900, lineHeight: 1, marginTop: 18, color: '#ffffff' }}>
            BUILD YOUR GAME.
          </span>
          <span style={{ fontSize: 84, fontWeight: 900, lineHeight: 1, color: '#c0c0c0' }}>
            BUILD YOUR FUTURE.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 20, color: '#c0c0c0' }}>norvexsports.in</span>
          <span style={{ fontSize: 18, color: '#cc0000', letterSpacing: 3, fontWeight: 700 }}>FREE TRIAL AVAILABLE</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
