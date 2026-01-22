"use client";

import { useState } from 'react';
import { 
  X, ChevronLeft, CreditCard, DollarSign, Smartphone, AlertCircle, Check, CheckCircle
} from 'lucide-react';
import { Professional, Service } from '@/types';

const colors = {
  primary: '#C68D7D', 
  bgLight: '#FFF8F6',
  selectedBg: '#FFF0F0',
  textDark: '#5A3A33',
  textGray: '#9CA3AF'
};

type BookingModalProps = {
  professional: Professional;
  onClose: () => void;
  onBookingSuccess: (appointment: any) => void;
};

export default function BookingModal({ professional, onClose, onBookingSuccess }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = selectedServices.reduce((acc, s) => acc + Number(s.price), 0);
  const formattedTotal = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const availableServices = professional.services || [];
  
  const timeSlots = ['09:00', '10:00', '11:30', '14:00', '15:30', '16:00', '18:00'];
  const paymentOptions = [
    { id: 'pix', label: 'Pix (5% off)', icon: Smartphone },
    { id: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
    { id: 'cash', label: 'Dinheiro', icon: DollarSign },
  ];

  const toggleService = (service: Service) => {
    const isSelected = selectedServices.includes(service);
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s !== service));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const servicesSummary = selectedServices.map(s => s.name).join(' + ');
      const newAppointment = {
        id: Date.now(),
        salon: professional.name,
        service: servicesSummary,
        price: totalPrice,
        date: `${new Date(selectedDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às ${selectedTime}`,
        status: 'Confirmado'
      };
      onBookingSuccess(newAppointment);
      setStep(4);
    }, 1500);
  };

  return (
    // Z-INDEX ALTO E BACKDROP BLUR PARA FOCO TOTAL
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* CONTAINER PRINCIPAL: Altura dinâmica (dvh) para mobile */}
      <div className="bg-white w-full h-[95dvh] sm:h-auto sm:max-h-[85vh] sm:max-w-md rounded-t-[30px] sm:rounded-[24px] shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button onClick={handlePrevStep} className="p-2 -ml-2 text-gray-400 hover:text-gray-800 rounded-full active:bg-gray-100">
                <ChevronLeft size={24} />
              </button>
            )}
            <h3 className="text-xl font-bold text-gray-800">
              {step === 1 && "Serviços"}
              {step === 2 && "Horário"}
              {step === 3 && "Pagamento"}
              {step === 4 && "Sucesso!"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-200 text-gray-500 active:scale-90 transition-transform">
            <X size={22}/>
          </button>
        </div>

        {/* --- BARRA DE PROGRESSO --- */}
        {step < 4 && (
          <div className="h-1.5 w-full bg-gray-100 shrink-0">
            <div className="h-full transition-all duration-500 ease-out rounded-r-full" style={{ width: `${step * 33.3}%`, backgroundColor: colors.primary }}></div>
          </div>
        )}

        {/* --- CONTEÚDO COM SCROLL SUAVE --- */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32 scrollbar-thin scrollbar-thumb-gray-200">
          
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-300">
              <div className="p-4 rounded-2xl flex items-center gap-4 bg-gradient-to-r from-[#FFF8F6] to-white border border-[#FCE4DE]">
                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md bg-white overflow-hidden flex items-center justify-center shrink-0">
                   {professional.image ? <img src={professional.image} className="w-full h-full object-cover" /> : <span className="font-bold text-2xl" style={{ color: colors.primary }}>{professional.name.charAt(0)}</span>}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Profissional</p>
                  <p className="font-bold text-xl text-gray-800 leading-tight">{professional.name}</p>
                </div>
              </div>
              
              {availableServices.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <AlertCircle className="mx-auto mb-3 opacity-50" size={32}/>
                  <p>Nenhum serviço disponível.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">Selecione os serviços:</p>
                  {availableServices.map((svc, idx) => {
                    const isSelected = selectedServices.includes(svc);
                    return (
                      <button key={idx} onClick={() => toggleService(svc)} className={`w-full p-4 rounded-2xl border flex justify-between items-center transition-all duration-200 active:scale-[0.98] ${isSelected ? 'border-[#C68D7D] bg-[#FFF0F0] shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#C68D7D] border-[#C68D7D]' : 'border-gray-300'}`}>
                            {isSelected && <Check size={14} className="text-white"/>}
                          </div>
                          <div>
                            <p className={`font-bold text-base ${isSelected ? 'text-[#8A5A4E]' : 'text-gray-800'}`}>{svc.name}</p>
                            <p className="text-sm text-gray-500">{svc.duration}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                          {Number(svc.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 pt-2 animate-in slide-in-from-right-10 duration-300">
              <div>
                <label className="text-base font-bold text-gray-800 mb-4 block">Escolha o Dia</label>
                <input 
                  type="date" 
                  className="w-full p-5 bg-gray-50 rounded-2xl font-bold text-lg outline-none border border-transparent focus:border-[#C68D7D] focus:bg-white transition-all shadow-sm" 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  value={selectedDate}
                />
              </div>
              <div>
                <label className="text-base font-bold text-gray-800 mb-4 block">Escolha o Horário</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.map(time => (
                    <button 
                      key={time} 
                      onClick={() => setSelectedTime(time)} 
                      className={`py-4 rounded-xl text-base font-bold transition-all active:scale-95 shadow-sm ${selectedTime === time ? 'text-white shadow-md transform -translate-y-1' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`} 
                      style={{ backgroundColor: selectedTime === time ? colors.primary : undefined }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 pt-2 animate-in slide-in-from-right-10 duration-300">
              <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-3xl space-y-4 border border-gray-100 shadow-sm">
                <div className="space-y-3 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Resumo do Pedido</p>
                  {selectedServices.map((s, i) => (
                    <div key={i} className="flex justify-between text-gray-700">
                      <span>{s.name}</span>
                      <span className="font-medium">{Number(s.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Data e Hora</span>
                  <span className="font-bold bg-white px-2 py-1 rounded border shadow-sm">{selectedDate ? `${selectedDate.split('-').reverse().join('/')}` : '--/--'} às {selectedTime || '--:--'}</span>
                </div>
                <div className="pt-2 flex justify-between items-center">
                  <span className="font-bold text-xl text-gray-800">Total a pagar</span>
                  <span className="text-3xl font-bold" style={{ color: colors.primary }}>{formattedTotal}</span>
                </div>
              </div>
              
              <div>
                <p className="text-base font-bold text-gray-800 mb-4">Como deseja pagar?</p>
                <div className="space-y-3">
                  {paymentOptions.map((opt) => (
                    <button key={opt.id} onClick={() => setPaymentMethod(opt.id)} className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.98] ${paymentMethod === opt.id ? 'border-transparent bg-[#FFF0F0] shadow-sm ring-1 ring-[#C68D7D]' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                      <div className={`p-3 rounded-full ${paymentMethod === opt.id ? 'text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`} style={{ backgroundColor: paymentMethod === opt.id ? colors.primary : undefined }}>
                        <opt.icon size={20}/>
                      </div>
                      <span className={`font-bold ${paymentMethod === opt.id ? 'text-[#8A5A4E]' : 'text-gray-600'}`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center h-full py-10 animate-in zoom-in duration-500">
              <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
                <CheckCircle size={60} strokeWidth={2.5}/>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-3">Agendado!</h3>
              <p className="text-gray-500 text-center max-w-[250px] leading-relaxed">Seu horário foi reservado com sucesso. Enviamos um comprovante para você.</p>
            </div>
          )}
        </div>

        {/* --- FOOTER FIXO E SEGURO --- */}
        {step < 4 && (
          <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm border-t border-gray-100 p-6 z-20 pb-safe-area">
            {step === 1 && selectedServices.length > 0 && (
               <div className="flex justify-between items-center mb-4 animate-in slide-in-from-bottom-5">
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{selectedServices.length} serviço(s)</span>
                  <span className="text-xl font-bold text-gray-800">{formattedTotal}</span>
               </div>
            )}
            
            <button 
              onClick={step === 3 ? handleConfirmBooking : handleNextStep} 
              disabled={(step === 1 && selectedServices.length === 0) || (step === 2 && (!selectedDate || !selectedTime)) || (step === 3 && !paymentMethod) || isSubmitting} 
              className="w-full py-4 text-white font-bold text-lg rounded-2xl shadow-xl shadow-[#C68D7D]/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]" 
              style={{ backgroundColor: colors.primary }}
            >
              {isSubmitting ? (
                 <span className="flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processando...</span>
              ) : step === 3 ? 'Confirmar Agendamento' : 'Continuar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}