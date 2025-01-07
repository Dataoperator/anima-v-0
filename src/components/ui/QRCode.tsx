import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
}

export const QRCodeCanvas: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  level = 'H',
  includeMargin = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: includeMargin ? 4 : 0,
      errorCorrectionLevel: level,
      color: {
        dark: '#000',
        light: '#fff',
      },
    }).catch(console.error);
  }, [value, size, level, includeMargin]);

  return <canvas ref={canvasRef} className={className} />;
};