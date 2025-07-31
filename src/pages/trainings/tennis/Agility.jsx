import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const initialExercises = [
  {
    name: 'Drills de deslocamento lateral',
    key: 'drills',
    description: 'Melhora sua capacidade de se mover lateralmente rápido e eficiente.',
  },
  {
    name: 'Exercícios com escada de agilidade',
    key: 'escada',
    description: 'Trabalha coordenação, rapidez dos pés e precisão nos movimentos.',
  },
  {
    name: 'Corrida em ziguezague',
    key: 'zigzag',
    description: 'Desenvolve mudanças rápidas de direção e resistência cardiovascular.',
  },
  {
    name: 'Saltos explosivos',
    key: 'jump',
    description: 'Fortalece pernas e melhora a capacidade de explosão muscular.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.04 },
  tap: { scale: 0.98 },
};

export default function Agility() {
  const navigate = useNavigate();
  const [subExercises, setSubExercises] = useState([]);
  const [activeKey, setActiveKey] = useState(null);

  const handleClick = async (key) => {
    if (key === activeKey) {
      // Se clicar de novo no mesmo, fecha (toggle off)
      setActiveKey(null);
      setSubExercises([]);
      return;
    }

    setActiveKey(key);

    try {
      const module = await import(`../../../data/agility/${key}.js`);
      setSubExercises(module[key] || []);
    } catch (err) {
      console.error('Erro ao carregar exercícios:', err);
      setSubExercises([]);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 font-montserrat p-6 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        className="max-w-3xl w-full bg-black/60 backdrop-blur-sm rounded-xl shadow-lg p-12 text-white relative"
      >
        {/* Imagem decorativa */}
        <div className="absolute top-6 right-6 opacity-20 select-none pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline-block"
          >
            <circle cx="40" cy="40" r="38" />
            <path d="M20 40h40M40 20v40" />
            <path d="M25 30l30 20" />
            <path d="M55 30l-30 20" />
          </svg>
        </div>

        {/* Título */}
        <h1
          className="text-yellow-400 text-4xl font-bold mb-4 border-b-2 border-yellow-400 pb-3 flex items-center gap-3"
          style={{ textShadow: '0 0 8px #d4af37' }}
        >
          Treino de Agilidade - Tênis
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </h1>

        {/* Intro */}
        <p className="mb-10 text-zinc-300 leading-relaxed italic">
          Este treino é focado em exercícios{' '}
          <span className="uppercase font-semibold text-yellow-400">rápidos</span>{' '}
          para melhorar a{' '}
          <span className="font-semibold text-yellow-400">velocidade</span> e{' '}
          <span className="font-semibold text-yellow-400">reação</span> em quadra.
        </p>

        {/* Lista de categorias */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 relative pl-8 border-l-4 border-yellow-400"
        >
          {initialExercises.map(({ name, description, key }) => (
            <motion.li
              key={key}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleClick(key)}
              className="mb-6 relative flex items-center gap-3 cursor-pointer group select-none transition-transform duration-150 ease-in-out"
            >
              <span className="flex-shrink-0 text-yellow-400 text-xl leading-none transition-transform group-hover:scale-125">
                ⚡
              </span>
              <span className="text-zinc-300 font-medium">{name}</span>
              <div className="absolute left-full top-1/2 ml-4 -translate-y-1/2 w-64 rounded-md bg-yellow-500 bg-opacity-90 p-3 text-black text-sm font-semibold shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10">
                {description}
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Sub-exercícios */}
        {activeKey && subExercises.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl text-[#ffd700] font-montserrat">Exercícios:</h2>
            <ul className="space-y-2">
              {subExercises.map((ex) => {
                const [series, time] = ex.format ? ex.format.split(' de ') : [null, null];
                return (
                  <li key={ex.id} className="bg-zinc-800 p-4 rounded-md text-zinc-200">
                    <p className="font-bold text-yellow-400">{ex.name}</p>
                    <p className="text-sm text-zinc-400">{ex.description}</p>
                    <div className="flex justify-center gap-8 mt-4 text-zinc-200">
                      <div className="text-center">
                        <ClockIcon className="mx-auto w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-semibold">{time || '20s'}</span>
                      </div>
                      <div className="text-center">
                        <Squares2X2Icon className="mx-auto w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-semibold">{series || '3 séries'}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Botão voltar */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={() => navigate(-1)}
            variant='outline'
          >
            Voltar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
