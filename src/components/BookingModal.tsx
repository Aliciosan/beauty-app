"use client";

import { useState } from 'react';
import { 
  X, Calendar, Clock, CheckCircle, ChevronLeft, 
  CreditCard, DollarSign, Smartphone, AlertCircle, Check 
} from 'lucide-react';
import { Professional, Service } from '../types';;

// Paleta de Cores
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

  // Soma segura dos valores
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
    // Verifica por referência de objeto para evitar erros
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
      // Cria resumo dos serviços selecionados
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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full sm:max-w-md h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-[30px] sm:rounded-[20px] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-50 shrink-0 bg-white z-20">
          <div className="flex items-center gap-2">
            {step > 1 && step < 4 && (
              <button onClick={handlePrevStep} className="p-2 -ml-2 text-gray-400 hover:text-gray-800 rounded-full">
                <ChevronLeft size={24} />
              </button>
            )}
            <h3 className="text-lg font-bold text-gray-800">
              {step === 1 && "Selecione os Serviços"}
              {step === 2 && "Data e Hora"}
              {step === 3 && "Pagamento"}
              {step === 4 && "Confirmado!"}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"><X size={20}/></button>
        </div>

        {/* PROGRESSO */}
        {step < 4 && (
          <div className="h-1 w-full bg-gray-100">
            <div className="h-full transition-all duration-500" style={{ width: `${step * 33.3}%`, backgroundColor: colors.primary }}></div>
          </div>
        )}

        {/* CONTEÚDO */}
        <div className="flex-grow overflow-y-auto scrollbar-hide px-6 pb-40">
          {step === 1 && (
            <div className="space-y-6 pt-6">
              <div className="p-4 rounded-xl flex items-center gap-4 border border-[#FCE4DE]" style={{ backgroundColor: colors.selectedBg }}>
                <div className="w-14 h-14 rounded-full border-2 border-white shadow-sm bg-white overflow-hidden flex items-center justify-center shrink-0">
                   {professional.image ? <img src={professional.image} className="w-full h-full object-cover" /> : <span className="font-bold text-xl" style={{ color: colors.primary }}>{professional.name.charAt(0)}</span>}
                </div>
                <div><p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">PROFISSIONAL</p><p className="font-bold text-lg" style={{ color: colors.textDark }}>{professional.name}</p></div>
              </div>
              
              {availableServices.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                  <AlertCircle className="mx-auto mb-2 opacity-50"/><p>Sem serviços.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 font-bold uppercase ml-1">Toque para adicionar:</p>
                  {availableServices.map((svc, idx) => {
                    const isSelected = selectedServices.includes(svc);
                    return (
                      <button key={idx} onClick={() => toggleService(svc)} className={`w-full p-4 rounded-2xl border-2 flex justify-between items-center transition-all duration-200 ${isSelected ? 'border-[#C68D7D] bg-[#FFF0F0]' : 'border-gray-100 bg-white'}`}>
                        <div className="flex items-center gap-3 text-left">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-[#C68D7D] border-[#C68D7D]' : 'border-gray-300'}`}>{isSelected && <Check size={12} className="text-white"/>}</div>
                          <div><p className={`font-bold ${isSelected ? 'text-[#8A5A4E]' : 'text-gray-800'}`}>{svc.name}</p><p className="text-xs text-gray-500">{svc.duration}</p></div>
                        </div>
                        <span className="font-bold text-gray-700">{Number(svc.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 pt-6">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">Data</label>
                <input type="date" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2" style={{ '--tw-ring-color': colors.primary } as any} onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate}/>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">Horário</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map(time => (
                    <button key={time} onClick={() => setSelectedTime(time)} className={`py-3 rounded-lg text-sm font-bold transition-all ${selectedTime === time ? 'text-white' : 'bg-white border border-gray-200 text-gray-600'}`} style={{ backgroundColor: selectedTime === time ? colors.primary : undefined }}>{time}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 pt-6">
              <div className="bg-gray-50 p-5 rounded-2xl space-y-3 border border-dashed border-gray-200">
                <div className="pb-3 border-b border-gray-200 mb-2 space-y-2">
                  <p className="text-xs text-gray-400 font-bold uppercase">Resumo</p>
                  {selectedServices.map((s, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">{s.name}</span>
                      <span className="font-medium">{Number(s.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Data</span><span className="font-medium">{selectedDate} às {selectedTime}</span></div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-800">Total</span>
                  <span className="text-2xl font-bold" style={{ color: colors.primary }}>{formattedTotal}</span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-700 mt-4">Forma de Pagamento</p>
              <div className="space-y-2">
                {paymentOptions.map((opt) => (
                  <button key={opt.id} onClick={() => setPaymentMethod(opt.id)} className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === opt.id ? 'border-transparent bg-[#FFF0F0]' : 'border-gray-100'}`}>
                    <div className={`p-2 rounded-full ${paymentMethod === opt.id ? 'text-white' : 'bg-gray-200'}`} style={{ backgroundColor: paymentMethod === opt.id ? colors.primary : undefined }}><opt.icon size={20}/></div>
                    <span className="font-medium text-gray-700">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-12 animate-in zoom-in">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 mx-auto"><CheckCircle size={50} strokeWidth={2.5}/></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Confirmado!</h3>
              <p className="text-gray-500 mb-8 px-4 text-sm">Agendamento realizado com sucesso.</p>
              <button onClick={onClose} className="w-full py-4 text-white font-bold rounded-xl shadow-lg" style={{ backgroundColor: colors.textDark }}>Concluir</button>
            </div>
          )}
        </div>

        {/* FOOTER FIXO */}
        {step < 4 && (
          <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100 p-6 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[20px]">
            {step === 1 && (
               <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-gray-400">{selectedServices.length} serviços</span>
                  <span className="text-xl font-bold text-gray-800">Total: <span style={{ color: colors.primary }}>{formattedTotal}</span></span>
               </div>
            )}
            <button 
              onClick={step === 3 ? handleConfirmBooking : handleNextStep} 
              disabled={(step === 1 && selectedServices.length === 0) || (step === 2 && (!selectedDate || !selectedTime)) || (step === 3 && !paymentMethod) || isSubmitting} 
              className="w-full py-4 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all text-lg" 
              style={{ backgroundColor: colors.primary }}
            >
              {isSubmitting ? 'Confirmando...' : step === 3 ? 'Confirmar Agendamento' : 'Continuar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
