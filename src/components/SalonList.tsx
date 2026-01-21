export default function SalonList() {
  const salons = [1, 2, 3, 4, 5, 6]; 

  return (
    <div className="pl-6 py-4 pb-28">
      <h3 className="text-lg font-bold text-copper-gold-dark mb-4 tracking-tight">Profissionais que você segue</h3>
      <div className="flex gap-4 overflow-x-auto pr-6 scrollbar-hide py-2">
        {salons.map((salon, index) => (
          <div key={salon} className="flex-shrink-0 flex flex-col items-center gap-1 group cursor-pointer">
            {/* Borda Cobre Rose */}
            <div className="w-16 h-16 rounded-full border-[2px] border-copper-gold p-[3px] group-hover:border-copper-pop transition-colors">
              {/* Imagem do Salão */}
              <div className="w-full h-full rounded-full bg-rose-accent-light bg-cover bg-center shadow-sm" 
                   style={{ backgroundImage: `url('https://i.pravatar.cc/150?img=${salon + 30}')`, filter: 'sepia(0.2)' }}>
              </div>
            </div>
            <span className="text-[10px] font-medium text-copper-gold-dark/70 mt-1 group-hover:text-copper-gold">Studio {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}