import React from 'react';
import { 
  HomeIcon, 
  FireIcon, 
  CakeIcon, 
  ChartBarIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { 
  HomeIcon as HomeIconSolid, 
  FireIcon as FireIconSolid, 
  CakeIcon as CakeIconSolid, 
  ChartBarIcon as ChartBarIconSolid, 
  UserIcon as UserIconSolid 
} from '@heroicons/react/24/solid';

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const navigationItems = [
    { id: 'dashboard', name: 'Início', icon: HomeIcon, iconSolid: HomeIconSolid },
    { id: 'workouts', name: 'Treinos', icon: FireIcon, iconSolid: FireIconSolid },
    { id: 'nutrition', name: 'Nutrição', icon: CakeIcon, iconSolid: CakeIconSolid },
    { id: 'progress', name: 'Progresso', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
    { id: 'profile', name: 'Perfil', icon: UserIcon, iconSolid: UserIconSolid }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = isActive ? item.iconSolid : item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-yellow-600 bg-yellow-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

