import { useEffect, useRef } from 'react';

export function PWAIconAutoGenerator() {
  const hasGenerated = useRef(false);

  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    const generateAndCacheIcon = async (size: number, name: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = size;
      canvas.height = size;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.48;
      const scale = size / 100;

      // Fundo transparente
      ctx.clearRect(0, 0, size, size);

      // Círculo externo com gradiente
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
      const arrowGradient = ctx.createLinearGradient(0, 0, size, size);
      arrowGradient.addColorStop(0, '#dc2626');
      arrowGradient.addColorStop(1, '#991b1b');

      ctx.strokeStyle = arrowGradient;
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

      // Brilho sutil no topo
      const shineGradient = ctx.createRadialGradient(
        centerX,
        centerY * 0.6,
        0,
        centerX,
        centerY * 0.6,
        radius * 0.6
      );
      shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      shineGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
      shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalAlpha = 0.3;
      ctx.fillStyle = shineGradient;
      ctx.beginPath();
      ctx.ellipse(centerX, 30 * scale, 25 * scale, 15 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1;

      // Converter para blob
      return new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      });
    };

    // Gerar todos os ícones e cachear
    const generateIcons = async () => {
      try {
        const icons = [
          { size: 192, name: 'icon-192.png' },
          { size: 512, name: 'icon-512.png' },
          { size: 180, name: 'apple-touch-icon.png' },
          { size: 32, name: 'favicon.png' },
        ];

        // Abrir cache
        const cache = await caches.open('v7-finance-icons-v1');

        for (const { size, name } of icons) {
          const blob = await generateAndCacheIcon(size, name);
          if (blob) {
            const response = new Response(blob, {
              headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000',
              },
            });
            await cache.put(`/${name}`, response);
          }
        }

        console.log('✅ Ícones PWA gerados e cacheados automaticamente');
      } catch (error) {
        console.error('Erro ao gerar ícones PWA:', error);
      }
    };

    // Gerar após 1 segundo para não bloquear carregamento inicial
    setTimeout(generateIcons, 1000);
  }, []);

  return null;
}
