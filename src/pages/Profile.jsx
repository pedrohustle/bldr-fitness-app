import React, { useState } from 'react';
import { 
  UserIcon, 
  CogIcon, 
  TrophyIcon,
  FireIcon,
  CalendarIcon,
  ScaleIcon,
  CameraIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProgressRing from '../components/UI/ProgressRing';
import { AchievementsList } from '../components/Gamification/Achievement';
import { achievements, getUserLevel, getXPToNextLevel } from '../data/achievements';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Dados de exemplo para demonstração
  const userProfile = {
    displayName: 'João Silva',
    email: 'joao@exemplo.com',
    age: 28,
    weight: 75.5,
    height: 175,
    fitnessGoal: 'hipertrofia',
    activityLevel: 'moderado',
    biotipo: 'mesomorfo',
    workoutsCompleted: 15,
    currentStreak: 5,
    totalXP: 1250,
    unlockedAchievements: ['first_workout', 'workouts_10']
  };

  const [editData, setEditData] = useState({
    displayName: userProfile?.displayName || '',
    age: userProfile?.age || '',
    weight: userProfile?.weight || '',
    height: userProfile?.height || '',
    fitnessGoal: userProfile?.fitnessGoal || '',
    activityLevel: userProfile?.activityLevel || '',
    biotipo: userProfile?.biotipo || ''
  });

  const userLevel = getUserLevel(userProfile?.totalXP || 0);
  const xpToNext = getXPToNextLevel(userProfile?.totalXP || 0);
  const levelProgress = userLevel ? ((userProfile?.totalXP || 0) - userLevel.minXP) / (userLevel.maxXP - userLevel.minXP) * 100 : 0;

  const handleSaveProfile = async () => {
    // Simular salvamento
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* User Info */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-gray-900" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {userProfile?.displayName || 'Usuário'}
            </h2>
            <p className="text-gray-600">{userProfile?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <TrophyIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">
                {userLevel?.title} - Nível {userLevel?.level}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            icon={CogIcon}
          >
            {isEditing ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso do Nível</span>
            <span className="text-sm text-gray-600">
              {xpToNext > 0 ? `${xpToNext} XP para próximo nível` : 'Nível máximo!'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(levelProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{userProfile?.workoutsCompleted || 0}</p>
            <p className="text-sm text-gray-600">Treinos</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{userProfile?.currentStreak || 0}</p>
            <p className="text-sm text-gray-600">Sequência</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">{userProfile?.totalXP || 0}</p>
            <p className="text-sm text-gray-600">XP Total</p>
          </div>
        </div>
      </Card>

      {/* Profile Details */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
              <input
                type="text"
                name="displayName"
                value={editData.displayName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                <input
                  type="number"
                  name="age"
                  value={editData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={editData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  step="0.1"
                />
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleSaveProfile}
              className="w-full"
            >
              Salvar Alterações
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Idade</span>
              <span className="font-medium">{userProfile?.age || 'Não informado'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Peso</span>
              <span className="font-medium">{userProfile?.weight ? `${userProfile.weight} kg` : 'Não informado'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Altura</span>
              <span className="font-medium">{userProfile?.height ? `${userProfile.height} cm` : 'Não informado'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Objetivo</span>
              <span className="font-medium">{userProfile?.fitnessGoal || 'Não definido'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Biotipo</span>
              <span className="font-medium">{userProfile?.biotipo || 'Não definido'}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Suas Conquistas</h3>
        <p className="text-gray-600">
          {userProfile?.unlockedAchievements?.length || 0} de {achievements.length} desbloqueadas
        </p>
      </div>
      
      <AchievementsList 
        achievements={achievements} 
        userProgress={userProfile || {}} 
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-b-3xl">
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-gray-300">Gerencie sua conta e progresso</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton id="profile" label="Perfil" isActive={activeTab === 'profile'} />
          <TabButton id="achievements" label="Conquistas" isActive={activeTab === 'achievements'} />
        </div>

        {/* Content */}
        {activeTab === 'profile' ? renderProfileTab() : renderAchievementsTab()}
      </div>
    </div>
  );
};

export default Profile;

