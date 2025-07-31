import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  ClockIcon,
  FireIcon,
  PlayIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import WorkoutPlayer from '../components/Workout/WorkoutPlayer';
import WorkoutDetail from '../components/Workout/WorkoutDetail';
import Achievement from '../components/Gamification/Achievement';
import { workouts } from '../data/workouts';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';

const workoutFilters = {
  treino: ['Treinos ABC', 'Treino HIIT'],
  abcGroups: ['Peito e Tríceps', 'Costas e Bíceps', 'Pernas e Ombros']
};

const defaultEmptyExercise = { name: '', sets: '', reps: '', rest: '' };


// Componente para linha de exercício com layout flex
const EditableExerciseRow = ({ treinoKey, idx, exercise, updateExercise, removeExerciseRow, canRemove }) => (
  <div className="bg-zinc-900 text-white p-4 border border-yellow-500 rounded-2xl shadow-lg mb-4 w-full">
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <label className="block text-sm mb-1">Exercício</label>
        <input
          type="text"
          placeholder="Ex: Supino reto"
          value={exercise.name}
          onChange={e => updateExercise(treinoKey, idx, 'name', e.target.value)}
          className="w-full bg-zinc-800 border border-yellow-500 rounded px-3 py-2 placeholder-gray-400"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm mb-1">Séries</label>
        <input
          type="number"
          min="1"
          placeholder="Ex: 3"
          value={exercise.sets}
          onChange={e => updateExercise(treinoKey, idx, 'sets', e.target.value)}
          className="w-full bg-zinc-800 border border-yellow-500 rounded px-3 py-2"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm mb-1">Repetições</label>
        <input
          type="text"
          placeholder="Ex: 12-15"
          value={exercise.reps}
          onChange={e => updateExercise(treinoKey, idx, 'reps', e.target.value)}
          className="w-full bg-zinc-800 border border-yellow-500 rounded px-3 py-2"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm mb-1">Descanso (s)</label>
        <input
          type="number"
          min="0"
          placeholder="Ex: 60"
          value={exercise.rest}
          onChange={e => updateExercise(treinoKey, idx, 'rest', e.target.value)}
          className="w-full bg-zinc-800 border border-yellow-500 rounded px-3 py-2"
        />
      </div>
        <label className="block text-sm mb-1">Peso</label>
        <input
          type="number"
          value={exercise.weight !== undefined && exercise.weight !== null ? exercise.weight : ''}
          onChange={e =>{updateExercise(treinoKey, idx, 'weight', e.target.value)}  
          }
          placeholder="Ex: 15"
          className="w-full bg-zinc-800 border border-yellow-500 rounded px-3 py-2"
          min="0"
        />
    </div>

    {/* Botão de remover */}
    <div className="text-right mt-3">
      <button
        onClick={() => removeExerciseRow(treinoKey, idx)}
        disabled={!canRemove}
        className={`text-red-500 font-bold px-3 py-1 rounded hover:text-red-700 transition ${
          !canRemove ? 'opacity-40 cursor-not-allowed' : ''
        }`}
      >
        Remover
      </button>
    </div>
  </div>
);

// Componente tabela flexível para treino customizado
const EditableTableFlex = ({ treinoKey, customWorkouts, updateExercise, addExerciseRow, removeExerciseRow }) => {
  const exercises = customWorkouts[treinoKey];

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-950 p-6 rounded-3xl shadow-2xl border-2 border-yellow-600">
      <h3 className="text-center text-2xl font-montserrat text-yellow-400 mb-6">{treinoKey}</h3>

      {exercises.map((exercise, idx) => (
        <EditableExerciseRow
          key={idx}
          treinoKey={treinoKey}
          idx={idx}
          exercise={exercise}
          updateExercise={updateExercise}
          removeExerciseRow={removeExerciseRow}
          canRemove={exercises.length > 1}
        />
      ))}

      <div className="text-center mt-6">
        <button
          onClick={() => addExerciseRow(treinoKey)}
          className="text-yellow-400 hover:text-yellow-300 font-montserrat px-4 py-2 rounded-full border border-yellow-500 transition"
        >
          + Adicionar exercício
        </button>
        </div>
    </div>
  );
};

const Workouts = () => {
  const { currentUser, loading } = useAuth();
  const isMobile = useIsMobile();
  const db = getFirestore();
  const [selectedFilters, setSelectedFilters] = useState({
    treino: '',
    abcGroup: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [completedWorkouts, setCompletedWorkouts] = useState(new Set());
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [showWorkoutPlayer, setShowWorkoutPlayer] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [userProgress, setUserProgress] = useState({
    workoutsCompleted: 0,
    currentStreak: 0,
    totalXP: 0,
    unlockedAchievements: []
  });
  const [viewMode, setViewMode] = useState('');
  const [customWorkouts, setCustomWorkouts] = useState({
    'Treino A': [{ ...defaultEmptyExercise }],
    'Treino B': [{ ...defaultEmptyExercise }],
    'Treino C': [{ ...defaultEmptyExercise }],
  });
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Data para histórico no formato YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);
  const userWorkoutsDocRef = currentUser ? doc(db, 'workoutHistory', currentUser.uid, 'dates', todayStr) : null;

  // Carregar histórico diário de treinos do Firestore
  useEffect(() => {
    console.log('useEffect: Fetching workout history, currentUser:', currentUser, 'loading:', loading);
    if (!currentUser || !userWorkoutsDocRef) {
      console.log('No currentUser or userWorkoutsDocRef, skipping fetch');
      return;
    }

    const fetchWorkoutHistory = async () => {
      try {
        const docSnap = await getDoc(userWorkoutsDocRef);
        console.log('Firestore getDoc result:', docSnap.exists(), docSnap.data());
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.completedWorkouts && Array.isArray(data.completedWorkouts)) {
            setCompletedWorkouts(new Set(data.completedWorkouts));
            console.log('Loaded completedWorkouts:', data.completedWorkouts);
          } else {
            setCompletedWorkouts(new Set());
            console.log('No completedWorkouts array found, initialized empty Set');
          }
        } else {
          await setDoc(userWorkoutsDocRef, { completedWorkouts: [] });
          setCompletedWorkouts(new Set());
          console.log('Created empty workout history document at:', userWorkoutsDocRef.path);
        }
      } catch (error) {
        console.error('Error fetching workout history:', error);
      }
    };

    fetchWorkoutHistory();
  }, [currentUser, userWorkoutsDocRef]);

  // Filtragem
  const filteredWorkouts = workouts.filter(workout => {
    if (selectedFilters.treino === 'Treinos ABC') {
      if (selectedFilters.abcGroup) {
        return (
          workout.id.startsWith('abc') &&
          workout.name.toLowerCase().includes(selectedFilters.abcGroup.toLowerCase())
        );
      }
      return workout.id.startsWith('abc');
    }
    if (selectedFilters.treino === 'Treino HIIT') {
      return workout.id.startsWith('hiit');
    }
    return true;
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  const markWorkoutCompleted = async (workoutId) => {
    console.log('markWorkoutCompleted called with workoutId:', workoutId, 'currentUser:', currentUser);
    if (!currentUser || !userWorkoutsDocRef) {
      console.error('No authenticated user or userWorkoutsDocRef');
      alert('Usuário não autenticado. Por favor, faça login.');
      return;
    }

    setCompletedWorkouts(prev => {
      const newSet = new Set([...prev, workoutId]);
      console.log('Updated completedWorkouts:', [...newSet]);
      return newSet;
    });
    setUserProgress(prev => {
      const newProgress = {
        ...prev,
        workoutsCompleted: prev.workoutsCompleted + 1,
        currentStreak: prev.currentStreak + 1,
        totalXP: prev.totalXP + 100
      };
      console.log('Updated userProgress:', newProgress);
      return newProgress;
    });

    try {
      const docSnap = await getDoc(userWorkoutsDocRef);
      if (docSnap.exists()) {
        await updateDoc(userWorkoutsDocRef, {
          completedWorkouts: arrayUnion(workoutId)
        });
        console.log('Firestore updateDoc successful for workoutId:', workoutId);
      } else {
        await setDoc(userWorkoutsDocRef, { completedWorkouts: [workoutId] });
        console.log('Firestore setDoc successful, created workoutHistory document for workoutId:', workoutId);
      }
    } catch (error) {
      console.error('Firestore error:', error);
      alert('Erro ao salvar treino no Firestore. Verifique o console para detalhes.');
    }
  };

  const startWorkout = (workout) => {
    console.log('startWorkout called with workout:', workout);
    setSelectedWorkout(workout);
    setShowWorkoutDetail(false);
    setShowWorkoutPlayer(true);
  };

  const closeModals = () => {
    setShowWorkoutDetail(false);
    setShowWorkoutPlayer(false);
    setSelectedWorkout(null);
  };

  const completeWorkout = () => {
    if (selectedWorkout) {
      console.log('completeWorkout called with selectedWorkout:', selectedWorkout);
      markWorkoutCompleted(selectedWorkout.id);
      closeModals();
    } else {
      console.error('No selected workout to complete');
    }
  };

  const updateExercise = (treinoKey, index, field, value) => {
    setCustomWorkouts(prev => {
      const treinoList = [...prev[treinoKey]];
      treinoList[index] = { ...treinoList[index], [field]: value };
      return { ...prev, [treinoKey]: treinoList };
    });
  };

  const addExerciseRow = (treinoKey) => {
    setCustomWorkouts(prev => ({
      ...prev,
      [treinoKey]: [...prev[treinoKey], { ...defaultEmptyExercise }]
    }));
  };

  const removeExerciseRow = (treinoKey, index) => {
    setCustomWorkouts(prev => {
      const treinoList = [...prev[treinoKey]];
      if (treinoList.length > 1) {
        treinoList.splice(index, 1);
      }
      return { ...prev, [treinoKey]: treinoList };
    });
  };

  const saveWorkout = () => {
    const allExercises = [
      ...customWorkouts['Treino A'],
      ...customWorkouts['Treino B'],
      ...customWorkouts['Treino C'],
    ].filter(ex => ex.name.trim() !== '');

    if (allExercises.length === 0) {
      alert('Adicione ao menos um exercício antes de salvar o treino.');
      return;
    }

    const newWorkout = {
      id: 'custom-' + Date.now(),
      name: `Treino Salvo ${savedWorkouts.length + 1}`,
      exercises: allExercises.map((ex, i) => ({
        id: `custom-ex-${i}`,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
      })),
      duration: allExercises.length * 3,
      description: 'Treino criado e salvo pelo usuário',
    };

    setSavedWorkouts(prev => [...prev, newWorkout]);
    alert('Treino salvo com sucesso!');
  };

  const startCustomWorkout = () => {
    const allExercises = [
      ...customWorkouts['Treino A'],
      ...customWorkouts['Treino B'],
      ...customWorkouts['Treino C'],
    ].filter(ex => ex.name.trim() !== '');

    if (allExercises.length === 0) {
      alert('Adicione ao menos um exercício antes de iniciar o treino.');
      return;
    }

    const customWorkout = {
      id: 'custom-' + Date.now(),
      name: 'Treino Personalizado',
      exercises: allExercises.map((ex, i) => ({
        id: `custom-ex-${i}`,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
      })),
      duration: allExercises.length * 3,
      description: 'Treino criado manualmente pelo usuário',
    };

    setSelectedWorkout(customWorkout);
    setShowWorkoutDetail(false);
    setShowWorkoutPlayer(true);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }

  if (!currentUser) {
    console.log('No currentUser, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-black text-yellow-400 p-6 rounded-b-3xl relative">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-montserrat">Treinos</h1>
          <p className="text-gray-300 font-montserrat">Construa seu corpo ideal</p>
        </div>

{/* Botões de troca de modo */}
<div className="absolute bottom-4 left-4 flex gap-3">
  <button
    onClick={() => {
      setViewMode('prontos');
      setShowFilters(false);
      setSelectedFilters({ treino: '', abcGroup: '' });
    }}
    className={`
      rounded-full font-montserrat transition
      px-4 py-2 text-sm
      max-[639px]:px-2 max-[639px]:py-1 max-[639px]:text-xs
      ${viewMode === 'prontos'
        ? 'bg-yellow-500 text-gray-900'
        : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}
    `}
  >
    Treinos Prontos
  </button>

  <button
    onClick={() => {
      setViewMode('monte');
      setShowFilters(false);
      setSelectedFilters({ treino: '', abcGroup: '' });
    }}
    className={`
      rounded-full font-montserrat transition
      px-4 py-2 text-sm
      max-[639px]:px-2 max-[639px]:py-1 max-[639px]:text-xs
      ${viewMode === 'monte'
        ? 'bg-yellow-500 text-gray-900'
        : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}
    `}
  >
    Monte seu Treino
  </button>

  {viewMode === 'prontos' && (
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="rounded-full font-montserrat transition
                 px-4 py-2 text-sm
                 max-[639px]:px-2 max-[639px]:py-1 max-[639px]:text-xs
                 bg-gray-800 text-yellow-400 hover:bg-gray-700"
    >
      <FunnelIcon className="w-5 h-5 inline-block mr-1 -mt-[2px]" />
      Filtros
    </button>
  )}
  </div>
</div>

      {/* Conteúdo modo inicial */}
      {viewMode === '' && (
        <div className="flex flex-col justify-center items-center mt-16 px-6 max-w-4xl mx-auto">
          <blockquote
            className="text-yellow-500 italic text-xl font-montserrat text-center opacity-50 leading-relaxed"
            style={{ userSelect: 'none' }}
          >
            “Success is not given, it’s earned. Train hard every day and stay consistent.”
            <footer className="mt-6 text-yellow-400 font-normal text-lg">— Chris Bumstead (CBUM)</footer>
          </blockquote>
          <p className="mt-8 w-full text-center text-lg text-gray-700">
            Selecione a melhor opção para você: <span className="text-yellow-500 font-bold font-montserrat">Treinos Prontos</span> ou <span className="text-yellow-500 font-bold font-montserrat">Monte seu Treino</span>
          </p>
        </div>
      )}

      {/* FILTROS */}
      <div className="p-4 space-y-4">
        {showFilters && viewMode === 'prontos' && (
          <Card>
            <div className="space-y-4">
              {Object.entries(workoutFilters).map(([type, values]) => (
                <div key={type}>
                  {type === 'treino' && (
                    <>
                      <p className="text-sm font-medium text-gray-700 mb-2 px-2">Selecione o tipo de treino</p>
                      <div className="flex flex-wrap gap-2 px-2">
                        {values.map(value => (
                          <FilterButton
                            key={value}
                            label={value}
                            value={value}
                            filterType={type}
                            isSelected={selectedFilters[type] === value}
                            onClick={() => handleFilterChange(type, value)}
                            isMobile={isMobile}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {type === 'abcGroups' && selectedFilters.treino === 'Treinos ABC' && (
                    <>
                      <p className="text-sm font-medium text-gray-700 mt-4 mb-2 px-2">Selecione o grupo muscular</p>
                      <div className="flex flex-wrap gap-2 px-2">
                        {values.map(value => (
                          <FilterButton
                            key={value}
                            label={value}
                            value={value}
                            filterType="abcGroup"
                            isSelected={selectedFilters.abcGroup === value}
                            onClick={() => handleFilterChange('abcGroup', value)}
                          />
                        ))}
                      </div>
                                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mt-4 rounded shadow-md">
              <p className="text-sm">
                <strong>Treino ABC</strong> é um método de treino de musculação que divide os grupos musculares em três categorias, geralmente trabalhando cada grupo muscular em dias separados. Essa divisão permite um estímulo mais específico para cada grupo muscular, proporcionando um maior tempo de descanso e recuperação entre os treinos. O treino ABC é frequentemente utilizado por pessoas que buscam hipertrofia muscular e já possuem um nível intermediário de treinamento.
              </p>
            </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* TREINOS PRONTOS */}
        {viewMode === 'prontos' && selectedFilters.treino === 'Treinos ABC' && selectedFilters.abcGroup && (
          filteredWorkouts.map((workout) => (
            <Card key={workout.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-montserrat text-gray-900 mb-2 text-center">{workout.name}</h3>
                {workout.description && (
                  <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                )}

                <div className="flex flex-wrap gap-3 justify-center">
                  {workout.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center gap-2 px-3 py-2 bg-yellow-400 text-black rounded-full text-sm"
                      title={`${exercise.sets}x${exercise.reps} - ${exercise.rest}s descanso`}
                    >
                      <span className="text-lg">🏋️</span>
                      <span>{exercise.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                icon={PlayIcon}
                onClick={() => startWorkout(workout)}
                className="rounded-full max-w-xs w-full mx-auto"
              >
                Iniciar Treino
              </Button>
            </Card>
          ))
        )}

        {viewMode === 'prontos' && (!selectedFilters.abcGroup || selectedFilters.treino !== 'Treinos ABC') && (
          filteredWorkouts.map(workout => {
            const isCompleted = completedWorkouts.has(workout.id);

            return (
              <Card key={workout.id} hover className="relative">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                )}

                <div className="flex justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-montserrat text-gray-900">{workout.name}</h3>
                    <div className="text-sm text-gray-600 flex gap-4 mt-1">
                      <span><ClockIcon className="inline-block w-4 h-4 mr-1" />{workout.duration} min</span>
                      <span><FireIcon className="inline-block w-4 h-4 mr-1" />{workout.exercises.length} exercícios</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={isCompleted ? 'ghost' : 'primary'}
                    size="sm"
                    className="flex-1"
                    icon={isCompleted ? CheckCircleIcon : PlayIcon}
                    onClick={() => !isCompleted && startWorkout(workout)}
                  >
                    {isCompleted ? 'Concluído' : 'Iniciar Treino'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    icon={EyeIcon}
                    onClick={() => {
                      setSelectedWorkout(workout);
                      setShowWorkoutDetail(true);
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            );
          })
        )}
{/* --- MONTE SEU TREINO --- */}
{viewMode === 'monte' && (
  <div className="flex flex-col items-center gap-6 px-4 py-6">
    <h2 className="text-3xl font-montserrat text-gray-900 text-center mb-4">Monte seu Treino</h2>
    <p className="text-center max-w-xl text-gray-700 mb-8 font-montserrat">
      Crie seu treino personalizado adicionando os exercícios, séries, repetições e descanso.
    </p>

    {['Treino A', 'Treino B', 'Treino C'].map(treinoKey => (
      <div key={treinoKey} className="w-full flex flex-col gap-2 items-center">
        <EditableTableFlex
          treinoKey={treinoKey}
          customWorkouts={customWorkouts}
          updateExercise={updateExercise}
          addExerciseRow={addExerciseRow}
          removeExerciseRow={removeExerciseRow}
        />

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => saveWorkout(treinoKey)}
            className="bg-black text-yellow-400 hover:text-yellow-300 font-montserrat px-4 py-2 rounded-full border border-yellow-500 transition"
          >
            Salvar Treino
          </button>
          <button
            onClick={() => startCustomWorkout(treinoKey)}
            className="bg-black text-yellow-400 hover:text-yellow-300 font-montserrat px-4 py-2 rounded-full border border-yellow-500 transition"
          >
            Iniciar Treino
          </button>
        </div>
      </div>
    ))}
  </div>
)}
</div>

      {/* MODAIS */}
      {showWorkoutDetail && selectedWorkout && (
        <WorkoutDetail
          workout={selectedWorkout}
          onClose={() => setShowWorkoutDetail(false)}
          onStart={() => {
            setShowWorkoutDetail(false);
            setShowWorkoutPlayer(true);
          }}
        />
      )}

      {showWorkoutPlayer && selectedWorkout && (
        <WorkoutPlayer
          workout={selectedWorkout}
          onClose={closeModals}
          onComplete={completeWorkout}
        />
      )}

      {/* Achievement modal */}
      {newAchievement && (
        <Achievement
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
};

// Componente botão filtro (pra reuso)
const FilterButton = ({ label, value, filterType, isSelected, onClick, isMobile }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full font-semibold text-sm transition
      ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}
      ${isSelected
        ? 'bg-yellow-500 text-gray-900'
        : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'}
    `}
  >
    {label}
  </button>
);

export default Workouts;