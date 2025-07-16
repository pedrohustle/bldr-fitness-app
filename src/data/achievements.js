// Sistema de conquistas e gamificação
export const achievements = [
  {
    id: 'first_workout',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro treino',
    type: 'workout',
    target: 1,
    progressKey: 'workoutsCompleted',
    points: 50,
    rarity: 1
  },
  {
    id: 'workout_streak_3',
    title: 'Consistência',
    description: 'Complete treinos por 3 dias consecutivos',
    type: 'streak',
    target: 3,
    progressKey: 'currentStreak',
    points: 100,
    rarity: 2
  },
  {
    id: 'workout_streak_7',
    title: 'Disciplinado',
    description: 'Complete treinos por 7 dias consecutivos',
    type: 'streak',
    target: 7,
    progressKey: 'currentStreak',
    points: 250,
    rarity: 3
  },
  {
    id: 'workout_streak_30',
    title: 'Lenda',
    description: 'Complete treinos por 30 dias consecutivos',
    type: 'streak',
    target: 30,
    progressKey: 'currentStreak',
    points: 1000,
    rarity: 5
  },
  {
    id: 'workouts_10',
    title: 'Construtor Iniciante',
    description: 'Complete 10 treinos',
    type: 'workout',
    target: 10,
    progressKey: 'workoutsCompleted',
    points: 200,
    rarity: 2
  },
  {
    id: 'workouts_50',
    title: 'Construtor Experiente',
    description: 'Complete 50 treinos',
    type: 'workout',
    target: 50,
    progressKey: 'workoutsCompleted',
    points: 500,
    rarity: 3
  },
  {
    id: 'workouts_100',
    title: 'Mestre Construtor',
    description: 'Complete 100 treinos',
    type: 'workout',
    target: 100,
    progressKey: 'workoutsCompleted',
    points: 1000,
    rarity: 4
  },
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Complete um treino antes das 7h',
    type: 'special',
    target: 1,
    progressKey: 'earlyWorkouts',
    points: 150,
    rarity: 2
  },
  {
    id: 'night_owl',
    title: 'Coruja Noturna',
    description: 'Complete um treino depois das 22h',
    type: 'special',
    target: 1,
    progressKey: 'lateWorkouts',
    points: 150,
    rarity: 2
  },
  {
    id: 'hydration_master',
    title: 'Hidratação Perfeita',
    description: 'Atinja a meta de água por 7 dias consecutivos',
    type: 'nutrition',
    target: 7,
    progressKey: 'hydrationStreak',
    points: 300,
    rarity: 3
  },
  {
    id: 'meal_tracker',
    title: 'Nutricionista',
    description: 'Registre todas as refeições por 5 dias',
    type: 'nutrition',
    target: 5,
    progressKey: 'mealTrackingStreak',
    points: 200,
    rarity: 2
  },
  {
    id: 'progress_photo',
    title: 'Transformação',
    description: 'Adicione sua primeira foto de progresso',
    type: 'progress',
    target: 1,
    progressKey: 'progressPhotos',
    points: 100,
    rarity: 1
  },
  {
    id: 'weight_goal',
    title: 'Meta Alcançada',
    description: 'Atinja sua meta de peso',
    type: 'progress',
    target: 1,
    progressKey: 'weightGoalsAchieved',
    points: 500,
    rarity: 4
  }
];

export const userLevels = [
  { level: 1, title: 'Iniciante', minXP: 0, maxXP: 499 },
  { level: 2, title: 'Aprendiz', minXP: 500, maxXP: 1499 },
  { level: 3, title: 'Construtor', minXP: 1500, maxXP: 2999 },
  { level: 4, title: 'Arquiteto', minXP: 3000, maxXP: 4999 },
  { level: 5, title: 'Mestre', minXP: 5000, maxXP: 7999 },
  { level: 6, title: 'Lenda', minXP: 8000, maxXP: 11999 },
  { level: 7, title: 'Titã', minXP: 12000, maxXP: 19999 },
  { level: 8, title: 'Deus do Ferro', minXP: 20000, maxXP: 99999 }
];

export const getUserLevel = (totalXP) => {
  for (let i = userLevels.length - 1; i >= 0; i--) {
    if (totalXP >= userLevels[i].minXP) {
      return userLevels[i];
    }
  }
  return userLevels[0];
};

export const getXPToNextLevel = (totalXP) => {
  const currentLevel = getUserLevel(totalXP);
  const nextLevel = userLevels.find(level => level.level === currentLevel.level + 1);
  
  if (!nextLevel) {
    return 0; // Nível máximo atingido
  }
  
  return nextLevel.minXP - totalXP;
};

export const checkAchievements = (userProgress, newProgress) => {
  const newAchievements = [];
  
  achievements.forEach(achievement => {
    const isAlreadyUnlocked = userProgress.unlockedAchievements?.includes(achievement.id);
    const currentProgress = newProgress[achievement.progressKey] || 0;
    
    if (!isAlreadyUnlocked && currentProgress >= achievement.target) {
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
};

