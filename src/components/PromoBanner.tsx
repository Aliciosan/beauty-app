export default function PromoBanner() {
  return (
    <div className="px-6 py-2">
      <div className="relative w-full h-44 rounded-3xl overflow-hidden flex items-center shadow-lg shadow-copper-gold/10">
        {/* Fundo Gradiente Rose Gold */}
        <div className="absolute inset-0 bg-gradient-to-br from-copper-gold to-copper-pop opacity-90 z-0"></div>
        
        {/* Efeito de Textura Sutil (opcional) */}
        <div className="absolute inset-0 bg-[url('/texture.png')] opacity-10 mix-blend-overlay z-0"></div>

        <div className="relative z-10 p-6 w-2/3">
          <h2 className="text-xl font-bold leading-tight mb-3 text-white tracking-wide">
            Realce sua beleza com <br/> descontos exclusivos
          </h2>
          <button className="bg-white text-copper-gold-dark px-6 py-2.5 rounded-full text-sm font-bold mt-2 shadow-sm hover:bg-rose-nude-bg transition-colors">
            Pegar oferta!
          </button>
        </div>

        {/* Círculo de Desconto */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-rose-accent-light/30 backdrop-blur-md rounded-full w-24 h-24 flex flex-col justify-center items-center z-10 border border-white/20 shadow-inner">
          <span className="text-sm text-white font-medium">Até</span>
          <span className="text-3xl font-extrabold text-white drop-shadow-sm">50%</span>
        </div>
      </div>
    </div>
  );
}