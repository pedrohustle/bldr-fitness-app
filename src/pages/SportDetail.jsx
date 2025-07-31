// src/pages/SportDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { sportsWorkouts } from '../data/sportsWorkouts';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function SportDetail() {
  const { sportName } = useParams();
  const workouts = sportsWorkouts[sportName?.toLowerCase()];

  if (!workouts) {
    return (
      <div className="text-center text-white mt-20">
        <h2 className="text-2xl font-bold">Esporte não encontrado.</h2>
        <Link to="/premium">
          <Button className="mt-6 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl">
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-montserrat">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4 capitalize">{sportName}</h1>
      <p className="text-zinc-300 mb-6">Treinos exclusivos para melhorar sua performance no {sportName}.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => (
          <Card key={workout.id} className="bg-zinc-800 rounded-2xl p-4 shadow-md">
            <h3 className="text-xl font-bold mb-2 text-yellow-300">{workout.title}</h3>
            <p className="text-sm text-zinc-400 mb-1">Duração: {workout.duration}</p>
            <p className="text-sm text-zinc-400 mb-3">Nível: {workout.level}</p>
            <Button
              className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl"
              onClick={() => alert(`Iniciar treino: ${workout.title}`)}
            >
              Iniciar Treino
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
