"use client";

import { MapPin, Navigation, Star, Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Novos tipos para as props
type Address = {
  street: string;
  number: string;
  city: string;
  zip: string;
};

type ExploreScreenProps = {
  professionals: any[];
  address: Address;     // <--- NOVO: Recebe endereço
  gallery: string[];    // <--- NOVO: Recebe fotos da galeria
};

export default function ExploreScreen({ professionals, address, gallery }: ExploreScreenProps) {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  const featuredProfessional = professionals.length > 0 ? professionals[0] : null;

  // Monta o endereço completo para o Google Maps
  const fullAddress = `${address.street}, ${address.number} - ${address.city}`;
  // URL segura para embed do Google Maps (sem API Key necessária para iframe simples)
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // Define qual profissional está ativo (selecionado ou destaque)
  const activeProf = selectedPin 
    ? professionals.find(p => p.id === selectedPin) 
    : featuredProfessional;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* Barra de Busca */}
      <div className="relative z-20 px-1 mb-4">
        <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-3">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar especialista..." 
            className="flex-grow outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
          <button className="bg-[#C68D7D] p-2 rounded-xl text-white">
            <Navigation size={18} />
          </button>
        </div>
      </div>

      {/* --- MAPA DO GOOGLE DINÂMICO --- */}
      <div className="relative w-full h-[400px] rounded-[30px] overflow-hidden shadow-xl border border-white/50 mb-8 bg-gray-100">
        
        {/* IFRAME DO GOOGLE MAPS */}
        <iframe 
          width="100%" 
          height="100%" 
          src={googleMapsEmbedUrl}
          title="Google Maps Location"
          style={{ border: 0, filter: 'grayscale(20%) contrast(1.2)' }} // Estilo visual mais elegante
          allowFullScreen
          loading="lazy"
        ></iframe>

        {/* Card Flutuante com Endereço */}
        <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/50 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-full text-[#C68D7D]">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Localização Atual</p>
              <p className="text-sm font-bold text-gray-800 leading-tight">{fullAddress}</p>
            </div>
          </div>
        </div>

        {/* Card Flutuante de Profissional (Overlay no Mapa) */}
        {activeProf && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50">
            <div className="flex items-center gap-3">
              
              {/* --- CORREÇÃO AQUI: Lógica segura para imagem --- */}
              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-200 flex items-center justify-center">
                {activeProf.image && activeProf.image !== "" ? (
                  <Image 
                    src={activeProf.image} 
                    alt="Avatar" 
                    fill 
                    className="object-cover" 
                  />
                ) : (
                  <span className="text-lg font-bold text-[#C68D7D]">
                    {activeProf.name ? activeProf.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </div>
              {/* ----------------------------------------------- */}

              <div>
                <h4 className="font-bold text-gray-800 text-sm">
                  {activeProf.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {activeProf.specialty || "Especialista Dellas"}
                </p>
              </div>
              <div className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                Aberto
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- GALERIA DE FOTOS DINÂMICA --- */}
      <div className="px-1">
        <div className="flex justify-between items-end mb-4 px-2">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-[#8A5A4E]">Conheça o Espaço</h3>
            <p className="text-xs text-gray-500">Fotos reais do nosso ambiente</p>
          </div>
        </div>

        {/* Carrossel de Fotos */}
        {gallery && gallery.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 pb-4 px-1 scrollbar-hide">
            {gallery.map((photo, index) => (
              <div key={index} className="relative min-w-[240px] h-[160px] rounded-2xl overflow-hidden shadow-md group cursor-pointer bg-gray-100">
                {/* Verifica se a URL da foto existe antes de renderizar */}
                {photo ? (
                  <img 
                    src={photo} 
                    alt={`Foto do espaço ${index}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">Sem Foto</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium flex items-center gap-1">
                    <Star size={12} fill="currentColor" className="text-yellow-400" /> Ambiente Premium
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 mx-2">
            <ImageIcon className="text-gray-300 mb-2" size={32} />
            <p className="text-xs text-gray-400">Nenhuma foto adicionada à galeria.</p>
          </div>
        )}
      </div>

    </div>
  );
}