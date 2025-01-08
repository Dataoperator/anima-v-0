import React, { useEffect, useRef } from 'react';
import QRCodeGenerator from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

// Reusable QR Code generator hook
const useQRCode = ({
  value,
  size = 200,
  darkColor = '#00ffff',
  lightColor = '#000000',
  margin = 2,
  errorCorrectionLevel = 'H'
}: QRCodeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    QRCodeGenerator.toCanvas(canvasRef.current, value, {
      width: size,
      margin,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel
    }).catch(err => {
      console.error('QR Code generation error:', err);
    });
  }, [value, size, darkColor, lightColor, margin, errorCorrectionLevel]);

  return canvasRef;
};

// Main QR Code component
export const QRCode: React.FC<QRCodeProps> = (props) => {
  const canvasRef = useQRCode(props);

  return (
    <canvas 
      ref={canvasRef} 
      className={`rounded-lg ${props.className || ''}`}
    />
  );
};

// Canvas-specific QR Code component
export const QRCodeCanvas: React.FC<QRCodeProps> = (props) => {
  const canvasRef = useQRCode(props);

  return (
    <canvas 
      ref={canvasRef}
      className={`rounded-lg ${props.className || ''}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
};

// URL-only QR Code component
export const QRCodeURL: React.FC<QRCodeProps> = (props) => {
  const [dataUrl, setDataUrl] = React.useState<string>('');

  useEffect(() => {
    QRCodeGenerator.toDataURL(props.value, {
      width: props.size,
      margin: props.margin || 2,
      color: {
        dark: props.darkColor || '#00ffff',
        light: props.lightColor || '#000000',
      },
      errorCorrectionLevel: props.errorCorrectionLevel || 'H'
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('QR Code URL generation error:', err));
  }, [props.value, props.size, props.darkColor, props.lightColor, props.margin, props.errorCorrectionLevel]);

  return dataUrl ? (
    <img 
      src={dataUrl} 
      alt={`QR Code: ${props.value}`}
      className={`rounded-lg ${props.className || ''}`}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  ) : null;
};

export default QRCode;