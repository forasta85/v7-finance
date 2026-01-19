interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 40, className = '', showText = true }: LogoProps) {
  const uniqueId = Math.random().toString(36).substring(7);
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente principal - mais rico */}
          <linearGradient id={`mainGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          
          {/* Gradiente secundário */}
          <linearGradient id={`secGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
          </linearGradient>
          
          {/* Gradiente de brilho */}
          <radialGradient id={`shine-${uniqueId}`} cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          
          {/* Sombra premium */}
          <filter id={`premiumShadow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="0" dy="3" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Brilho interno */}
          <filter id={`innerGlow-${uniqueId}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Círculo externo com gradiente */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill={`url(#mainGrad-${uniqueId})`}
          filter={`url(#premiumShadow-${uniqueId})`}
        />
        
        {/* Anel decorativo */}
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.2"
        />
        
        {/* Forma V7 integrada - conceito moderno */}
        <g filter={`url(#innerGlow-${uniqueId})`}>
          {/* V grande que forma a base */}
          <path
            d="M 28 30 L 50 70 L 72 30"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* 7 integrado - linha superior */}
          <path
            d="M 38 35 L 62 35"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* 7 integrado - linha diagonal */}
          <path
            d="M 58 35 L 46 55"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          
          {/* Seta de crescimento sutil */}
          <path
            d="M 50 72 L 50 78 M 47 75 L 50 78 L 53 75"
            stroke={`url(#secGrad-${uniqueId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </g>
        
        {/* Detalhes geométricos minimalistas */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeWidth="0.5" opacity="0.15" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
        
        {/* Pontos de acento */}
        <circle cx="50" cy="12" r="1.5" fill="white" opacity="0.5" />
        <circle cx="88" cy="50" r="1.5" fill="white" opacity="0.5" />
        <circle cx="12" cy="50" r="1.5" fill="white" opacity="0.5" />
        
        {/* Brilho sutil no topo */}
        <ellipse 
          cx="50" 
          cy="30" 
          rx="25" 
          ry="15" 
          fill={`url(#shine-${uniqueId})`}
          opacity="0.3"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-gray-900 via-red-700 to-red-900 bg-clip-text text-transparent">
            V7
          </span>
          <span className="text-[10px] text-gray-600 tracking-[0.35em] font-bold mt-0.5 opacity-80">FINANCE</span>
        </div>
      )}
    </div>
  );
}