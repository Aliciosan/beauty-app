import { Scissors, PenTool, Smile, Palette, Droplets, Sparkles, Heart, Crown } from 'lucide-react';

export const CATEGORIES = [
  { id: 'cabelo', name: 'Cabelo', icon: Scissors },
  { id: 'unhas', name: 'Unhas', icon: PenTool },
  { id: 'facial', name: 'Facial', icon: Smile },
  { id: 'coloracao', name: 'Coloração', icon: Palette },
  { id: 'spa', name: 'Spa', icon: Droplets },
  { id: 'depilacao', name: 'Depilação', icon: Sparkles },
  { id: 'make', name: 'Make', icon: Heart },
  { id: 'vip', name: 'VIP', icon: Crown },
];

// MUDANÇA: Agora são PROFISSIONAIS com especialidades
export const PROFESSIONALS = [
  { id: 1, name: 'Ana Clara', specialty: 'Especialista em Mechas', image: 'https://i.pravatar.cc/150?img=5', rating: 4.9, distance: '1.2km' },
  { id: 2, name: 'Carlos Edu', specialty: 'Cortes Modernos', image: 'https://i.pravatar.cc/150?img=11', rating: 5.0, distance: '0.8km' },
  { id: 3, name: 'Mariana Beauty', specialty: 'Nail Designer', image: 'https://i.pravatar.cc/150?img=9', rating: 4.8, distance: '2.5km' },
  { id: 4, name: 'Dra. Julia', specialty: 'Harmonização Facial', image: 'https://i.pravatar.cc/150?img=24', rating: 4.9, distance: '3.0km' },
  { id: 5, name: 'Sofi Makeup', specialty: 'Maquiagem Social', image: 'https://i.pravatar.cc/150?img=32', rating: 4.7, distance: '1.0km' },
  { id: 6, name: 'Lúcia Spa', specialty: 'Massoterapia', image: 'https://i.pravatar.cc/150?img=20', rating: 5.0, distance: '4.2km' },
];

export const APPOINTMENTS = [
  { id: 1, salon: 'Ana Clara', service: 'Mechas e Matização', date: 'Hoje, 14:00', status: 'Confirmado' },
  { id: 2, salon: 'Mariana Beauty', service: 'Manicure Gel', date: 'Amanhã, 10:00', status: 'Pendente' },
];