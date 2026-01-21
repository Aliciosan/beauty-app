"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Settings, LogOut, Store, Users, Image as ImageIcon, 
  Plus, Trash2, Save, Upload, DollarSign, Calendar, Camera, Scissors, 
  Clock, Search, Loader2, MapPin, MessageSquare, Send, Bell, BellOff, Menu 
} from 'lucide-react';
import { useForm, useFieldArray, useWatch, Control, UseFormRegister } from 'react-hook-form';
import { CompanyData, Appointment } from '@/types'; 

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

// Sub-componente: Serviços
const ProfessionalServices = ({ nestIndex, control, register }: { nestIndex: number, control: Control<CompanyData>, register: UseFormRegister<CompanyData> }) => {
  const { fields, append, remove } = useFieldArray({ control, name: `professionals.${nestIndex}.services` });
  
  return (
    <div className="mt-4 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
      <label className="text-xs font-bold text-indigo-900 uppercase mb-3 flex items-center gap-2">
        <Scissors size={14}/> Serviços
      </label>
      <div className="space-y-3">
        {fields.map((item, k) => (
          <div key={item.id} className="flex gap-2 items-center">
            <input {...register(`professionals.${nestIndex}.services.${k}.name`)} placeholder="Nome" className="flex-grow p-2 text-xs border rounded-lg" />
            <input {...register(`professionals.${nestIndex}.services.${k}.price`)} type="number" placeholder="R$" className="w-20 p-2 text-xs border rounded-lg" />
            <input {...register(`professionals.${nestIndex}.services.${k}.duration`)} placeholder="Tempo" className="w-20 p-2 text-xs border rounded-lg" />
            <button type="button" onClick={() => remove(k)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg">
              <Trash2 size={14}/>
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => append({ id: Date.now(), name: '', price: 0, duration: '' })} className="mt-3 text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
        <Plus size={14}/> Adicionar Serviço
      </button>
    </div>
  );
};

// Sub-componente: Profissional
const ProfessionalItem = ({ index, control, register, remove, setValue }: any) => {
  const image = useWatch({ control, name: `professionals.${index}.image` });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (e.target.files?.[0]) setValue(`professionals.${index}.image`, URL.createObjectURL(e.target.files[0])); 
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4">
      <div className="flex gap-5 items-start">
        <div className="relative group shrink-0 w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
          {image ? <img src={image} className="w-full h-full object-cover"/> : <Users className="text-gray-300"/>}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
            <Camera size={20} />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload}/>
          </label>
        </div>
        <div className="flex-grow grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">NOME</label>
            <input {...register(`professionals.${index}.name`)} className="w-full p-2 border rounded-lg text-sm"/>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-1">CARGO</label>
            <input {...register(`professionals.${index}.role`)} className="w-full p-2 border rounded-lg text-sm"/>
          </div>
        </div>
        <button onClick={() => remove(index)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg">
          <Trash2 size={18}/>
        </button>
      </div>
      <ProfessionalServices nestIndex={index} control={control} register={register} />
    </div>
  );
};

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

  useEffect(() => { 
    if (currentData) { 
      reset({ address: currentData.address, professionals: currentData.professionals || [], hours: currentData.hours || { seg: defaultDay, ter: defaultDay, qua: defaultDay, qui: defaultDay, sex: defaultDay, sab: defaultDay, dom: { ...defaultDay, isOpen: false } } }); 
      setPreviewImages(currentData.gallery || []); 
    } 
  }, [currentData, reset]);
  
  useEffect(() => { 
    if (activeView === 'messages') chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, activeView]);

  const { fields: profFields, append: appendProf, remove: removeProf } = useFieldArray({ control, name: "professionals" });

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
      
      {/* Mobile Menu */}
      <div className="md:hidden bg-white p-4 border-b flex justify-between items-center sticky top-0 z-50">
         <div className="font-bold text-indigo-900 flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center">D</div> Dellas Admin
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-gray-100 rounded-lg"><Menu size={24}/></button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-white w-64 border-r border-gray-100 min-h-screen fixed md:sticky top-0 z-40 flex flex-col p-6 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 font-bold text-indigo-900 text-xl mb-8 flex items-center gap-2 hidden md:flex">
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-full overflow-hidden">
        <header className="bg-white px-8 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-xl font-bold text-gray-800">{activeView === 'overview' ? 'Dashboard' : activeView === 'settings' ? 'Configurações' : 'Mensagens'}</h1>
          <div className="flex items-center gap-4">
             <button onClick={() => setNotifEnabled(!notifEnabled)} className="text-gray-400 hover:text-indigo-600 transition">{notifEnabled ? <Bell size={20}/> : <BellOff size={20} className="text-red-400"/>}</button>
             <div className="text-sm bg-gray-50 px-3 py-1 rounded-full text-gray-500 font-medium">{todayDate}</div>
          </div>
        </header>
        
        <main className="p-6 md:p-8 max-w-6xl mx-auto w-full overflow-y-auto h-[calc(100vh-80px)]">
          {activeView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex justify-center items-center text-green-600"><DollarSign size={24}/></div>
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Faturamento Total</p><h3 className="text-2xl font-bold text-gray-800">{totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex justify-center items-center text-blue-600"><Clock size={24}/></div>
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Agendamentos</p><h3 className="text-2xl font-bold text-gray-800">{appointments.length}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-5">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex justify-center items-center text-purple-600"><Users size={24}/></div>
                  <div><p className="text-xs text-gray-400 font-bold uppercase">Clientes</p><h3 className="text-2xl font-bold text-gray-800">{appointments.length > 0 ? 1 : 0}</h3></div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Agenda do Dia</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-bold">{appointments.length} registros</span>
                </div>
                {appointments.length === 0 ? (
                  <div className="py-20 text-center text-gray-400 flex flex-col items-center"><Calendar size={48} className="mb-2 opacity-10"/><p>Sem agendamentos.</p></div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {appointments.map(appt => (
                      <div key={appt.id} className="p-5 flex justify-between hover:bg-gray-50 transition">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex justify-center items-center font-bold text-sm">{appt.salon[0]}</div>
                          <div><h4 className="font-bold text-gray-800 text-sm">{appt.service}</h4><p className="text-xs text-gray-500">{appt.salon} • {appt.date}</p></div>
                        </div>
                        <div className="text-right">
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
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8 animate-in fade-in shadow-sm">
                 <div className="flex border-b border-gray-100 overflow-x-auto mb-6">
                   {[{id:'info', label:'Endereço'}, {id:'hours', label:'Horários'}, {id:'team', label:'Equipe'}, {id:'photos', label:'Galeria'}].map((t:any) => (
                     <button key={t.id} onClick={() => setSettingsTab(t.id)} className={`flex-1 py-4 border-b-2 font-medium transition-all ${settingsTab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{t.label}</button>
                   ))}
                 </div>
                 
                 {settingsTab === 'info' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                 {/* Outras tabs omitidas para brevidade, mas devem estar aqui como no código anterior */}
                 {settingsTab === 'hours' && <div className="space-y-3">{['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].map(day => { const isOpen = watch(`hours.${day}` as any)?.isOpen; return (<div key={day} className={`flex items-center gap-4 p-3 rounded-lg border ${isOpen ? 'bg-white border-gray-200' : 'bg-gray-50 opacity-60'}`}><label className="w-24 font-bold uppercase text-xs flex gap-2 cursor-pointer text-gray-600"><input type="checkbox" {...register(`hours.${day}.isOpen` as any)} className="accent-indigo-600"/> {day}</label><div className="flex gap-2 ml-auto"><input type="time" disabled={!isOpen} {...register(`hours.${day}.start` as any)} className="border rounded p-1 text-sm bg-transparent"/><span className="text-xs text-gray-400 py-2">até</span><input type="time" disabled={!isOpen} {...register(`hours.${day}.end` as any)} className="border rounded p-1 text-sm bg-transparent"/></div></div>) })}</div>}
                 {settingsTab === 'team' && <div><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-gray-800">Profissionais</h3><button onClick={() => appendProf({ id: Date.now(), rating: 5, name: '', role: '', image: '', services: [] })} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 flex gap-2"><Plus size={16}/> Adicionar</button></div>{profFields.map((f, i) => <ProfessionalItem key={f.id} index={i} control={control} register={register} remove={removeProf} setValue={setValue}/>)}</div>}
                 {settingsTab === 'photos' && <div><label className="block border-2 border-dashed border-indigo-200 bg-indigo-50/30 p-12 text-center rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors"><input type="file" multiple onChange={handleGalleryUpload} className="hidden"/><Upload className="mx-auto text-indigo-400 mb-2"/><span className="font-bold text-indigo-900">Adicionar Fotos</span></label><div className="grid grid-cols-4 gap-4 mt-6">{previewImages.map((src, i) => <div key={i} className="relative group aspect-square rounded-xl overflow-hidden shadow-sm"><img src={src} className="w-full h-full object-cover"/><button onClick={() => setPreviewImages(p => p.filter((_, x) => x !== i))} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md"><Trash2 size={14}/></button></div>)}</div></div>}
                 
                 <div className="pt-6 border-t flex justify-end">
                   <button onClick={handleSubmit(onSubmit)} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2">
                     <Save size={18}/> Salvar Alterações
                   </button>
                 </div>
            </div>
          )}

          {activeView === 'messages' && (
            <div className="bg-white rounded-2xl border border-gray-200 flex flex-col h-full animate-in fade-in overflow-hidden shadow-sm">
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'manager' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm ${msg.sender === 'manager' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'}`}>
                      <p>{msg.text}</p>
                      <span className={`block text-[10px] text-right mt-1.5 ${msg.sender === 'manager' ? 'text-indigo-200' : 'text-gray-400'}`}>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
                <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Digite sua resposta..." className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={handleSend} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 shadow-sm"><Send size={20} /></button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}