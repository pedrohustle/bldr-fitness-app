import React, { useState, useEffect } from 'react';
import { 
  FireIcon, 
  CakeIcon, 
  BeakerIcon,
  PlayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressRing from '../components/UI/ProgressRing';
import { MOTIVATIONAL_QUOTES } from '../utils/constants';

const Dashboard = () => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [waterIntake, setWaterIntake] = useState(1200); // ml
  const [dailyGoals, setDailyGoals] = useState({
    workout: false,
    meals: 3,
    mealsCompleted: 1
  });

  useEffect(() => {
    // Seleciona uma frase motivacional aleatória
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);
  }, []);

  const waterProgress = (waterIntake / 2500) * 100;
  const mealProgress = (dailyGoals.mealsCompleted / dailyGoals.meals) * 100;

  const addWater = (amount) => {
    setWaterIntake(prev => Math.min(prev + amount, 2500));
  };

  const markMealCompleted = () => {
    setDailyGoals(prev => ({
      ...prev,
      mealsCompleted: Math.min(prev.mealsCompleted + 1, prev.meals)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">BLDR</h1>
            <p className="text-gray-300">Construa seu melhor eu</p>
          </div>
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-gray-900 font-bold text-lg">U</span>
          </div>
        </div>
        
        {/* Frase motivacional */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
          <p className="text-center text-yellow-300 font-medium italic">
            "{currentQuote}"
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Resumo do dia */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Resumo do Dia</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Treino */}
            <div className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                dailyGoals.workout ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <FireIcon className="w-6 h-6" />
              </div>
              <p className="text-xs text-gray-600">Treino</p>
              <p className={`text-sm font-semibold ${
                dailyGoals.workout ? 'text-green-600' : 'text-gray-400'
              }`}>
                {dailyGoals.workout ? 'Concluído' : 'Pendente'}
              </p>
            </div>

            {/* Refeições */}
            <div className="text-center">
              <ProgressRing 
                progress={mealProgress} 
                size={48} 
                strokeWidth={4}
                color="#10b981"
              >
                <CakeIcon className="w-5 h-5 text-green-600" />
              </ProgressRing>
              <p className="text-xs text-gray-600 mt-2">Refeições</p>
              <p className="text-sm font-semibold text-gray-900">
                {dailyGoals.mealsCompleted}/{dailyGoals.meals}
              </p>
            </div>

            {/* Hidratação */}
            <div className="text-center">
              <ProgressRing 
                progress={waterProgress} 
                size={48} 
                strokeWidth={4}
                color="#3b82f6"
              >
                <BeakerIcon className="w-5 h-5 text-blue-600" />
              </ProgressRing>
              <p className="text-xs text-gray-600 mt-2">Água</p>
              <p className="text-sm font-semibold text-gray-900">
                {waterIntake}ml
              </p>
            </div>
          </div>
        </Card>

        {/* Ações rápidas */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          
          <div className="space-y-3">
            <Button 
              variant="primary" 
              className="w-full"
              icon={PlayIcon}
              onClick={() => setDailyGoals(prev => ({ ...prev, workout: true }))}
            >
              Começar Treino
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              icon={EyeIcon}
            >
              Ver Dieta do Dia
            </Button>
          </div>
        </Card>

        {/* Hidratação */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hidratação</h3>
            <ProgressRing 
              progress={waterProgress} 
              size={60} 
              strokeWidth={6}
              color="#3b82f6"
            >
              <span className="text-xs font-bold text-blue-600">
                {Math.round(waterProgress)}%
              </span>
            </ProgressRing>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">{waterIntake}ml / 2500ml</span>
            <span className="text-sm text-gray-500">Meta diária</span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => addWater(250)}
              className="flex-1"
            >
              +250ml
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => addWater(500)}
              className="flex-1"
            >
              +500ml
            </Button>
          </div>
        </Card>

        {/* Progresso semanal */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Esta Semana</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-sm text-gray-600">Treinos</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-gray-600">Consistência</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

