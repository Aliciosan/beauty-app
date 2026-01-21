"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Phone, Camera, LogOut, Edit2, Check, X, 
  ChevronRight, Heart, Bell, ShieldQuestion, Star, ArrowLeft, MapPin 
} from 'lucide-react';
import Image from 'next/image';

// --- PALETA DE CORES ---
const colors = {
  primary: '#C68D7D', // Cobre
  bgLight: '#FFF8F6', // Nude Fundo
  textDark: '#8A5A4E',
  textGray: '#9CA3AF',
  border: '#F5E6E3',
};

// --- TIPOS ---
type UserData = {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
};

type ProfileScreenProps = {
  user: UserData;
  onLogout: () => void;
  onUpdateProfile: (newData: UserData) => void;
  allProfessionals: any[];
};

type SubScreen = 'main' | 'favorites' | 'notifications';

export default function ProfileScreen({ user, onLogout, onUpdateProfile, allProfessionals }: ProfileScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<SubScreen>('main');
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado local para edição (Isolado do Pai para performance)
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    avatar: user.avatar || ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sincroniza o formulário se o usuário mudar vindo do Banco de Dados
  useEffect(() => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || ''
    });
  }, [user]);

  // --- HANDLERS ---
  const handleSave = () => {
    onUpdateProfile(formData); // Só avisa o pai aqui
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reverte para os dados originais do props
    setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
    }); 
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormData(prev => ({ ...prev, avatar: url }));
    }
  };

  // --- RENDERIZAÇÃO ---
  
  // 1. TELA DE FAVORITOS
  if (currentScreen === 'favorites') {
    return (
      <div className="pb-24 space-y-4 animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentScreen('main')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} style={{ color: colors.primary }}/>
          </button>
          <h3 className="text-xl font-bold" style={{ color: colors.textDark }}>Profissionais Favoritos</h3>
        </div>
        
        {allProfessionals.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Heart size={48} className="mx-auto mb-2 opacity-20"/>
            <p>Nenhum favorito ainda.</p>
          </div>
        ) : (
          allProfessionals.slice(0, 3).map((prof, index) => (
            <div 
              key={prof.id || index} 
              className="bg-white p-3 rounded-2xl shadow-sm border flex items-center gap-4 transition-all hover:shadow-md" 
              style={{ borderColor: colors.border }}
            >
              <div className="w-14 h-14 rounded-xl bg-gray-200 overflow-hidden relative shrink-0">
                {prof.image ? <Image src={prof.image} alt={prof.name} fill className="object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">?</div>}
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{prof.name}</h4>
                <p className="text-xs text-gray-500">{prof.role || prof.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                  <MapPin size={10}/> {prof.distance || 'Local'}
                </div>
              </div>
              <button className="p-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">
                <Heart size={18} fill="currentColor"/>
              </button>
            </div>
          ))
        )}
      </div>
    );
  }

  // 2. TELA DE NOTIFICAÇÕES
  if (currentScreen === 'notifications') {
    return (
      <div className="pb-24 space-y-4 animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setCurrentScreen('main')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} style={{ color: colors.primary }}/>
          </button>
          <h3 className="text-xl font-bold" style={{ color: colors.textDark }}>Notificações</h3>
        </div>
        {[
          { id: 1, title: 'Agendamento Confirmado', desc: 'Seu horário foi confirmado com sucesso.', time: '2h atrás', read: false },
          { id: 2, title: 'Promoção Relâmpago', desc: '50% de desconto em hidratação hoje!', time: '1d atrás', read: true },
          { id: 3, title: 'Bem-vindo ao Dellas!', desc: 'Complete seu perfil e ganhe pontos.', time: '3d atrás', read: true },
        ].map((notif) => (
          <div key={notif.id} className={`p-4 rounded-2xl border transition-all ${notif.read ? 'bg-white border-gray-100' : 'bg-[#FFF8F6] border-[#FCE4DE] shadow-sm'}`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold text-sm ${notif.read ? 'text-gray-700' : 'text-[#8A5A4E]'}`}>{notif.title}</h4>
                <span className="text-[10px] text-gray-400">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
          </div>
        ))}
      </div>
    );
  }

  // 3. TELA PRINCIPAL DO PERFIL (Padrão)
  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* HEADER CARD */}
      <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 opacity-30" style={{ background: `linear-gradient(to right, ${colors.bgLight}, #FCE4DE)` }}></div>
        
        <div className="relative flex flex-col items-center">
          {/* Avatar */}
          <div className="relative group mb-4 mt-4">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold" style={{ color: colors.primary }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            {isEditing && (
              <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 text-white p-2.5 rounded-full shadow-md hover:scale-110 transition-all" style={{ backgroundColor: colors.primary }}>
                <Camera size={18} />
              </button>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          {/* Info / Edit Form */}
          {!isEditing ? (
            <div className="text-center w-full">
              <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-sm text-gray-500 mb-5">{formData.email}</p>
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors mx-auto border border-gray-200">
                <Edit2 size={14} /> Editar Perfil
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3 mt-2 animate-in zoom-in duration-300">
              {/* INPUT NOME */}
              <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex items-center gap-3 focus-within:border-[#C68D7D] focus-within:bg-white transition-all">
                <User size={18} className="text-gray-400" />
                <input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="bg-transparent w-full outline-none text-gray-800 font-medium text-sm" 
                  placeholder="Nome" 
                />
              </div>

              {/* INPUT EMAIL */}
              <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex items-center gap-3 focus-within:border-[#C68D7D] focus-within:bg-white transition-all">
                <Mail size={18} className="text-gray-400" />
                <input 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="bg-transparent w-full outline-none text-gray-800 font-medium text-sm" 
                  placeholder="Email" 
                />
              </div>

              {/* INPUT TELEFONE */}
              <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 flex items-center gap-3 focus-within:border-[#C68D7D] focus-within:bg-white transition-all">
                <Phone size={18} className="text-gray-400" />
                <input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="bg-transparent w-full outline-none text-gray-800 font-medium text-sm" 
                  placeholder="Telefone" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors">Cancelar</button>
                <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-md transition-transform hover:scale-[1.02]" style={{ backgroundColor: colors.primary }}>Salvar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GAMIFICATION CARD */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-[25px] shadow-lg mb-6 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
        <div className="absolute -top-4 -right-4 p-4 opacity-10"><Star size={120} fill="white" /></div>
        <div className="relative z-10">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">DELLAS CLUB</p>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-2xl font-bold">Nível Gold</h3>
            <span className="text-3xl font-bold" style={{ color: colors.primary }}>850 <span className="text-sm text-gray-400 font-normal">pts</span></span>
          </div>
          <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="h-full w-[70%] rounded-full shadow-[0_0_10px_rgba(198,141,125,0.5)]" style={{ backgroundColor: colors.primary }}></div>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-right">Faltam 150 pts para Platinum</p>
        </div>
      </div>

      {/* MENU OPTIONS */}
      <div className="space-y-3 mb-8">
        <h3 className="font-bold text-gray-800 px-2 text-sm uppercase tracking-wide opacity-50 mb-2">Minha Conta</h3>
        
        <button onClick={() => setCurrentScreen('favorites')} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-all hover:border-[#C68D7D]/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FFF0F0] text-[#C68D7D]"><Heart size={20} /></div>
            <span className="font-medium text-gray-700">Profissionais Favoritos</span>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>

        <button onClick={() => setCurrentScreen('notifications')} className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-all hover:border-[#C68D7D]/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 text-blue-500"><Bell size={20} /></div>
            <span className="font-medium text-gray-700">Notificações</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2</span>
            <ChevronRight size={20} className="text-gray-300" />
          </div>
        </button>

        <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-all hover:border-[#C68D7D]/30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-50 text-purple-500"><ShieldQuestion size={20} /></div>
            <span className="font-medium text-gray-700">Ajuda e Suporte</span>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </button>

        <button onClick={onLogout} className="w-full mt-6 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-center gap-2 text-red-500 font-bold active:bg-red-100 transition-all hover:bg-red-500 hover:text-white hover:shadow-lg">
          <LogOut size={20} /> Sair do App
        </button>
      </div>
      
      <div className="text-center pb-8 text-xs text-gray-300">Versão 2.1.0 • Dellas Beauty App</div>
    </div>
  );
}