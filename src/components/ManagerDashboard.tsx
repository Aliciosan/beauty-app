"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Users, Image as ImageIcon, 
  Plus, Trash2, Save, Upload, DollarSign, Calendar, Camera, Scissors, 
  Clock, Search, Loader2, MessageSquare, Send, Bell, BellOff, Menu, X 
} from 'lucide-react';
import { useForm, useFieldArray, useWatch, Control, UseFormRegister } from 'react-hook-form';
import { CompanyData, Appointment } from '../types'; 

// Tipos para as mensagens do chat
type Message = { id: number; text: string; sender: 'client' | 'manager'; timestamp: string; };

type ManagerDashboardProps = {
  onLogout: () => void;
  currentData: CompanyData;
  onUpdateData: (data: CompanyData) => void;
  appointments: Appointment[];
  messages: Message[];
  onSendMessage: (text: string) => void;
  unreadCount: number;
  onClearNotifications: () => void;
};

// --- SUB-COMPONENTE: SERVIÇOS DO PROFISSIONAL (Responsivo) ---
const ProfessionalServices = ({ nestIndex, control, register }: { nestIndex: number, control: Control<CompanyData>, register: UseFormRegister<CompanyData> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `professionals.${nestIndex}.services` });
  
  return (
    <div className="mt-4 bg-indigo-50/50 p-3 sm:p-4 rounded-xl border border-indigo-100">
      <label className="text-xs font-bold text-indigo-900 uppercase mb-3 flex items-center gap-2">
        <Scissors size={14}/> Serviços
      </label>
      <div className="space-y-3">
        {fields.map((item, k) => (
          // Layout: Coluna em mobile, Linha em desktop (sm:)
          <div key={item.id} className="flex flex-col sm:flex-row gap-2 sm:items-center bg-white sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-indigo-100 shadow-sm sm:shadow-none">
            <input {...register(`professionals.${nestIndex}.services.${k}.name`)} placeholder="Nome (ex: Corte)" className="flex-grow p-2 text-sm border rounded-lg w-full" />
            <div className="flex gap-2 w-full sm:w-auto">
                <input {...register(`professionals.${nestIndex}.services.${k}.price`)} type="number" placeholder="Preço" className="w-1/2 sm:w-24 p-2 text-sm border rounded-lg" />
                <input {...register(`professionals.${nestIndex}.services.${k}.duration`)} placeholder="Tempo" className="w-1/2 sm:w-24 p-2 text-sm border rounded-lg" />
                <button type="button" onClick={() => remove(k)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg border sm:border-0 border-red-100 bg-red-50 sm:bg-transparent flex justify-center items-center">
                  <Trash2 size={16}/>
                </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => append({ id: Date.now(), name: '', price: 0, duration: '' })} className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline p-2 w-full sm:w-auto justify-center sm:justify-start">
        <Plus size={14}/> Adicionar Serviço
      </button>
    </div>
  );
};

// --- SUB-COMPONENTE: ITEM DO PROFISSIONAL (Responsivo) ---
const ProfessionalItem = ({ index, control, register, remove, setValue }: any) => {
  const image = useWatch({ control, name: `professionals.${index}.image` });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files?.[0]) setValue(`professionals.${index}.image`, URL.createObjectURL(e.target.files[0])); 
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4 relative">
        <button onClick={() => remove(index)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-2">
            <Trash2 size={18}/>
        </button>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center sm:items-start mb-4">
        {/* Foto do Profissional */}
        <div className="relative group shrink-0 w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
          {image ? <img src={image} className="w-full h-full object-cover" alt="Profissional"/> : <Users className="text-gray-300"/>}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera size={24} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
          </label>
        </div>

        {/* Inputs de Nome e Cargo */}
        <div className="flex-grow w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">NOME</label>
            <input {...register(`professionals.${index}.name`)} className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Nome completo"/>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">CARGO</label>
            <input {...register(`professionals.${index}.role`)} className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors" placeholder="Ex: Cabeleireira"/>
          </div>
        </div>
      </div>
      
      {/* Lista de Serviços do Profissional */}
      <ProfessionalServices nestIndex={index} control={control} register={register} />
    </div>
  );
};

// --- COMPONENTE PRINCIPAL DO DASHBOARD ---
export default function ManagerDashboard({ onLogout, currentData, onUpdateData, appointments, messages, onSendMessage, unreadCount, onClearNotifications }: ManagerDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'settings' | 'messages'>('overview');
  const [settingsTab, setSettingsTab] = useState<'info' | 'hours' | 'team' | 'photos'>('info'); 
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [inputText, setInputText] = useState('');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const todayDate = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const defaultDay = { isOpen: true, start: '09:00', end: '18:00' };

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<CompanyData>({ 
    defaultValues: { address: { street: '', number: '', city: '', zip: '' }, gallery: [], professionals: [], hours: { seg: defaultDay, ter: defaultDay, qua: defaultDay, qui: defaultDay, sex: defaultDay, sab: defaultDay, dom: { ...defaultDay, isOpen: false } } } 
  });
  
  const zipRegister = register("address.zip");
  const totalRevenue = appointments.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  // Carrega os dados iniciais no formulário
  useEffect(() => { 
    if (currentData) { 
      reset({ address: currentData.address, professionals: currentData.professionals || [], hours: currentData.hours || { seg: defaultDay, ter: defaultDay, qua: defaultDay, qui: defaultDay, sex: defaultDay, sab: defaultDay, dom: { ...defaultDay, isOpen: false } } } ); 
      setPreviewImages(currentData.gallery || []); 
    } 
  }, [currentData, reset]);
  
  // Rola o chat para o final quando novas mensagens chegam
  useEffect(() => { 
    if (activeView === 'messages') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, activeView]);

  const { fields: profFields, append: appendProf, remove: removeProf } = useFieldArray({ control, name: "professionals" });

  // Busca de CEP automática
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, ''); 
    if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    setValue("address.zip", cep); 
    
    if (cep.replace('-', '').length === 8) { 
      setIsLoadingCep(true); 
      try { 
        const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep.replace('-', '')}`); 
        if (!res.ok) throw new Error(); 
        const data = await res.json(); 
        setValue('address.street', data.street); 
        setValue('address.city', `${data.city} - ${data.state}`); 
        document.getElementById('address-number')?.focus(); 
      } catch {} finally { setIsLoadingCep(false); } 
    } 
  };

  const onSubmit = (data: CompanyData) => { onUpdateData({ ...data, gallery: previewImages }); alert("Dados Salvos!"); };
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) setPreviewImages(prev => [...prev, ...Array.from(e.target.files!).map(file => URL.createObjectURL(file))]); };
  const handleSend = () => { if (!inputText.trim()) return; onSendMessage(inputText); setInputText(''); };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* HEADER MOBILE (Fixo no topo) */}
      <div className="md:hidden bg-white px-4 py-3 border-b flex justify-between items-center sticky top-0 z-50 shadow-sm">
         <div className="font-bold text-indigo-900 flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center">D</div> Dellas
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg text-gray-600 active:scale-95 transition-transform">
            {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
         </button>
      </div>

      {/* SIDEBAR (Menu Lateral) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:h-screen
      `}>
        <div className="p-6 h-full flex flex-col">
            <div className="font-bold text-indigo-900 text-xl mb-8 flex items-center gap-2 hidden md:flex">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center">D</div> Dellas Admin
            </div>
            <nav className="space-y-2 flex-grow">
            <button onClick={() => {setActiveView('overview'); setMobileMenuOpen(false);}} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 font-medium transition-all ${activeView === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <LayoutDashboard size={20}/> Visão Geral
            </button>
            <button onClick={() => {setActiveView('settings'); setMobileMenuOpen(false);}} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 font-medium transition-all ${activeView === 'settings' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <Settings size={20}/> Configurações
            </button>
            <button onClick={() => { setActiveView('messages'); onClearNotifications(); setMobileMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 justify-between font-medium transition-all ${activeView === 'messages' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>
                <div className="flex gap-3 items-center"><MessageSquare size={20}/> Mensagens</div>
                {unreadCount > 0 && notifEnabled && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
            </button>
            </nav>
            <button onClick={onLogout} className="w-full flex justify-center gap-2 p-3 mt-auto bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-all border border-red-100 text-sm">
                <LogOut size={18}/> Sair
            </button>
        </div>
      </aside>
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-black/20 z-30 md:hidden" />}

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col max-w-full overflow-hidden h-[calc(100vh-60px)] md:h-screen">
        <header className="bg-white px-4 md:px-8 py-4 md:py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 hidden md:flex">
          <h1 className="text-xl font-bold text-gray-800">{activeView === 'overview' ? 'Dashboard' : activeView === 'settings' ? 'Configurações' : 'Mensagens'}</h1>
          <div className="flex items-center gap-4">
             <button onClick={() => setNotifEnabled(!notifEnabled)} className="text-gray-400 hover:text-indigo-600 transition">{notifEnabled ? <Bell size={20}/> : <BellOff size={20} className="text-red-400"/>}</button>
             <div className="text-sm bg-gray-50 px-3 py-1 rounded-full text-gray-500 font-medium">{todayDate}</div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide pb-24 md:pb-8">
          {activeView === 'overview' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
              {/* Cards de Resumo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex justify-center items-center text-green-600"><DollarSign size={24}/></div>
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Faturamento</p><h3 className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3></div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex justify-center items-center text-blue-600"><Clock size={24}/></div>
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Agendamentos</p><h3 className="text-2xl font-bold text-gray-800">{appointments.length}</h3></div>
                </div>
                <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex justify-center items-center text-purple-600"><Users size={24}/></div>
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Clientes</p><h3 className="text-2xl font-bold text-gray-800">{appointments.length > 0 ? 1 : 0}</h3></div>
                </div>
              </div>
              
              {/* Lista de Agendamentos */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Agenda do Dia</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">{appointments.length}</span>
                </div>
                {appointments.length === 0 ? (
                  <div className="py-20 text-center text-gray-400 flex flex-col items-center"><Calendar size={48} className="mb-2 opacity-10"/><p>Sem agendamentos.</p></div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {appointments.map(appt => (
                      <div key={appt.id} className="p-4 md:p-5 flex flex-col md:flex-row justify-between hover:bg-gray-50 transition gap-3 md:gap-0">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex justify-center items-center font-bold text-sm shrink-0">{appt.salon[0]}</div>
                          <div><h4 className="font-bold text-gray-800 text-sm">{appt.service}</h4><p className="text-xs text-gray-500">{appt.salon} • {appt.date}</p></div>
                        </div>
                        <div className="flex justify-between md:block md:text-right pl-14 md:pl-0">
                          <p className="text-sm font-bold text-gray-800">{(Number(appt.price) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">{appt.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in shadow-sm pb-24">
                  {/* Abas de Navegação (Scroll Horizontal no Mobile) */}
                  <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {[{id:'info', label:'Endereço'}, {id:'hours', label:'Horários'}, {id:'team', label:'Equipe'}, {id:'photos', label:'Galeria'}].map((t:any) => (
                      <button key={t.id} onClick={() => setSettingsTab(t.id)} className={`flex-1 py-3 md:py-4 px-4 whitespace-nowrap border-b-2 font-medium transition-all ${settingsTab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{t.label}</button>
                    ))}
                  </div>
                  
                  {/* Configuração de Endereço */}
                  {settingsTab === 'info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="relative">
                        <label className="text-xs font-bold text-gray-500 block mb-1">CEP</label>
                        <div className="relative">
                          <input {...zipRegister} onChange={(e) => { zipRegister.onChange(e); handleCepChange(e); }} placeholder="00000-000" maxLength={9} className="w-full p-3 pl-10 border rounded-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50" />
                          <div className="absolute left-3 top-3.5 text-gray-400">{isLoadingCep ? <Loader2 size={18} className="animate-spin text-indigo-500"/> : <Search size={18}/>}</div>
                        </div>
                      </div>
                      <div><label className="text-xs font-bold text-gray-500 block mb-1">Número</label><input id="address-number" {...register("address.number")} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500" /></div>
                      <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 block mb-1">Rua</label><input {...register("address.street")} className="w-full p-3 border rounded-lg bg-gray-50 outline-none" /></div>
                      <div className="md:col-span-2"><label className="text-xs font-bold text-gray-500 block mb-1">Cidade</label><input {...register("address.city")} className="w-full p-3 border rounded-lg bg-gray-50 outline-none" /></div>
                    </div>
                  )}

                  {/* Configuração de Horários (Responsivo) */}
                  {settingsTab === 'hours' && (
                    <div className="space-y-3">
                        {['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(day => { 
                            const isOpen = watch(`hours.${day}` as any)?.isOpen; 
                            return (
                                // Layout: Coluna em mobile, Linha em desktop
                                <div key={day} className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border transition-colors ${isOpen ? 'bg-white border-gray-200' : 'bg-gray-50 opacity-60'}`}>
                                    <label className="w-full sm:w-24 font-bold uppercase text-xs flex gap-2 cursor-pointer text-gray-600">
                                        <input type="checkbox" {...register(`hours.${day}.isOpen` as any)} className="accent-indigo-600"/> {day}
                                    </label>
                                    <div className={`flex gap-2 w-full sm:w-auto ml-auto ${!isOpen ? 'pointer-events-none' : ''}`}>
                                        <input type="time" disabled={!isOpen} {...register(`hours.${day}.start` as any)} className="flex-1 sm:flex-none border rounded p-2 text-sm bg-transparent"/>
                                        <span className="text-xs text-gray-400 py-2 flex items-center">até</span>
                                        <input type="time" disabled={!isOpen} {...register(`hours.${day}.end` as any)} className="flex-1 sm:flex-none border rounded p-2 text-sm bg-transparent"/>
                                    </div>
                                </div>
                            ) 
                        })}
                    </div>
                  )}

                  {/* Configuração de Equipe */}
                  {settingsTab === 'team' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Profissionais</h3>
                            <button onClick={() => appendProf({ id: Date.now(), rating: 5, name: '', role: '', image: '', services: [] })} className="bg-indigo-600 text-white px-3 py-2 md:px-4 rounded-lg text-sm font-bold hover:bg-indigo-100 flex gap-2">
                                <Plus size={16}/> Adicionar
                            </button>
                        </div>
                        {profFields.map((f, i) => <ProfessionalItem key={f.id} index={i} control={control} register={register} remove={removeProf} setValue={setValue}/>)}
                    </div>
                  )}

                  {/* Configuração da Galeria de Fotos */}
                  {settingsTab === 'photos' && (
                    <div>
                        <label className="block border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-8 md:p-12 text-center rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors">
                            <input type="file" multiple onChange={handleGalleryUpload} className="hidden"/>
                            <Upload className="mx-auto text-indigo-400 mb-2"/>
                            <span className="font-bold text-indigo-900 block">Adicionar Fotos</span>
                            <span className="text-xs text-gray-400">Toque para selecionar</span>
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mt-6">
                            {previewImages.map((src, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm">
                                    <img src={src} className="w-full h-full object-cover" alt="Galeria"/>
                                    <button onClick={() => setPreviewImages(p => p.filter((_, x) => x !== i))} className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                                        <Trash2 size={14}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                  
                  {/* Botão Salvar (Fixo no Mobile, Normal no Desktop) */}
                  <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 z-30 md:static md:p-0 md:bg-transparent md:border-0 md:flex md:justify-end md:mt-6">
                    <button onClick={handleSubmit(onSubmit)} className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center justify-center gap-2">
                      <Save size={18}/> Salvar Alterações
                    </button>
                  </div>
            </div>
          )}

          {/* Visualização de Mensagens */}
          {activeView === 'messages' && (
            <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-[calc(100vh-140px)] animate-in fade-in overflow-hidden shadow-sm">
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'manager' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-sm text-sm ${msg.sender === 'manager' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'}`}>
                      <p>{msg.text}</p>
                      <span className={`block text-[10px] text-right mt-1.5 ${msg.sender === 'manager' ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 md:p-4 bg-white border-t border-gray-100 flex gap-2 md:gap-3">
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Digite..." className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={handleSend} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 shadow-sm"><Send size={20} /></button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}