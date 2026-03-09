import { useEffect, useState } from 'react';
import { Logo } from './Logo';

export function LoadingScreen() {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-red-950 flex items-center justify-center relative overflow-hidden">
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-red-600/10 rounded-full blur-3xl top-1/4 left-1/4 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-gray-800/20 rounded-full blur-3xl bottom-1/4 right-1/4 animate-pulse delay-700"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo com animação flutuante */}
        <div className="mb-12 flex justify-center animate-float">
          <div className="relative">
            <Logo size={140} showText={false} />
            {/* Anel brilhante ao redor do logo */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Nome da empresa com efeito */}
        <div className="mb-10">
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-red-300 bg-clip-text text-transparent mb-3 tracking-tight">
            V7
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500"></div>
            <p className="text-gray-300 tracking-[0.4em] text-sm font-semibold">FINANCE</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500"></div>
          </div>
          <p className="text-gray-500 text-xs tracking-wider">Gestão Financeira Inteligente</p>
        </div>

        {/* Barra de carregamento moderna */}
        <div className="w-80 mx-auto mb-6">
          <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/30">
            <div 
              className="h-full bg-gradient-to-r from-gray-400 via-red-500 to-red-600 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Inicializando</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Texto de carregamento */}
        <p className="text-gray-400 text-sm font-medium">
          Carregando{dots}
        </p>

        {/* Indicador de status */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Conectando ao servidor</span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}
