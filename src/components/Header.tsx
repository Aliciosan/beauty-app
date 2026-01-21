import { Search, Home, Calendar, User, MapPin, LogOut } from 'lucide-react';
import Image from 'next/image';

type HeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userName: string; // NOVA PROPRIEDADE
};

export default function Header({ activeTab, onTabChange, onLogout, userName }: HeaderProps) {
  
  // Lógica para pegar apenas o primeiro nome (Ex: "Maria Silva" -> "Maria")
  const firstName = userName ? userName.split(' ')[0] : 'Visitante';
  
  // Lógica para pegar a inicial (Ex: "Maria" -> "M")
  const initial = userName ? userName.charAt(0).toUpperCase() : 'V';

  const NavLink = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => onTabChange(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        activeTab === id 
          ? 'bg-copper-gold text-white shadow-md' 
          : 'text-copper-gold-dark hover:bg-rose-accent-light'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <header className="sticky top-0 z-30 bg-rose-nude-bg/90 backdrop-blur-md shadow-sm border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo e Saudação Dinâmica */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="relative w-32 h-14 md:w-44 md:h-20">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-contain object-left" // Alinhado à esquerda
            >
              <source src="/logo-animada.mp4" type="video/mp4" />
            </video>
          </div>
          
          <div className="hidden sm:block border-l border-copper-gold/30 pl-6">
            <h1 className="text-lg font-bold text-copper-gold-dark leading-tight">
              Olá, {firstName}
            </h1>
          </div>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-2 bg-white/50 p-1.5 rounded-full border border-white">
            <NavLink id="home" label="Início" icon={Home} />
            <NavLink id="explore" label="Explorar" icon={MapPin} />
            <NavLink id="calendar" label="Agenda" icon={Calendar} />
            <NavLink id="profile" label="Perfil" icon={User} />
        </nav>
        
        {/* Botões da Direita */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white rounded-full text-copper-gold shadow-sm hover:bg-copper-gold hover:text-white transition-all duration-300">
            <Search size={20} strokeWidth={2.5} />
          </button>
          
          {/* Avatar Dinâmico */}
          <div className="hidden md:flex items-center gap-3 pl-3 border-l border-rose-200">
             <div className="w-10 h-10 rounded-full bg-copper-gold text-white flex items-center justify-center font-bold shadow-sm select-none">
               {initial}
             </div>
             <button 
               onClick={onLogout} 
               title="Sair"
               className="p-2 text-rose-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
             >
               <LogOut size={20} />
             </button>
          </div>

          {/* Botão Sair Mobile */}
          <button onClick={onLogout} className="md:hidden p-2 text-rose-400 hover:text-red-500">
               <LogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}