"use client";

import { useState } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Image as ImageIcon, 
  Plus, Trash2, Save, Upload, Clock, MapPin, 
  MessageSquare, Bell, Menu, X, Users
} from 'lucide-react';
import { useForm, useFieldArray, useWatch, Control, UseFormRegister } from 'react-hook-form';
import { CompanyData, Appointment } from '../types';

type ManagerDashboardProps = {
  onLogout: () => void;
  currentData: CompanyData;
  onUpdateData: (data: CompanyData) => void;
  appointments: Appointment[];
  messages: any[];
  onSendMessage: (text: string) => void;
  unreadCount: number;
  onClearNotifications: () => void;
};

// Sub-componente para Serviços (Separado para organizar)
const ProfessionalServices = ({ nestIndex, control, register }: { nestIndex: number, control: Control<any>, register: UseFormRegister<any> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `professionals.${nestIndex}.services` });

  return (
    <div className="mt-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Serviços</label>
        <button type="button" onClick={() => append({ id: Date.now(), name: '', price: 0, duration: '' })} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
          <Plus size={14}/> Adicionar Serviço
        </button>
      </div>
      <div className="space-y-3">
        {fields.map((item, k) => (
          <div key={item.id} className="flex gap-2 items-center">
             <input {...register(`professionals.${nestIndex}.services.${k}.name`)} placeholder="Nome (ex: Corte)" className="flex-1 p-2 text-sm border rounded-lg" />
             <div className="flex gap-2 w-1/3 sm:w-auto">
                <input {...register(`professionals.${nestIndex}.services.${k}.price`)} type="number" placeholder="R$" className="w-full sm:w-20 p-2 text-sm border rounded-lg" />
                <button type="button" onClick={() => remove(k)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16}/></button>
             </div>
          </div>
        ))}
        {fields.length === 0 && <p className="text-xs text-center text-gray-400 py-2">Nenhum serviço adicionado.</p>}
      </div>
    </div>
  );
};

const ProfessionalItem = ({ index, control, register, remove, setValue }: any) => {
  const image = useWatch({ control, name: `professionals.${index}.image` });

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setValue(`professionals.${index}.image`, reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4 relative">
      <button onClick={() => remove(index)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <label className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-colors">
            {image ? <img src={image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-400" />}
          </div>
          <input type="file" onChange={handleImageChange} className="hidden" />
          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full shadow-md"><Plus size={14}/></div>
        </label>
        
        <div className="flex-1 w-full space-y-4 text-center sm:text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
               <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nome</label>
               <input {...register(`professionals.${index}.name`)} className="w-full text-lg font-bold text-gray-800 border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-1 bg-transparent placeholder-gray-300" placeholder="Nome do Profissional" />
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Cargo</label>
               <input {...register(`professionals.${index}.role`)} className="w-full text-lg font-bold text-gray-800 border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-1 bg-transparent placeholder-gray-300" placeholder="Ex: Cabeleireiro" />
             </div>
          </div>
        </div>
      </div>
      <ProfessionalServices nestIndex={index} control={control} register={register} />
    </div>
  );
};

export default function ManagerDashboard({ onLogout, currentData, onUpdateData, appointments }: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState('settings');
  const [settingsTab, setSettingsTab] = useState('team');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { register, control, handleSubmit, watch, setValue, formState: { isDirty } } = useForm<CompanyData>({
    defaultValues: currentData
  });

  const { fields: profFields, append: appendProf, remove: removeProf } = useFieldArray({
    control, name: "professionals"
  });

  const previewImages = watch('gallery') || [];

  const handleGalleryUpload = (e: any) => {
    const files = Array.from(e.target.files);
    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const current = watch('gallery') || [];
        setValue('gallery', [...current, reader.result as string], { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = (data: CompanyData) => {
    onUpdateData(data);
    alert('Alterações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-20">
        <span className="font-bold text-indigo-700 text-lg">Dellas Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg">
          {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed md:sticky top-[60px] md:top-0 left-0 h-[calc(100vh-60px)] md:h-screen w-full md:w-64 bg-white border-r border-gray-200 p-6 z-10 transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:block mb-10 px-2">
           <h1 className="text-2xl font-black text-indigo-700 tracking-tight">Dellas<span className="text-indigo-400">.</span></h1>
           <p className="text-xs text-gray-400 font-medium">Painel Gerencial</p>
        </div>

        <nav className="space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings size={20} /> Configurações
          </button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        
        {/* HEADER DESKTOP */}
        <header className="hidden md:flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === 'dashboard' ? 'Visão Geral' : 'Configurações'}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </header>

        {activeTab === 'settings' && (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
            
            {/* TABS DE NAVEGAÇÃO */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
              {[
                { id: 'team', label: 'Equipe', icon: Users },
                { id: 'hours', label: 'Horários', icon: Clock },
                { id: 'photos', label: 'Galeria', icon: ImageIcon },
                { id: 'address', label: 'Endereço', icon: MapPin },
              ].map(tab => (
                <button 
                  key={tab.id} 
                  type="button" 
                  onClick={() => setSettingsTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${settingsTab === tab.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  <tab.icon size={16}/> {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-gray-100">
              
              {/* ABA DE HORÁRIOS - CORRIGIDA PARA MOBILE */}
              {settingsTab === 'hours' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-800 mb-4 px-2">Horário de Funcionamento</h3>
                  {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(day => {
                    const isOpen = watch(`hours.${day}.isOpen` as any);
                    return (
                      <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all ${isOpen ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                        <div className="flex items-center justify-between sm:w-32">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input type="checkbox" {...register(`hours.${day}.isOpen` as any)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"/> 
                            <span className="font-bold text-gray-700 uppercase text-sm">{day}</span>
                          </label>
                        </div>
                        
                        <div className={`flex items-center gap-3 w-full sm:w-auto transition-opacity ${!isOpen ? 'opacity-40 pointer-events-none' : ''}`}>
                          <input type="time" disabled={!isOpen} {...register(`hours.${day}.start` as any)} className="flex-1 sm:w-auto p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center font-medium focus:border-indigo-500 outline-none"/>
                          <span className="text-gray-400 text-xs font-medium">ATÉ</span>
                          <input type="time" disabled={!isOpen} {...register(`hours.${day}.end` as any)} className="flex-1 sm:w-auto p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-center font-medium focus:border-indigo-500 outline-none"/>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* ABA DE EQUIPE */}
              {settingsTab === 'team' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800">Profissionais</h3>
                    <button type="button" onClick={() => appendProf({ id: Date.now(), rating: 5, name: '', role: '', image: '', services: [] })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex gap-2 items-center transition-colors shadow-sm">
                      <Plus size={16}/> <span className="hidden sm:inline">Adicionar</span>
                    </button>
                  </div>
                  {profFields.map((f, i) => (
                    <ProfessionalItem key={f.id} index={i} control={control} register={register} remove={removeProf} setValue={setValue} />
                  ))}
                </div>
              )}

              {/* OUTRAS ABAS (Simplificadas para não ocupar espaço, mantendo a lógica se precisar) */}
              {settingsTab === 'photos' && (
                 <div className="text-center py-10">
                    <label className="cursor-pointer block border-2 border-dashed border-indigo-100 bg-indigo-50/50 rounded-2xl p-10 hover:bg-indigo-50 transition-colors">
                      <Upload className="mx-auto text-indigo-400 mb-2" size={40}/>
                      <span className="text-indigo-900 font-bold block">Clique para enviar fotos</span>
                      <input type="file" multiple onChange={handleGalleryUpload} className="hidden"/>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                      {previewImages.map((src, i) => (
                        <div key={i} className="aspect-square rounded-xl overflow-hidden relative group shadow-sm">
                           <img src={src} className="w-full h-full object-cover"/>
                           <button type="button" onClick={() => setValue('gallery', previewImages.filter((_, x) => x !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                        </div>
                      ))}
                    </div>
                 </div>
              )}

              {settingsTab === 'address' && (
                <div className="grid gap-4">
                  <input {...register('address.street')} placeholder="Rua / Avenida" className="w-full p-3 border rounded-xl bg-gray-50"/>
                  <div className="flex gap-4">
                     <input {...register('address.number')} placeholder="Número" className="w-1/3 p-3 border rounded-xl bg-gray-50"/>
                     <input {...register('address.zip')} placeholder="CEP" className="flex-1 p-3 border rounded-xl bg-gray-50"/>
                  </div>
                  <input {...register('address.city')} placeholder="Cidade - UF" className="w-full p-3 border rounded-xl bg-gray-50"/>
                </div>
              )}

            </div>

            {/* BOTÃO FLUTUANTE DE SALVAR (MOBILE) */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 md:static md:bg-transparent md:border-0 md:p-0 z-20">
               <button type="submit" disabled={!isDirty} className="w-full md:ml-auto md:w-auto bg-green-600 text-white px-8 py-4 md:py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg md:shadow-none transition-all flex items-center justify-center gap-2">
                 <Save size={20}/> Salvar Alterações
               </button>
            </div>
            <div className="h-20 md:hidden"></div> {/* Espaço para o botão fixo não cobrir nada */}
          </form>
        )}

        {activeTab === 'dashboard' && (
           <div className="text-center py-20 text-gray-400">
             <p>Dashboard em construção...</p>
             <p className="text-sm">Seus agendamentos aparecerão aqui.</p>
           </div>
        )}

      </main>
    </div>
  );
}