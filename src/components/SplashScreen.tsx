"use client";

import { useEffect, useState } from 'react'; // Removemos 'Image' daqui

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => { onFinish(); }, 500);
    }, 1500); // Ajuste o tempo conforme a duração do seu vídeo

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-rose-nude-bg transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Container do Vídeo */}
      <div className="relative w-80 h-80"> 
        <video 
          autoPlay 
          loop 
          muted 
          playsInline // Importante para funcionar no iPhone
          className="w-full h-full object-contain mix-blend-multiply" // mix-blend ajuda a remover fundo branco se houver
        >
          <source src="/logo-animada.mp4" type="video/mp4" />
        </video>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-rose-200 border-t-copper-gold rounded-full animate-spin"></div>
        <p className="text-[10px] text-copper-gold font-medium tracking-widest uppercase">Carregando</p>
      </div>
    </div>
  );
}