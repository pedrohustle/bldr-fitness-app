import React, { useState } from 'react';
import { 
  CameraIcon, 
  ChartBarIcon, 
  CalendarIcon,
  TrophyIcon,
  PlusIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressRing from '../components/UI/ProgressRing';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dados de exemplo para demonstração
  const userProfile = {
    workoutsCompleted: 15,
    currentStreak: 5,
    totalXP: 1250,
    weightGoal: 70
  };

  const [weightHistory] = useState([
    { date: '2024-01-01', weight: 75.5 },
    { date: '2024-01-15', weight: 74.8 },
    { date: '2024-02-01', weight: 74.2 },
    { date: '2024-02-15', weight: 73.9 },
    { date: '2024-03-01', weight: 73.5 }
  ]);
  
  const [measurements] = useState({
    chest: 95,
    waist: 82,
    hips: 98,
    bicep: 35,
    thigh: 58
  });
  
  const [personalRecords] = useState([
    { exercise: 'Supino Reto', weight: 80, reps: 8, date: '2024-02-20' },
    { exercise: 'Agachamento', weight: 100, reps: 10, date: '2024-02-18' },
    { exercise: 'Levantamento Terra', weight: 120, reps: 5, date: '2024-02-15' }
  ]);

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const initialWeight = weightHistory[0]?.weight || 0;
  const weightChange = currentWeight - initialWeight;
  const weightGoal = userProfile?.weightGoal || currentWeight;
  const weightProgress = Math.abs(weightChange / (weightGoal - initialWeight)) * 100;

  const TabButton = ({ id, label, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-yellow-500 text-gray-900'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Progress Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Progresso</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <ProgressRing 
              progress={Math.min(weightProgress, 100)} 
              size={80} 
              strokeWidth={8}
              color="#10b981"
            >
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{Math.round(weightProgress)}%</p>
                <p className="text-xs text-gray-600">Meta</p>
              </div>
            </ProgressRing>
            <p className="text-sm text-gray-600 mt-2">Progresso de Peso</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Peso Atual</p>
              <p className="text-2xl font-bold text-gray-900">{currentWeight} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mudança</p>
              <p className={`text-lg font-semibold ${
                weightChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {weightChange >= 0 ? '+' : ''}{weightChange.toFixed(1)} kg
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{userProfile?.workoutsCompleted || 0}</p>
            <p className="text-xs text-gray-600">Treinos Concluídos</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{userProfile?.currentStreak || 0}</p>
            <p className="text-xs text-gray-600">Dias Consecutivos</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xl font-bold text-gray-900">{personalRecords.length}</p>
            <p className="text-xs text-gray-600">Recordes Pessoais</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            icon={CameraIcon}
            className="h-20 flex-col"
          >
            <span className="text-sm">Foto de</span>
            <span className="text-sm">Progresso</span>
          </Button>
          <Button
            variant="outline"
            icon={ChartBarIcon}
            className="h-20 flex-col"
          >
            <span className="text-sm">Registrar</span>
            <span className="text-sm">Peso</span>
          </Button>
        </div>
      </Card>

      {/* Recent Progress Photos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Fotos de Progresso</h3>
          <Button variant="ghost" size="sm" icon={PlusIcon}>
            Adicionar
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <PhotoIcon className="w-8 h-8 text-gray-400" />
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 text-center mt-3">
          Adicione fotos para acompanhar sua transformação
        </p>
      </Card>
    </div>
  );

  const renderChartsTab = () => (
    <div className="space-y-6">
      {/* Weight Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução do Peso</h3>
        
        <div className="space-y-3">
          {weightHistory.map((entry, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm text-gray-600">
                {new Date(entry.date).toLocaleDateString('pt-BR')}
              </span>
              <span className="font-semibold text-gray-900">{entry.weight} kg</span>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4" icon={PlusIcon}>
          Adicionar Registro
        </Button>
      </Card>

      {/* Measurements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medidas Corporais</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Peito</span>
            <span className="font-semibold">{measurements.chest} cm</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Cintura</span>
            <span className="font-semibold">{measurements.waist} cm</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Quadril</span>
            <span className="font-semibold">{measurements.hips} cm</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Bíceps</span>
            <span className="font-semibold">{measurements.bicep} cm</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Coxa</span>
            <span className="font-semibold">{measurements.thigh} cm</span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full mt-4" icon={PlusIcon}>
          Atualizar Medidas
        </Button>
      </Card>
    </div>
  );

  const renderRecordsTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Recordes Pessoais</h3>
        <p className="text-gray-600">Seus melhores resultados nos exercícios</p>
      </div>
      
      {personalRecords.map((record, index) => (
        <Card key={index}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-gray-900" />
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{record.exercise}</h4>
              <p className="text-sm text-gray-600">
                {new Date(record.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{record.weight} kg</p>
              <p className="text-sm text-gray-600">{record.reps} reps</p>
            </div>
          </div>
        </Card>
      ))}
      
      <Button variant="outline" className="w-full" icon={PlusIcon}>
        Adicionar Recorde
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Progresso</h1>
        <p className="text-gray-300">Acompanhe sua evolução</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton id="overview" label="Visão Geral" isActive={activeTab === 'overview'} />
          <TabButton id="charts" label="Gráficos" isActive={activeTab === 'charts'} />
          <TabButton id="records" label="Recordes" isActive={activeTab === 'records'} />
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'charts' && renderChartsTab()}
        {activeTab === 'records' && renderRecordsTab()}
      </div>
    </div>
  );
};

export default Progress;

