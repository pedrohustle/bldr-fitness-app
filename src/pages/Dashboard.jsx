import React, { useState, useEffect, useRef } from 'react';
import { PlayIcon, EyeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/button.jsx';
import ProgressRing from '../components/ui/ProgressRing';
import { MOTIVATIONAL_QUOTES } from '../utils/constants';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Trophy, Utensils, Droplets } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Profile from './Profile';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import { useIsMobile } from '../hooks/use-mobile';
import { handleWorkoutCompleted, handleWeightUpdate } from '../utils/profileActions';
import BottomNavigation from '../components/Navigation/BottomNavigation'

const Dashboard = () => {
  const { currentUser, userProfile, setUserProfile  } = useAuth();
  const isMobile = useIsMobile();
  const workoutHandledTodayRef = useRef(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [waterIntake, setWaterIntake] = useState(0); // ml
  const [showProfile, setShowProfile] = useState(false);
  const [dailyGoals, setDailyGoals] = useState({
    workout: false,
    meals: 6,
    mealsCompleted: 0
  });

  // Citação motivacional
  useEffect(() => {
    const randomQuote =
      MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setCurrentQuote(randomQuote);
  }, []);

  // Hidratação
  const waterProgress = (waterIntake / 2500) * 100;

  const addWater = (amount) => {
    setWaterIntake((prev) => Math.min(prev + amount, 2500));
  };

  // Scroll bloqueado ao abrir o painel
  useEffect(() => {
    document.body.style.overflow = showProfile ? 'hidden' : '';
  }, [showProfile]);

  // 🔁 Firestore listeners para workoutHistory e mealHistory
  useEffect(() => {
  if (!userProfile?.uid) return;

  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  workoutHandledTodayRef.current = false;

  // Listener para workoutHistory
  const workoutRef = doc(db, 'workoutHistory', userProfile.uid, 'dates', today);
  const unsubscribeWorkout = onSnapshot(workoutRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const workoutCompleted = data.completedWorkouts && Array.isArray(data.completedWorkouts) && data.completedWorkouts.length > 0;

      setDailyGoals(prev => ({
        ...prev,
        workout: workoutCompleted
      }));

      if (
        workoutCompleted &&
        !workoutHandledTodayRef.current &&
        userProfile.lastWorkoutDate !== today
      ) {
        workoutHandledTodayRef.current = true;

        // Atualiza o campo local temporariamente para evitar loop
        setUserProfile(prev => ({
          ...prev,
          lastWorkoutDate: today,
          workoutsCompleted: (prev.workoutsCompleted || 0) + 1
        }));

        handleWorkoutCompleted(currentUser, userProfile, setUserProfile);
      }

            console.log('Workout status updated:', workoutCompleted, data);
          } else {
            setDailyGoals(prev => ({ ...prev, workout: false }));
            workoutHandledTodayRef.current = false;
            console.log('No workout document found for today');
          }
        });

  // Listener para mealHistory
  const mealRef = doc(db, 'mealHistory', userProfile.uid, 'dates', today);
  const unsubscribeMeal = onSnapshot(mealRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const mealsCompleted = data.completedMeals && Array.isArray(data.completedMeals) ? data.completedMeals.length : 0;

      setDailyGoals(prev => ({
        ...prev,
        mealsCompleted: mealsCompleted
      }));

      console.log('Meals status updated:', mealsCompleted, data);
    } else {
      setDailyGoals(prev => ({
        ...prev,
        mealsCompleted: 0
      }));

      console.log('No meal document found for today');
    }
  });

  // Cleanup dos dois listeners quando o efeito desmontar ou userProfile mudar
  return () => {
    unsubscribeWorkout();
    unsubscribeMeal();
  };
}, [userProfile?.uid]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative z-0">
      {/* Painel lateral do perfil */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          showProfile ? 'bg-black/60 bg-opacity-50' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setShowProfile(false)}
      >
        <div
          className={`transform transition-transform duration-300 ease-in-out bg-white w-full max-w-md h-full shadow-lg p-6 overflow-y-auto ${
            showProfile ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowProfile(false)}
              className="text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
          <Profile />
        </div>
      </div>

      {/* Header */}
      <div className="bg-black text-yellow-400 p-6 rounded-b-3xl relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowProfile(true);
          }}
          className="absolute top-6 right-6 text-yellow-300 hover:text-yellow-500 transition focus:outline-none z-20"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>

        <div className="relative flex justify-center items-center mb-4">
          <div className="text-center">
          <img
              src='/images/BLDR_CLEAN_BGLESS.png'
              alt="Logo BLDR"
              className="w-32 sm:w-40 md:w-56 lg:w-72 mx-auto -mt-12 sm:-mt-16 md:-mt-20 -mb-8"
            />
            <p className="text-gray-300 font-montserrat">Construa sua melhor versão</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-4">
          <p className="text-center text-yellow-300 font-medium italic">"{currentQuote}"</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Resumo do dia */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-glass">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Trophy className="text-primary" size={24} />
                <span className="text-sm font-montserrat text-muted-foreground">Treino</span>
                <span
                  className={`text-lg font-montserrat-bold ${
                    dailyGoals.workout ? 'text-green-600' : 'text-destructive'
                  }`}
                >
                  {dailyGoals.workout ? 'Concluído' : 'Pendente'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <Utensils className="text-primary" size={24} />
                <span className="text-sm font-montserrat text-muted-foreground">Refeições</span>
                <span className="text-lg font-montserrat-bold text-primary">
                  {dailyGoals.mealsCompleted}/{dailyGoals.meals}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hidratação */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-montserrat">
              <Droplets className="text-primary" size={20} />
              Hidratação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <ProgressRing progress={waterProgress} size={100} strokeWidth={8} color="#3b82f6">
                <span className="text-lg font-bold text-blue-600">
                  {Math.round(waterProgress)}%
                </span>
              </ProgressRing>

              <div className="flex items-center justify-between w-full max-w-xs">
                <span className="text-gray-600">{waterIntake}ml / 2500ml</span>
                <span className="text-sm text-gray-500">Meta diária</span>
              </div>

              <div className="flex gap-2 w-full max-w-xs">
                <Button variant="ghost" size="sm" onClick={() => addWater(250)} className="flex-1">
                  +250ml
                </Button>
                <Button variant="ghost" size="sm" onClick={() => addWater(500)} className="flex-1">
                  +500ml
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="card-glass">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-montserrat-bold text-primary">
                {userProfile?.workoutsCompleted || 0}
              </div>
              <div className="text-xs text-muted-foreground font-montserrat">Treinos</div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-montserrat-bold text-primary">
                -{userProfile?.weightLost || 0}kg
              </div>
              <div className="text-xs text-muted-foreground font-montserrat">Este mês</div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-montserrat-bold text-primary">
                {userProfile?.currentStreak || 0}
              </div>
              <div className="text-xs text-muted-foreground font-montserrat">Sequência</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

