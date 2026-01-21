"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Pencil, Trash2, Clock, Calendar, AlertCircle, Send, Bell, BellOff, MessageSquare, Home as HomeIcon, Search, LogOut } from 'lucide-react';

import Header from '@/components/Header';
import PromoBanner from '@/components/PromoBanner';
import SplashScreen from '@/components/SplashScreen';
import LoginScreen from '@/components/LoginScreen';
import ManagerDashboard from '@/components/ManagerDashboard';
import ProfileScreen from '@/components/ProfileScreen';
import ExploreScreen from '@/components/ExploreScreen';
import BookingModal from '@/components/BookingModal';
import EditAppointmentModal from '@/components/EditAppointmentModal';
import { CATEGORIES } from '@/data/mockData';

// Cores do Cliente
const cColors = {
  primary: '#C68D7D', 
  bg: '#FFF8F6',      
  activeNavBg: '#FFF0F0',
  textDark: '#8A5A4E', 
  textGray: '#9CA3AF',  
  cardBorder: '#F5E6E3' 
};

type UserData = { name: string; email: string; phone?: string; avatar?: string; };
type Message = { id: number; text: string; sender: 'client' | 'manager'; timestamp: string; };

export default function Home() {
  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const [userRole, setUserRole] = useState<'guest' | 'client' | 'manager'>('guest');
  const [currentUser, setCurrentUser] = useState<UserData>({ name: '', email: '' });
  const [activeTab, setActiveTab] = useState('home');

  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  const [editingAppt, setEditingAppt] = useState<any>(null);

  const [companyData, setCompanyData] = useState({ address: { street: '', number: '', city: 'Brasil', zip: '' }, gallery: [] as string[], professionals: [] as any[], hours: undefined });

  // --- CHAT STATE ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Olá! Gostaria de saber se vocês têm horário para amanhã.", sender: 'client', timestamp: '10:00' },
    { id: 2, text: "Olá! Temos sim, a partir das 14h.", sender: 'manager', timestamp: '10:05' }
  ]);
  const [managerUnread, setManagerUnread] = useState(0);
  const [clientNotifications, setClientNotifications] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (activeTab === 'messages' && userRole === 'client') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, activeTab]);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = { id: Date.now(), text, sender: userRole === 'manager' ? 'manager' : 'client', timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
    if (userRole === 'client') setManagerUnread(prev => prev + 1); 
  };

  const handleLogin = (role: 'client' | 'manager', data?: UserData) => { setUserRole(role); if (data) setCurrentUser(data); else if (role === 'client') setCurrentUser({ name: 'Visitante', email: '' }); setActiveTab('home'); };
  const handleLogout = () => { setUserRole('guest'); setCurrentUser({ name: '', email: '' }); setActiveTab('home'); };
  const handleUpdateProfile = (newData: UserData) => { setCurrentUser(prev => ({ ...prev, ...newData })); };
  const handleUpdateCompanyData = (newData: any) => { setCompanyData(prev => ({ ...prev, address: newData.address, gallery: newData.gallery, professionals: newData.professionals, hours: newData.hours })); };
  const handleNewBooking = (newAppointment: any) => { setMyAppointments((prev) => [newAppointment, ...prev]); };
  const handleDeleteAppointment = (id: number) => { if (confirm("Tem certeza?")) setMyAppointments((prev) => prev.filter((appt) => appt.id !== id)); };
  const handleSaveEdit = (id: number, newData: any) => { setMyAppointments((prev) => prev.map((appt) => (appt.id === id ? { ...appt, ...newData } : appt))); };

  // --- COMPONENTE DE CHAT (Mobile Fix + Web) ---
  const ChatContent = () => {
    const [text, setText] = useState('');
    return (
      <div className="flex flex-col h-full w-full relative">
        <div className="flex justify-between items-center mb-4 px-2 shrink-0">
           <h2 className="text-xl font-bold text-[#C68D7D]">Fale Conosco</h2>
           <button onClick={() => setClientNotifications(!clientNotifications)} className="text-gray-400 hover:text-[#C68D7D] transition">
             {clientNotifications ? <Bell size={20}/> : <BellOff size={20} className="text-red-400"/>}
           </button>
        </div>
        
        {/* CONTAINER CHAT FLEXÍVEL */}
        <div className="flex-grow bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
           
           {/* ÁREA DE MENSAGENS (SCROLL) */}
           <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
              {messages.map((msg, idx) => (
                <div key={msg.id || idx} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm border ${msg.sender === 'client' ? 'bg-white border-gray-700 text-gray-800 rounded-br-none' : 'bg-[#C68D7D] text-white rounded-bl-none border-transparent'}`}>
                      {msg.text}
                      <span className={`block text-[10px] text-right mt-2 ${msg.sender === 'client' ? 'text-gray-400' : 'text-white/80'}`}>{msg.timestamp}</span>
                   </div>
                </div>
              ))}
              <div ref={chatEndRef} />
           </div>
           
           {/* INPUT FIXO NO FINAL DO CARD (SEM ABSOLUTE PARA NÃO SUMIR) */}
           <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 items-center shrink-0">
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-grow bg-white border border-gray-200 rounded-full px-4 py-3 outline-none focus:ring-1 focus:ring-[#C68D7D] text-sm shadow-sm" onKeyDown={e => { if(e.key === 'Enter' && text.trim()) { handleSendMessage(text); setText(''); }}} />
              <button onClick={() => { if(text.trim()) { handleSendMessage(text); setText(''); }}} className="text-white p-3 rounded-full shadow-sm flex items-center justify-center aspect-square hover:opacity-90" style={{ backgroundColor: cColors.primary }}><Send size={18}/></button>
           </div>
        </div>
        
        {/* Espaçador Mobile para BottomNav */}
        <div className="h-24 shrink-0 md:hidden"></div>
      </div>
    );
  };

  const HomeContent = () => (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-24 md:pb-0">
      <div className="w-full"><PromoBanner /></div>
      <div className="w-full px-1"><h3 className="text-lg md:text-xl font-bold text-[#8A5A4E] mb-4 px-2">Especialidades</h3><div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">{CATEGORIES.map((cat) => (<div key={cat.id} className="flex flex-col items-center text-center gap-2 group cursor-pointer hover:-translate-y-1 transition-transform duration-300"><div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white border border-[#F5E6E3] flex items-center justify-center text-[#C68D7D] shadow-sm group-hover:bg-[#C68D7D] group-hover:text-white transition-all"><cat.icon size={24} className="md:w-7 md:h-7" /></div><span className="text-[11px] md:text-sm font-medium text-gray-600 text-center leading-tight w-full break-words">{cat.name}</span></div>))}</div></div>
      <div className="w-full pl-2 md:px-1"><h3 className="text-lg md:text-xl font-bold text-[#8A5A4E] mb-4 px-2">Nossa Equipe</h3>{companyData.professionals.length === 0 ? (<div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-[#F5E6E3] text-center mx-2"><AlertCircle className="text-[#C68D7D] mb-3 opacity-50" size={40} /><p className="font-bold text-[#8A5A4E]">Nenhum profissional.</p><p className="text-xs text-gray-400 mt-1">Aguardando configuração.</p></div>) : (<div className="flex overflow-x-auto gap-4 pr-6 pb-4 -ml-2 pl-2 scrollbar-hide md:grid md:grid-cols-3 lg:grid-cols-4 md:overflow-visible md:ml-0 md:pr-0">{companyData.professionals.map((prof, index) => (<div key={prof.id || index} onClick={() => setSelectedProfessional(prof)} className="min-w-[200px] md:min-w-0 bg-white p-3 rounded-2xl shadow-sm border border-rose-100 cursor-pointer hover:shadow-lg hover:border-[#C68D7D]/30 transition-all group flex flex-col h-full"><div className="relative w-full h-48 md:h-56 mb-3 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">{prof.image ? (<Image src={prof.image} alt={prof.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />) : (<div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">Sem Foto</div>)}<div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-orange-500 shadow-sm flex items-center gap-1">★ {prof.rating}</div></div><div className="flex flex-col flex-grow"><h4 className="font-bold text-gray-800 text-base md:text-lg truncate">{prof.name}</h4><p className="text-sm text-copper-gold font-medium mb-2">{prof.role || prof.specialty}</p><div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400"><span>{prof.distance}</span><span className="text-[#C68D7D] font-bold">Agendar</span></div></div></div>))}</div>)}</div>
    </div>
  );

  const ScheduleContent = () => (
    <div className="w-full animate-in slide-in-from-right duration-300 px-1 pb-24 md:pb-0">
      <h2 className="text-xl md:text-2xl font-bold text-[#8A5A4E] mb-6 px-2">Meus Agendamentos</h2>
      {myAppointments.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-[#F5E6E3]"><Calendar size={48} strokeWidth={1} className="mb-4 text-[#C68D7D] opacity-50" /><p>Sem agendamentos.</p><button onClick={() => setActiveTab('home')} className="mt-4 text-[#C68D7D] font-bold text-sm hover:underline">Agendar agora</button></div>) : (
        <div className="grid gap-4 md:grid-cols-2">{myAppointments.map((appt, idx) => (<div key={appt.id || idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition group"><div className="flex justify-between items-start"><div className="flex gap-3 items-center"><div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm bg-orange-400">{appt.salon.charAt(0)}</div><div><h4 className="font-bold text-gray-800">{appt.salon}</h4><p className="text-xs text-gray-500 font-medium max-w-[200px] truncate" title={appt.service}>{appt.service}</p></div></div><span className="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-100">{appt.status}</span></div><div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100"><Clock size={16} className="text-[#C68D7D]" /><span className="font-bold">{appt.date}</span></div><div className="text-right text-xs font-bold text-gray-400">Valor: {(Number(appt.price) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div><div className="flex gap-2 pt-2 border-t border-gray-50"><button onClick={() => setEditingAppt(appt)} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-[#C68D7D] hover:text-white transition-colors"><Pencil size={14}/> Editar</button><button onClick={() => handleDeleteAppointment(appt.id)} className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold text-rose-400 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={14}/> Cancelar</button></div></div>))}</div>
      )}
    </div>
  );

  if (isSplashLoading) return <SplashScreen onFinish={() => setIsSplashLoading(false)} />;
  if (userRole === 'guest') return <LoginScreen onLogin={handleLogin} />;
  if (userRole === 'manager') return <ManagerDashboard onLogout={handleLogout} currentData={companyData} onUpdateData={handleUpdateCompanyData} appointments={myAppointments} messages={messages} onSendMessage={handleSendMessage} unreadCount={managerUnread} onClearNotifications={() => setManagerUnread(0)} />;

  // --- HEADER WEB (Top Nav - Restaurado) ---
  const WebHeader = () => (
    <header className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 z-50 shadow-sm" style={{ backgroundColor: cColors.bg }}>
      <div className="flex items-center gap-6">
          <div className="p-2 font-bold text-xl flex items-center gap-3" style={{ color: cColors.textDark }}>
              <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-lg shadow-sm" style={{ backgroundColor: cColors.primary }}>D</div> Dellas
          </div>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="font-bold text-lg" style={{ color: cColors.textDark }}>Olá, {currentUser.name || 'Visitante'}</span>
      </div>
      <nav className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border" style={{ borderColor: cColors.cardBorder }}>
          {[
            { id: 'home', label: 'Início', icon: HomeIcon },
            { id: 'calendar', label: 'Agenda', icon: Clock },
            { id: 'messages', label: 'Chat', icon: MessageSquare }, // Chat incluído no topo
            { id: 'explore', label: 'Explorar', icon: Pencil },
            { id: 'profile', label: 'Perfil', icon: Pencil }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all text-sm ${activeTab === item.id ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`} style={{ backgroundColor: activeTab === item.id ? cColors.primary : 'transparent' }}>
                <item.icon size={18} /> {item.label}
            </button>
          ))}
      </nav>
      <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-white shadow-sm border hover:bg-gray-50 transition" style={{ borderColor: cColors.cardBorder, color: cColors.primary }}><Search size={20}/></button>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: cColors.primary }}>{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'V'}</div>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 text-red-400 transition" title="Sair"><LogOut size={20}/></button>
      </div>
    </header>
  );

  // --- BOTTOM NAV (Mobile) ---
  const BottomNavItem = ({ icon: Icon, label, tab }: any) => (
    <button onClick={() => setActiveTab(tab)} className={`flex flex-col items-center gap-1 ${activeTab === tab ? '' : 'text-gray-400'}`} style={{ color: activeTab === tab ? cColors.primary : undefined }}>
       <div className={`p-1 rounded-xl transition-all`} style={{ backgroundColor: activeTab === tab ? cColors.activeNavBg : 'transparent' }}><Icon size={24} /></div>
       <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  return (
    <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col" style={{ backgroundColor: cColors.bg }}>
      {selectedProfessional && <BookingModal professional={selectedProfessional} onClose={() => setSelectedProfessional(null)} onBookingSuccess={handleNewBooking} />}
      {editingAppt && <EditAppointmentModal appointment={editingAppt} onClose={() => setEditingAppt(null)} onSave={handleSaveEdit} />}
      
      {/* Header Desktop */}
      <WebHeader />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header só aparece em Mobile */}
        <div className="md:hidden relative z-20">
           <Header activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} userName={currentUser.name} />
        </div>
        
        {/* Área de Conteúdo Principal */}
        <div className="flex-grow w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 relative z-10 h-[100dvh] md:h-auto overflow-y-auto pb-0 md:pb-12">
          {activeTab === 'home' && <HomeContent />}
          {activeTab === 'calendar' && <ScheduleContent />}
          {activeTab === 'profile' && <ProfileScreen user={currentUser} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile} allProfessionals={companyData.professionals} />}
          {activeTab === 'explore' && <ExploreScreen professionals={companyData.professionals} address={companyData.address} gallery={companyData.gallery} />}
          {activeTab === 'messages' && <ChatContent />}
        </div>

        {/* Bottom Nav Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)] pb-safe">
           <div className="flex justify-around items-center py-3">
              <BottomNavItem icon={HomeIcon} label="Início" tab="home" />
              <BottomNavItem icon={Clock} label="Agenda" tab="calendar" />
              <BottomNavItem icon={MessageSquare} label="Msgs" tab="messages" />
              <BottomNavItem icon={Pencil} label="Explorar" tab="explore" />
              <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? '' : 'text-gray-400'}`} style={{ color: activeTab === 'profile' ? cColors.primary : undefined }}>
                 <div className={`w-7 h-7 rounded-full border-2 p-0.5 transition-all ${activeTab === 'profile' ? '' : 'border-gray-200'}`} style={{ borderColor: activeTab === 'profile' ? cColors.primary : undefined }}>{currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover rounded-full"/> : <div className="w-full h-full bg-gray-100 rounded-full"></div>}</div>
                 <span className="text-[10px] font-bold">Perfil</span>
              </button>
           </div>
        </div>
      </div>
    </main>
  );
}