import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ClockIcon, FireIcon, BookOpenIcon } from '@heroicons/react/24/outline';

const RecipesList = ({ recipes }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-montserrat font-bold text-gray-900 text-center">RECEITAS FITNESS</h3>
        
        {recipes.map(recipe => (
          <Card 
            key={recipe.id} 
            className="hover:bg-gray-100 cursor-pointer transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-montserrat text-gray-900 mb-1">
                  {recipe.name}
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 justify-center">
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
              className="cursor-pointer rounded-full max-w-xs w-full mx-auto"
              icon={BookOpenIcon}
              onClick={() => setSelectedRecipe(recipe)}
            >
              Ver Receita Completa
            </Button>
          </Card>
        ))}
      </div>

      {/* Modal SEM condicional, controle por classe CSS */}
      <div
        className={`fixed inset-0 bg-black/60 bg-opacity-70 flex justify-center items-center z-50 p-4 transition-opacity duration-300
          ${selectedRecipe ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSelectedRecipe(null)}
      >
        <div
          className="bg-white rounded-lg max-w-xl w-full p-6 overflow-auto max-h-[80vh]"
          onClick={e => e.stopPropagation()}
        >
          {selectedRecipe && (
            <>
              <h2 className="text-2xl font-montserrat mb-4">{selectedRecipe.name}</h2>
              <p className="mb-2">
                <strong>Categoria:</strong> {selectedRecipe.category}
              </p>
              <p className="mb-2">
                <strong>Tempo de preparo:</strong> {selectedRecipe.prepTime} min
              </p>
              <p className="mb-2">
                <strong>Calorias:</strong> {selectedRecipe.calories} kcal
              </p>
              <p className="mb-4">
                <strong>Dificuldade:</strong> {selectedRecipe.difficulty}
              </p>
              <h3 className="font-montserrat mb-2">Ingredientes:</h3>
              <ul className="list-disc list-inside mb-4">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
              <h3 className="font-montserrat mb-2">Modo de preparo:</h3>
              <p>{selectedRecipe.instructions}</p>

              <Button
                variant="primary"
                size="sm"
                className="mt-6 w-full"
                onClick={() => setSelectedRecipe(null)}
              >
                Fechar
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(RecipesList);
