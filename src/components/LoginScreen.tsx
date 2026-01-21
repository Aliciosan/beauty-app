"use client";

import { useState, useRef } from 'react';
import { User, ShieldCheck, ArrowRight, Mail, Lock, ChevronLeft, Loader2, Smartphone, Check } from 'lucide-react';

// Tipos
type LoginScreenProps = {
  onLogin: (role: 'client' | 'manager', userData?: { name: string; email: string }) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTIMIZAÇÃO: Usamos useRef em vez de useState para os inputs.
  // Isso evita que a tela inteira (e o vídeo/blur) seja renderizada a cada letra digitada.
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  const handleRegister = () => {
    // Pegamos os valores apenas quando o botão é clicado
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    // Validação simples
    if (!name || !email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    
    // Simula envio para API
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin('client', { name, email });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F7D6D1] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Decorativo - Mantido Leve */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-white/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-copper-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Cartão Principal */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/60 z-10 animate-in zoom-in duration-500 relative overflow-hidden h-auto min-h-[600px] flex flex-col">
        
        {/* === TELA DE LOGIN === */}
        <div className={`flex flex-col h-full p-8 transition-transform duration-500 ease-in-out ${isRegistering ? '-translate-x-full absolute inset-0 opacity-0 pointer-events-none' : 'translate-x-0 relative opacity-100'}`}>
          
          {/* Logo / Vídeo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-60 h-32">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-contain"
              >
                <source src="/logo-animada.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Bem-vindo(a)</h2>
            <p className="text-sm text-gray-500 mt-1">Sua jornada de beleza começa aqui.</p>
          </div>

          <div className="space-y-4 flex-grow">
            <button 
              onClick={() => onLogin('client', { name: 'Samantha Teste', email: 'samantha@email.com' })}
              className="w-full group relative flex items-center p-4 bg-white border border-rose-100 rounded-2xl hover:border-copper-gold hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-copper-gold group-hover:bg-copper-gold group-hover:text-white transition-colors duration-300 shrink-0">
                <User size={22} strokeWidth={2.5} />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Sou Cliente</h3>
                <p className="text-xs text-gray-400">Entrar como convidado</p>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-copper-gold group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => onLogin('manager')}
              className="w-full group relative flex items-center p-4 bg-white border border-rose-100 rounded-2xl hover:border-gray-800 hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 group-hover:bg-gray-800 group-hover:text-white transition-colors duration-300 shrink-0">
                <ShieldCheck size={22} strokeWidth={2.5} />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-bold text-gray-800 text-sm md:text-base">Sou Gerente</h3>
                <p className="text-xs text-gray-400">Administração</p>
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-gray-800 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-3">Novo por aqui?</p>
            <button onClick={() => setIsRegistering(true)} className="w-full py-3 rounded-xl border-2 border-dashed border-copper-gold/50 text-copper-gold font-bold text-sm hover:bg-rose-50 transition-all">
              Criar Conta Gratuita
            </button>
          </div>
        </div>

        {/* === TELA DE CADASTRO === */}
        <div className={`absolute inset-0 bg-white z-20 flex flex-col p-8 transition-transform duration-500 ease-in-out ${isRegistering ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}>
          
          <button onClick={() => setIsRegistering(false)} className="self-start flex items-center gap-1 text-gray-400 hover:text-copper-gold mb-6 text-xs font-bold uppercase tracking-wide transition-colors">
            <ChevronLeft size={16} /> Voltar
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Criar Conta</h2>
            <p className="text-sm text-gray-500 mt-1">Preencha seus dados para começar.</p>
          </div>

          <div className="space-y-3 flex-grow overflow-y-auto scrollbar-hide">
             {/* Botões Sociais */}
            <div className="grid grid-cols-2 gap-3 mb-4 shrink-0">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition">
                <span className="text-lg font-serif">G</span> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition">
                <Smartphone size={16} /> Apple
                </button>
            </div>
            
            {/* Campo NOME (Com Ref) */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-copper-gold/50 focus-within:bg-white transition-all">
              <User size={18} className="text-gray-400 shrink-0" />
              <input 
                ref={nameRef}
                type="text" 
                placeholder="Nome Completo" 
                className="bg-transparent w-full text-sm outline-none text-gray-700 placeholder:text-gray-400" 
              />
            </div>

            {/* Campo EMAIL (Com Ref) */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-copper-gold/50 focus-within:bg-white transition-all">
              <Mail size={18} className="text-gray-400 shrink-0" />
              <input 
                ref={emailRef}
                type="email" 
                placeholder="Seu E-mail" 
                className="bg-transparent w-full text-sm outline-none text-gray-700 placeholder:text-gray-400" 
              />
            </div>

            {/* Campo SENHA (Com Ref) */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-transparent focus-within:border-copper-gold/50 focus-within:bg-white transition-all">
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input 
                ref={passRef}
                type="password" 
                placeholder="Senha" 
                className="bg-transparent w-full text-sm outline-none text-gray-700 placeholder:text-gray-400" 
              />
            </div>
            
            <div className="flex items-start gap-2 mt-2 px-1">
              <div className="relative flex items-center">
                <input type="checkbox" id="terms" className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-copper-gold checked:border-copper-gold transition-all" />
                <Check size={10} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <label htmlFor="terms" className="text-[10px] text-gray-500 leading-tight">
                Li e concordo com os <span className="text-copper-gold font-bold cursor-pointer hover:underline">Termos de Uso</span>.
              </label>
            </div>
          </div>

          <button 
            onClick={handleRegister}
            disabled={isSubmitting}
            className="w-full mt-4 bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-gray-200 hover:bg-copper-gold hover:shadow-copper-gold/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 shrink-0"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Cadastrar'}
          </button>
        </div>

      </div>
    </div>
  );
}