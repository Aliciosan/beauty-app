import { Home, MapPin, Calendar, MessageSquare, User } from 'lucide-react';

type BottomNavProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  // Adicionei 'md:hidden' na className abaixo
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-rose-accent-light py-3 px-6 pb-6 flex justify-between items-center z-40 rounded-t-[30px] shadow-[0_-5px_20px_rgba(201,138,125,0.15)]">
      <NavItem icon={Home} label="Início" id="home" activeTab={activeTab} onClick={onTabChange} />
      <NavItem icon={MapPin} label="Explorar" id="explore" activeTab={activeTab} onClick={onTabChange} />
      <NavItem icon={Calendar} label="Agenda" id="calendar" activeTab={activeTab} onClick={onTabChange} />
      <NavItem icon={MessageSquare} label="Msgs" id="messages" activeTab={activeTab} onClick={onTabChange} badge />
      <NavItem icon={User} label="Perfil" id="profile" activeTab={activeTab} onClick={onTabChange} />
    </div>
  );
}

// O componente NavItem continua igual ao anterior...
function NavItem({ icon: Icon, label, id, activeTab, onClick, badge }: any) {
  const isActive = activeTab === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={`relative flex flex-col items-center justify-end h-full w-12 gap-1 transition-all duration-300 ${isActive ? 'text-copper-gold -translate-y-2' : 'text-gray-400 hover:text-copper-gold/70'}`}
    >
      <div className={`p-1.5 rounded-full ${isActive ? 'bg-rose-accent-light' : 'bg-transparent'}`}>
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      {badge && <span className="absolute top-0 right-1 w-3 h-3 bg-copper-pop rounded-full border-2 border-white"></span>}
      <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
    </button>
  );
}