import { useEffect } from 'react';

export function IOSIconFix() {
  useEffect(() => {
    // Gera ícone PNG como data URI para iOS
    const generatePNGDataURI = (size: number): string => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.48;
      const scale = size / 100;

      // Fundo circular com gradiente
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#dc2626');
      gradient.addColorStop(1, '#7f1d1d');

      // Sombra
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = size * 0.04;
      ctx.shadowOffsetY = size * 0.03;

      // Círculo principal
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Remover sombra
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      // Anel decorativo
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.875, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = Math.max(1, size * 0.005);
      ctx.stroke();

      // V grande
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 8 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.95;

      ctx.beginPath();
      ctx.moveTo(28 * scale, 30 * scale);
      ctx.lineTo(50 * scale, 70 * scale);
      ctx.lineTo(72 * scale, 30 * scale);
      ctx.stroke();

      // 7 - linha superior
      ctx.lineWidth = 6 * scale;
      ctx.beginPath();
      ctx.moveTo(38 * scale, 35 * scale);
      ctx.lineTo(62 * scale, 35 * scale);
      ctx.stroke();

      // 7 - linha diagonal
      ctx.beginPath();
      ctx.moveTo(58 * scale, 35 * scale);
      ctx.lineTo(46 * scale, 55 * scale);
      ctx.stroke();

      // Seta de crescimento
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5 * scale;
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(50 * scale, 72 * scale);
      ctx.lineTo(50 * scale, 78 * scale);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(47 * scale, 75 * scale);
      ctx.lineTo(50 * scale, 78 * scale);
      ctx.lineTo(53 * scale, 75 * scale);
      ctx.stroke();

      // Detalhes geométricos
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = Math.max(1, size * 0.005);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.96, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.79, 0, Math.PI * 2);
      ctx.stroke();

      // Pontos de acento
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = 'white';

      const dotRadius = Math.max(1, size * 0.015);
      ctx.beginPath();
      ctx.arc(50 * scale, 12 * scale, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(88 * scale, 50 * scale, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(12 * scale, 50 * scale, dotRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;

      // Converter para PNG data URI
      return canvas.toDataURL('image/png');
    };

    // Adicionar link tag com data URI
    const addDataURIIcon = (rel: string, size: number, sizes?: string) => {
      const dataURI = generatePNGDataURI(size);
      
      const selector = sizes ? `link[rel="${rel}"][sizes="${sizes}"]` : `link[rel="${rel}"]`;
      let link = document.querySelector(selector) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (sizes) link.setAttribute('sizes', sizes);
        link.setAttribute('type', 'image/png');
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', dataURI);
    };

    // Gerar ícones PNG para iOS
    addDataURIIcon('apple-touch-icon', 180, '180x180');
    addDataURIIcon('apple-touch-icon', 167, '167x167');
    addDataURIIcon('apple-touch-icon', 152, '152x152');
    addDataURIIcon('apple-touch-icon', 120, '120x120');
    
    console.log('✅ Ícones PNG gerados para iOS');

  }, []);

  return null;
}
