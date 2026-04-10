'use client';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error logging in with Google:', error.message);
      alert('ログイン時にエラーが発生しました。');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>AssetFreelance</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>強力な案件管理・PDCAツールにログイン</p>
      </div>

      <button 
        onClick={handleGoogleLogin} 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '12px', 
          background: '#FFFFFF', 
          border: '1px solid var(--surface-border)', 
          padding: '12px', 
          width: '100%', 
          borderRadius: '6px', 
          cursor: 'pointer',
          fontWeight: 600,
          color: 'var(--text-primary)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'background 0.2s'
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 52.749 L -8.284 52.749 C -8.574 53.879 -9.214 54.819 -10.144 55.439 L -10.144 57.709 L -6.244 57.709 C -3.964 55.609 -2.664 52.479 -2.664 49.239 C -2.664 50.009 -2.664 51.509 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 58.059 C -11.764 58.779 -13.134 59.199 -14.754 59.199 C -17.884 59.199 -20.534 57.089 -21.484 54.259 L -25.464 54.259 L -25.464 57.349 C -23.494 61.279 -19.464 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.259 C -21.734 52.509 -21.864 51.709 -21.864 50.889 C -21.864 50.069 -21.734 49.269 -21.484 48.519 L -21.484 45.429 L -25.464 45.429 C -26.284 47.069 -26.754 48.919 -26.754 50.889 C -26.754 52.859 -26.284 54.709 -25.464 56.349 L -21.484 53.259 Z"/>
            <path fill="#EA4335" d="M -14.754 43.519 C -12.984 43.519 -11.394 44.129 -10.144 45.319 L -6.164 41.339 C -8.844 38.849 -11.514 37.899 -14.754 37.899 C -19.464 37.899 -23.494 39.859 -25.464 43.789 L -21.484 46.879 C -20.534 44.049 -17.884 41.919 -14.754 41.919 L -14.754 43.519 Z"/>
          </g>
        </svg>
        <span>Googleで無料登録 / ログイン</span>
      </button>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-disabled)', textAlign: 'center', lineHeight: 1.5 }}>
        ログインすることで、利用規約およびプライバシーポリシーに同意したものとみなされます。
      </div>
    </div>
  );
}
