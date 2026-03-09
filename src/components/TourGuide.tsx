import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Check, HelpCircle } from 'lucide-react';

export interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface TourGuideProps {
  tourId: string;
  steps: TourStep[];
  onComplete?: () => void;
  autoStart?: boolean;
}

export function TourGuide({ tourId, steps, onComplete, autoStart = false }: TourGuideProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`tour_completed_${tourId}`);
    if (autoStart && !hasSeenTour) {
      setTimeout(() => startTour(), 1000);
    }
  }, [tourId, autoStart]);

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      updatePositions();
      if (steps[currentStep].action) {
        steps[currentStep].action!();
      }
    }
  }, [currentStep, isActive]);

  // Recalcular posição do tooltip após renderização
  useEffect(() => {
    if (isActive && targetRect && tooltipRef.current) {
      // Forçar re-render após tooltip estar no DOM
      const timer = setTimeout(() => {
        // Trigger re-render forçando estado
        setTargetRect({ ...targetRect });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, tooltipRef.current]);

  useEffect(() => {
    if (isActive) {
      const handleUpdate = () => {
        requestAnimationFrame(updatePositions);
      };

      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate, true);
      
      return () => {
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate, true);
      };
    }
  }, [isActive, currentStep]);

  const updatePositions = () => {
    const step = steps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll suave se necessário
      const margin = 100;
      if (rect.top < margin || rect.bottom > window.innerHeight - margin) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      console.warn(`Elemento não encontrado: ${step.target}`);
    }
  };

  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return { 
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    // Se tooltip ainda não foi renderizado, usar posição padrão visível
    if (!tooltipRef.current) {
      return {
        top: `${Math.min(targetRect.bottom + 16, window.innerHeight - 400)}px`,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const position = steps[currentStep].position || 'bottom';
    const gap = 16;

    let top = 0;
    let left = 0;
    let transform = '';

    switch (position) {
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';
        
        if (top + tooltipRect.height > window.innerHeight - 16) {
          top = targetRect.top - tooltipRect.height - gap;
        }
        // Se ainda não cabe, forçar no topo da tela
        if (top < 16) {
          top = 16;
        }
        break;
      
      case 'top':
        top = targetRect.top - tooltipRect.height - gap;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';
        
        if (top < 16) {
          top = targetRect.bottom + gap;
        }
        // Se ainda não cabe, forçar no topo da tela
        if (top + tooltipRect.height > window.innerHeight - 16) {
          top = 16;
        }
        break;
      
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + gap;
        transform = 'translateY(-50%)';
        
        if (left + tooltipRect.width > window.innerWidth - 16) {
          left = targetRect.left - tooltipRect.width - gap;
        }
        // Se ainda não cabe, colocar no centro
        if (left < 16) {
          left = 16;
          top = 16;
          transform = 'none';
        }
        break;
      
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - tooltipRect.width - gap;
        transform = 'translateY(-50%)';
        
        if (left < 16) {
          left = targetRect.right + gap;
        }
        // Se ainda não cabe, colocar no centro
        if (left + tooltipRect.width > window.innerWidth - 16) {
          left = 16;
          top = 16;
          transform = 'none';
        }
        break;
    }

    // Ajuste lateral para centralizados
    if (transform.includes('translateX')) {
      const half = tooltipRect.width / 2;
      if (left - half < 16) left = 16 + half;
      if (left + half > window.innerWidth - 16) left = window.innerWidth - 16 - half;
    }

    // Garantir que está dentro da tela verticalmente
    if (transform.includes('translateY')) {
      const half = tooltipRect.height / 2;
      if (top - half < 16) top = 16 + half;
      if (top + half > window.innerHeight - 16) top = window.innerHeight - 16 - half;
    }

    return { top: `${top}px`, left: `${left}px`, transform };
  };

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTargetRect(null);
  };

  const completeTour = () => {
    localStorage.setItem(`tour_completed_${tourId}`, 'true');
    setIsActive(false);
    setCurrentStep(0);
    setTargetRect(null);
    if (onComplete) onComplete();
  };

  if (!isActive) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-full shadow-lg transition-all z-40 group"
        title="Iniciar tutorial guiado"
      >
        <HelpCircle size={24} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tutorial Guiado
        </span>
      </button>
    );
  }

  const step = steps[currentStep];

  return (
    <>
      {/* Borda destacada no elemento - SEM FUNDO */}
      {targetRect && (
        <div
          ref={highlightRef}
          className="fixed pointer-events-none z-[9999]"
          style={{
            top: `${targetRect.top - 8}px`,
            left: `${targetRect.left - 8}px`,
            width: `${targetRect.width + 16}px`,
            height: `${targetRect.height + 16}px`,
            border: '4px solid #dc2626',
            borderRadius: '12px',
            boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.9), 0 0 25px rgba(220, 38, 38, 0.5)',
            animation: 'tourPulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Tooltip flutuante */}
      <div
        ref={tooltipRef}
        className="fixed z-[10000] bg-white rounded-xl shadow-2xl max-w-md w-[calc(100%-2rem)] transition-opacity duration-300"
        style={getTooltipStyle()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="text-xs text-red-100 mb-1">
                Passo {currentStep + 1} de {steps.length}
              </div>
              <h3 className="font-bold text-lg">{step.title}</h3>
            </div>
            <button
              onClick={skipTour}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 leading-relaxed">{step.content}</p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between gap-3">
          {/* Progress dots */}
          <div className="flex gap-1.5 flex-shrink-0">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-red-600 w-6'
                    : idx < currentStep
                    ? 'bg-green-600 w-2'
                    : 'bg-gray-300 w-2'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 text-sm"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Anterior</span>
              </button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-colors flex items-center gap-1 font-semibold text-sm"
              >
                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">Próx.</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={completeTour}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-colors flex items-center gap-1 font-semibold text-sm"
              >
                Concluir
                <Check size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Skip button */}
        <div className="px-4 pb-3">
          <button
            onClick={skipTour}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors w-full text-center"
          >
            Pular tutorial
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tourPulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.9), 0 0 25px rgba(220, 38, 38, 0.5);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(255, 255, 255, 1), 0 0 35px rgba(220, 38, 38, 0.7);
          }
        }
      `}</style>
    </>
  );
}

export function useResetTour(tourId: string) {
  return () => {
    localStorage.removeItem(`tour_completed_${tourId}`);
  };
}