import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  FireIcon, 
  StarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';

const Achievement = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'workout':
        return FireIcon;
      case 'streak':
        return StarIcon;
      default:
        return TrophyIcon;
    }
  };

  const getAchievementColor = (type) => {
    switch (type) {
      case 'workout':
        return 'text-orange-500';
      case 'streak':
        return 'text-yellow-500';
      default:
        return 'text-purple-500';
    }
  };

  const IconComponent = getAchievementIcon(achievement.type);
  const iconColor = getAchievementColor(achievement.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl w-full max-w-sm transform transition-all duration-500 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="relative p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <IconComponent className={`w-10 h-10 text-white`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Conquista Desbloqueada!
            </h2>
          </div>
        </div>

        {/* Achievement Details */}
        <div className="px-6 pb-6">
          <Card className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {achievement.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {achievement.description}
            </p>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl font-bold text-yellow-500">
                +{achievement.points}
              </span>
              <span className="text-sm text-gray-600">pontos XP</span>
            </div>

            <div className="flex justify-center">
              <div className="flex">
                {Array.from({ length: achievement.rarity || 3 }, (_, i) => (
                  <StarIcon 
                    key={i} 
                    className="w-5 h-5 text-yellow-400 fill-current" 
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Action Button */}
        <div className="px-6 pb-6">
          <Button
            variant="primary"
            onClick={onClose}
            className="w-full"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Componente para exibir conquistas disponíveis
export const AchievementsList = ({ achievements, userProgress }) => {
  return (
    <div className="space-y-3">
      {achievements.map(achievement => {
        const isUnlocked = userProgress.unlockedAchievements?.includes(achievement.id);
        const progress = userProgress[achievement.progressKey] || 0;
        const progressPercentage = Math.min((progress / achievement.target) * 100, 100);
        
        return (
          <Card key={achievement.id} className={`p-4 ${isUnlocked ? 'bg-green-50 border-green-200' : ''}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isUnlocked ? 'bg-green-500' : 'bg-gray-200'
              }`}>
                <TrophyIcon className={`w-6 h-6 ${
                  isUnlocked ? 'text-white' : 'text-gray-400'
                }`} />
              </div>
              
              <div className="flex-1">
                <h4 className={`font-semibold ${isUnlocked ? 'text-green-800' : 'text-gray-900'}`}>
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {achievement.description}
                </p>
                
                {!isUnlocked && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Progresso</span>
                      <span>{progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm font-bold text-yellow-600">
                  +{achievement.points} XP
                </p>
                {isUnlocked && (
                  <p className="text-xs text-green-600">Desbloqueada!</p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Achievement;

