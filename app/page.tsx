'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [text, setText] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const qrRef = useRef<HTMLDivElement>(null);
  // Set default values for QR code
  const size = 256;
  const bgColor = '#FFFFFF';
  const fgColor = '#000000';
  const includeMargin = true;
  const level = 'M';

  // No longer checking system preference - always using light theme as default

  useEffect(() => {
    // Apply theme to document whenever theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]); // Run whenever theme changes

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-neutral-50' : 'bg-neutral-900'} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        <header className="text-center relative">
          <h1 className={`text-3xl font-light tracking-tight ${theme === 'light' ? 'text-neutral-800' : 'text-neutral-100'}`}>AI QR Gen</h1>
          
          <button 
            onClick={toggleTheme} 
            className="absolute right-0 top-0 p-2 rounded-full transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </header>

        <div className={`${theme === 'light' ? 'bg-white border-neutral-200' : 'bg-neutral-800 border-neutral-700'} rounded-xl shadow-sm border overflow-hidden transition-all duration-200`}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="text" className={`block text-xs font-medium ${theme === 'light' ? 'text-neutral-500' : 'text-neutral-400'} mb-2`}>
                URL or Text
              </label>
              <input
                type="text"
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all duration-200 ${
                  theme === 'light' 
                    ? 'bg-white border-neutral-200 text-neutral-800' 
                    : 'bg-neutral-700 border-neutral-600 text-white'
                }`}
                placeholder="Enter URL or text"
                style={{
                  backgroundColor: theme === 'light' ? '#FFFFFF' : '#404040'
                }}
              />
            </div>
            
            <div ref={qrRef} className="flex justify-center py-4">
              <QRCodeSVG
                value={text || ''}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level as 'L' | 'M' | 'Q' | 'H'}
                includeMargin={includeMargin}
              />
            </div>
            
            <button
              onClick={handleDownload}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>
        </div>
        
        
      </div>
    </div>
  );
}