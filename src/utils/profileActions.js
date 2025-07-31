import { updateUserProfile } from '../services/firebase';

// 🏋️ Atualiza treinos concluídos e sequência
export const handleWorkoutCompleted = async (user, userProfile, setUserProfile) => {
  const today = new Date().toDateString();
  const lastWorkoutDate = userProfile?.lastWorkoutDate || null;

  const isConsecutive =
    lastWorkoutDate &&
    new Date(today).getTime() - new Date(lastWorkoutDate).getTime() === 86400000;

  const updatedProfile = {
    workoutsCompleted: (userProfile?.workoutsCompleted || 0) + 1,
    currentStreak: isConsecutive
      ? (userProfile?.currentStreak || 0) + 1
      : 1,
    lastWorkoutDate: today,
  };

  await updateUserProfile(user.uid, updatedProfile);
  setUserProfile((prev) => ({ ...prev, ...updatedProfile }));
};

// ⚖️ Atualiza peso e calcula kg perdidos
export const handleWeightUpdate = async (user, userProfile, newWeight, setUserProfile) => {
  const lastWeight = userProfile?.lastWeight || newWeight;
  const weightDiff = lastWeight - newWeight;

  const updatedProfile = {
    lastWeight: newWeight,
    weightLost: weightDiff > 0 ? weightDiff.toFixed(1) : 0,
  };

  await updateUserProfile(user.uid, updatedProfile);
  setUserProfile((prev) => ({ ...prev, ...updatedProfile }));
};
