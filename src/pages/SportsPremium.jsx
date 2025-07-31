// src/pages/SportsPremium.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const sports = [
  {
    name: 'Tênis',
    slug: 'tenis',
    image: '/images/sports/tennis.jpg',
    description: 'Potência, agilidade e prevenção de lesões.',
  },
  {
    name: 'Padel',
    slug: 'padel',
    image: '/images/sports/padel.jpg',
    description: 'Explosão, controle e resistência em quadra.',
  },
  {
    name: 'Corrida',
    slug: 'corrida',
    image: '/images/sports/corrida.jpg',
    description: 'Postura, força de perna e respiração.',
  },
  {
    name: 'Yoga',
    slug: 'yoga',
    image: '/images/sports/yoga.jpg',
    description: 'Mobilidade, equilíbrio e respiração consciente.',
  },
  {
    name: 'Pilates',
    slug: 'pilates',
    image: '/images/sports/pilates.jpg',
    description: 'Controle corporal e fortalecimento funcional.',
  },
];

export default function SportsPremium() {
  const { userProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!userProfile?.isPremium) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-yellow-400 text-center p-6 overflow-hidden font-montserrat">
        <video
          className="fixed top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          src="/videos/tennis.bg.mp4"
        />
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-10" />
        <div className="relative z-20 max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Acesso PREMIUM</h2>
          <p className="mb-6 text-lg">
            Esta área é exclusiva para membros BLDR PREMIUM.
          </p>
          <Button
            className="bg-black border text-white px-4 py-2 rounded-full w-full hover:text-black"
            style={{ borderColor: '#d4af37' }}
            onClick={() => navigate('/checkout')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4af37'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'black'}
            onMouseDown={e => e.currentTarget.style.backgroundColor = '#d4af37'}
            onMouseUp={e => e.currentTarget.style.backgroundColor = '#d4af37'}
          >
            Quero me tornar premium
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-montserrat">
      <h1 className="text-3xl font-montserrat font-bold text-center mb-6 text-yellow-500">Esportes - BLDR</h1>
      <p className="text-center mb-10 text-zinc-300">
        Escolha seu esporte e potencialize seu desempenho com treinos personalizados.
      </p>

      {/* Scroll horizontal com flex */}
      <div className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-transparent">
        {sports.map((sport) => (
          <Card
            key={sport.slug}
            className="min-w-[280px] bg-zinc-800 rounded-2xl overflow-hidden border-yellow-400 shadow-lg hover:shadow-yellow-500/80 transition"
          >
            <img
              src={sport.image}
              alt={sport.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-4 flex flex-col items-center text-center">
              <h2 className="text-xl font-bold font-montserrat text-yellow-400 mb-2">{sport.name}</h2>
              <p className="text-zinc-300 mb-4">{sport.description}</p>
              <Button
                onClick={() => navigate(`/sports/${sport.slug}`)}
                variant="outline"
              >
                Ver treinos
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
