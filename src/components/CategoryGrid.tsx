import { Scissors, Palette, Sparkles, Smile, PenTool, Droplets } from 'lucide-react';

const categories = [
  { name: 'Corte', icon: Scissors },
  { name: 'Unhas', icon: PenTool }, // Usando PenTool como placeholder para unhas
  { name: 'Facial', icon: Smile },
  { name: 'Coloração', icon: Palette },
  { name: 'Spa', icon: Droplets },
  { name: 'Depilação', icon: Sparkles },
  { name: 'Make', icon: Smile }, // Repetindo ícone por simplicidade
  { name: 'Massagem', icon: Sparkles },
];

export default function CategoryGrid() {
  return (
    <div className="px-6 py-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">O que deseja fazer?</h3>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 hover:bg-teal-100 cursor-pointer transition">
              <cat.icon size={24} strokeWidth={1.5} />
            </div>
            <span className="text-xs text-teal-800 font-medium">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}