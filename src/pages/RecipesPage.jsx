// src/pages/RecipesPage.jsx
import React from 'react';
import RecipesList from '../components/Nutrition/Recipeslist';
import { recipes } from '../data/nutrition';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const RecipesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 p-4">
        <div className="px-4 py-3">
  <button
    onClick={() => navigate(-1)}
    className="px-4 py-2 rounded-full font-montserrat cursor-pointer bg-black text-white border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition duration-300"
  >
        Voltar
    </button>
    </div>

      {/* Lista de Receitas */}
      <div className="mt-4 text-center">
        <RecipesList recipes={recipes} />
      </div>
    </div>
  );
};

export default RecipesPage;
