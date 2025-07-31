// src/pages/sports/Tennis.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function Tennis() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-montserrat p-6">
      <h1 className="text-4xl font-bold text-[#d4af37] mb-6 text-center">
        🎾
      </h1>
      <p className="text-zinc-300 max-w-3xl mx-auto mb-10 text-center">
        Potencialize sua potência, agilidade e previna lesões com treinos focados no tênis.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="bg-zinc-800 rounded-xl p-5 shadow-lg hover:shadow-yellow-500/90 transition">
          <h2 className="text-xl font-montserrat text-center text-[#d4af37] font-bold mb-2">Treino de Agilidade</h2>
          <p className="text-zinc-300 mb-4 text-center">
            Exercícios rápidos para melhorar a velocidade e reação em quadra.
          </p>
          <Button
            onClick={() => navigate('/trainings/tennis/agility')}
            variant='outline'
          >
            Ver treino
          </Button>
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 shadow-lg hover:shadow-yellow-500/90 transition">
          <h2 className="text-xl font-montserrat text-center text-[#ffd700] font-bold mb-2">Treino de Potência</h2>
          <p className="text-zinc-300 mb-4 text-center">
            Fortaleça seus músculos para golpes mais potentes.
          </p>
          <Button
            onClick={() => navigate('/trainings/tennis/power')}
            variant='outline'
          >
            Ver treino
          </Button>
        </div>
      </div>
    </div>
  );
}
