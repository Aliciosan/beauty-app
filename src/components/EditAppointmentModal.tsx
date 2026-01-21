"use client";

import { useState } from 'react';
import { X, Calendar, Clock, Save, Trash2 } from 'lucide-react';

type Appointment = {
  id: number;
  salon: string;
  service: string;
  date: string;
  status: string;
};

type EditModalProps = {
  appointment: Appointment;
  onClose: () => void;
  onSave: (id: number, newData: Partial<Appointment>) => void;
};

export default function EditAppointmentModal({ appointment, onClose, onSave }: EditModalProps) {
  const [date, setDate] = useState(appointment.date);
  const [service, setService] = useState(appointment.service);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simula delay de rede
    setTimeout(() => {
      onSave(appointment.id, { date, service });
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-sm mx-4 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Editar Agendamento</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Info do Profissional (Fixo) */}
          <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
            <p className="text-xs text-gray-500 font-bold uppercase">Profissional</p>
            <p className="font-bold text-copper-gold-dark">{appointment.salon}</p>
          </div>

          {/* Editar Serviço */}
          <div>
            <label className="text-sm font-bold text-gray-600 ml-1 block mb-1">Serviço</label>
            <input 
              type="text" 
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-copper-gold outline-none text-gray-700 font-medium"
            />
          </div>

          {/* Editar Data/Horário */}
          <div>
            <label className="text-sm font-bold text-gray-600 ml-1 block mb-1">Data e Horário</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-copper-gold transition-colors">
              <Calendar size={18} className="text-gray-400" />
              <input 
                type="text" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 font-medium"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 ml-1">Ex: Hoje, 15:30 ou Amanhã, 09:00</p>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-2 py-3.5 bg-copper-gold text-white font-bold rounded-xl shadow-lg shadow-copper-gold/20 hover:bg-copper-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>
      </div>
    </div>
  );
}