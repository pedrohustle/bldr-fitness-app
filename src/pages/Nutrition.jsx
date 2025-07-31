import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  FireIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button.jsx';
import { mealPlans } from '../data/nutrition'; // planos prontos
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';

const Nutrition = () => {
  const { currentUser, loading } = useAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const customDietPlanId = 'custom-diet';

  const [selectedPlan, setSelectedPlan] = useState(mealPlans[0]);
  const [activeTab, setActiveTab] = useState('planos'); // 'planos' ou 'receitas'
  const [completedMeals, setCompletedMeals] = useState(new Set());

  const [customDiet, setCustomDiet] = useState({
    breakfast: { time: '', foods: '' },
    lunch: { time: '', foods: '' },
    dinner: { time: '', foods: '' },
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const userMealsDocRef = currentUser ? doc(db, 'mealHistory', currentUser.uid, 'dates', todayStr) : null;

  useEffect(() => {
    if (!currentUser || !userMealsDocRef) return;

    const fetchMealHistory = async () => {
      try {
        const docSnap = await getDoc(userMealsDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.completedMeals && Array.isArray(data.completedMeals)) {
            setCompletedMeals(new Set(data.completedMeals));
          } else {
            setCompletedMeals(new Set());
          }
        } else {
          await setDoc(userMealsDocRef, { completedMeals: [] });
          setCompletedMeals(new Set());
        }
      } catch (error) {
        console.error('Error fetching meal history:', error);
      }
    };

    fetchMealHistory();
  }, [currentUser, userMealsDocRef]);

  const markMealCompleted = async (mealId) => {
    if (!currentUser || !userMealsDocRef) {
      alert('Usuário não autenticado. Por favor, faça login.');
      return;
    }

    const newSet = new Set(completedMeals);
    if (newSet.has(mealId)) {
      newSet.delete(mealId);
    } else {
      newSet.add(mealId);
    }

    setCompletedMeals(newSet);

    try {
      const docSnap = await getDoc(userMealsDocRef);
      if (docSnap.exists()) {
        await updateDoc(userMealsDocRef, {
          completedMeals: arrayUnion(mealId)
        });
      } else {
        await setDoc(userMealsDocRef, { completedMeals: [mealId] });
      }
    } catch (error) {
      console.error('Firestore error:', error);
      alert('Erro ao salvar refeição no Firestore. Verifique o console para detalhes.');
    }
  };

  const handleCustomDietChange = (meal, field, value) => {
    setCustomDiet(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value,
      }
    }));
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-black text-yellow-400 p-6 rounded-b-3xl">
        <div>
          <h1 className="text-2xl font-montserrat text-center">Nutrição</h1>
          <p className="text-gray-300 text-center">Alimente seu progresso</p>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Abas */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'planos'
                ? 'bg-yellow-500 text-gray-900 border-2 border-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('planos')}
          >
            Planos
          </button>

          <button
            className={`py-3 px-6 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === 'receitas'
                ? 'bg-yellow-500 text-gray-900 border-2 border-black'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => navigate('/recipes')} // botão navega para página separada
          >
            Receitas
          </button>
        </div>

        {/* Conteúdo da aba Planos */}
        {activeTab === 'planos' && (
          <>
            <Card>
              <h3 className="text-lg font-montserrat text-gray-900 mb-4 text-center">Plano Alimentar</h3>
              <div className="space-y-2">
                {mealPlans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedPlan.id === plan.id
                        ? 'bg-yellow-400 border-2 border-black'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                        <p className="text-sm text-gray-600">{plan.calories} kcal/dia</p>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>P: {plan.protein}g</p>
                        <p>C: {plan.carbs}g</p>
                        <p>G: {plan.fat}g</p>
                      </div>
                    </div>
                  </button>
                ))}

                <button
                  key={customDietPlanId}
                  onClick={() => setSelectedPlan({ id: customDietPlanId })}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedPlan.id === customDietPlanId
                      ? 'bg-yellow-400 border-2 border-black'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-montserrat text-gray-900">Dieta Personalizada</h4>
                      <p className="text-sm text-gray-600">Monte seu plano alimentar único</p>
                    </div>
                    <div className="text-right text-sm text-gray-600"></div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Conteúdo da dieta personalizada ou plano selecionado */}
            <div className="space-y-4">
              {selectedPlan.id === customDietPlanId ? (
                <Card>
                  <h3 className="text-lg font-montserrat text-gray-900 mb-4 text-center">Dieta Personalizada</h3>

                  {/* Café da Manhã */}
                  <div className="mb-6">
                    <label className="block text-black font-montserrat mb-1 px-2">Café da Manhã</label>
                    <input
                      type="time"
                      value={customDiet.breakfast.time}
                      onChange={e => handleCustomDietChange('breakfast', 'time', e.target.value)}
                      className="block mx-auto w-32 p-2 mb-2 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <textarea
                      placeholder="Descreva os alimentos..."
                      value={customDiet.breakfast.foods}
                      onChange={e => handleCustomDietChange('breakfast', 'foods', e.target.value)}
                      rows={4}
                      className="max-w-xs w-full mx-9 p-2 rounded-2xl border-2 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Almoço */}
                  <div className="mb-6">
                    <label className="block text-black font-montserrat mb-1 px-2">Almoço</label>
                    <input
                      type="time"
                      value={customDiet.lunch.time}
                      onChange={e => handleCustomDietChange('lunch', 'time', e.target.value)}
                      className="block mx-auto w-32 rounded-full p-2 mb-2 border-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <textarea
                      placeholder="Descreva os alimentos..."
                      value={customDiet.lunch.foods}
                      onChange={e => handleCustomDietChange('lunch', 'foods', e.target.value)}
                      rows={4}
                      className="max-w-xs w-full mx-9 p-2 rounded-2xl border-2 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Jantar */}
                  <div>
                    <label className="block text-black font-montserrat mb-1 px-2">Jantar</label>
                    <input
                      type="time"
                      value={customDiet.dinner.time}
                      onChange={e => handleCustomDietChange('dinner', 'time', e.target.value)}
                      className="block mx-auto w-32 p-2 mb-2 rounded border-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <textarea
                      placeholder="Descreva os alimentos..."
                      value={customDiet.dinner.foods}
                      onChange={e => handleCustomDietChange('dinner', 'foods', e.target.value)}
                      rows={4}
                      className="max-w-xs w-full mx-9 p-2 rounded-2xl border-2 resize-y focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </Card>
              ) : (
                <>
                  <h3 className="text-lg font-montserrat text-gray-900 text-center mt-4">Refeições de Hoje</h3>
                  {selectedPlan.meals && selectedPlan.meals.map(meal => {
                    const isCompleted = completedMeals.has(meal.id);
                    const totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
                    return (
                      <Card key={meal.id} className="px-8">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900">{meal.name}</h4>
                              {isCompleted && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>{meal.time}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FireIcon className="w-4 h-4" />
                                <span>{totalCalories} kcal</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          {meal.foods.map((food, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <span className="font-medium text-gray-900">{food.name}</span>
                                <span className="text-sm text-gray-600 ml-2">({food.quantity})</span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">{food.calories} kcal</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          variant={isCompleted ? "success" : "primary"}
                          size="sm"
                          className="w-full"
                          onClick={() => markMealCompleted(meal.id)}
                        >
                          {isCompleted ? 'Refeição Concluída' : 'Marcar como Feita'}
                        </Button>
                      </Card>
                    );
                  })}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
