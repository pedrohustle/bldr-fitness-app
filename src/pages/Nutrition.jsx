import React, { useState } from 'react';
import { 
  CakeIcon, 
  ClockIcon, 
  FireIcon,
  CheckCircleIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { mealPlans, recipes } from '../data/nutrition';

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [selectedPlan, setSelectedPlan] = useState(mealPlans[0]);
  const [completedMeals, setCompletedMeals] = useState(new Set());

  const markMealCompleted = (mealId) => {
    setCompletedMeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mealId)) {
        newSet.delete(mealId);
      } else {
        newSet.add(mealId);
      }
      return newSet;
    });
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-b-3xl">
        <div>
          <h1 className="text-2xl font-bold">Nutrição</h1>
          <p className="text-gray-300">Alimente seu progresso</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton id="plans" label="Planos" isActive={activeTab === 'plans'} />
          <TabButton id="recipes" label="Receitas" isActive={activeTab === 'recipes'} />
        </div>

        {activeTab === 'plans' && (
          <>
            {/* Seletor de plano */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plano Alimentar</h3>
              
              <div className="space-y-2">
                {mealPlans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedPlan.id === plan.id
                        ? 'bg-yellow-100 border-2 border-yellow-500'
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
              </div>
            </Card>

            {/* Refeições do dia */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Refeições de Hoje</h3>
              
              {selectedPlan.meals.map(meal => {
                const isCompleted = completedMeals.has(meal.id);
                const totalCalories = meal.foods.reduce((sum, food) => sum + food.calories, 0);
                
                return (
                  <Card key={meal.id}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {meal.name}
                          </h4>
                          {isCompleted && (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          )}
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
                          <span className="text-sm font-medium text-gray-700">
                            {food.calories} kcal
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant={isCompleted ? "ghost" : "primary"}
                      size="sm"
                      className="w-full"
                      icon={CheckCircleIcon}
                      onClick={() => markMealCompleted(meal.id)}
                    >
                      {isCompleted ? 'Refeição Concluída' : 'Marcar como Feita'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'recipes' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Receitas Fitness</h3>
            
            {recipes.map(recipe => (
              <Card key={recipe.id} hover>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {recipe.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{recipe.prepTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FireIcon className="w-4 h-4" />
                        <span>{recipe.calories} kcal</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {recipe.category}
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {recipe.protein}g proteína
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  icon={BookOpenIcon}
                >
                  Ver Receita Completa
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;

