import {
  HomeIcon,
  DumbbellIcon,
  UserIcon,
  LineChartIcon,
  UtensilsIcon,
  ActivityIcon,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-mobile';

const tabs = [
  { label: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
  { label: 'Treinos', icon: DumbbellIcon, path: '/workouts' },
  { label: 'Nutrição', icon: UtensilsIcon, path: '/nutrition' },
  { label: 'Esportes', icon: ActivityIcon, path: '/premium' },
  { label: 'Progresso', icon: LineChartIcon, path: '/progress' },
];

const BottomNavMobile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-black border-t border-gray-800 flex justify-around py-2 z-50 md:hidden pb-[10px] mb-[20px]">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.label}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center text-xs ${
              isActive ? 'text-yellow-400' : 'text-gray-400'
            }`}
            aria-label={tab.label}
          >
            <Icon className="w-5 h-5 mb-1" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNavMobile;
