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
          background: 'linear-gradient(135deg, #050807 0%, #073d20 60%, #0f843a 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #33bf63, #0b6630)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050807',
              fontWeight: 900,
              fontSize: 44,
            }}
          >
            N
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: 3 }}>NORVEX</span>
            <span style={{ fontSize: 14, letterSpacing: 6, color: '#5dd485', marginTop: -4 }}>SPORTS</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 18, letterSpacing: 5, color: '#5dd485' }}>HYDERABAD · EST. 2026</span>
          <span style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, marginTop: 12 }}>
            Football development,
          </span>
          <span style={{ fontSize: 76, fontWeight: 900, lineHeight: 1.05, color: '#33bf63' }}>
            done professionally.
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: 20, color: '#9aa9a4' }}>norvexsports.com</span>
          <span style={{ fontSize: 18, color: '#5dd485', letterSpacing: 3 }}>FREE TRIAL AVAILABLE</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
