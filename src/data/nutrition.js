// src/data/nutrition.js

export const mealPlans = [
  {
    id: 'hipertrofia',
    name: 'Plano Hipertrofia',
    calories: 2800,
    protein: 200,
    carbs: 300,
    fat: 70,
    meals: [
      {
        id: 'meal1',
        name: 'Café da Manhã',
        time: '07:30',
        foods: [
          { name: 'Ovos mexidos', quantity: '3 ovos', calories: 210 },
          { name: 'Aveia', quantity: '50g', calories: 190 },
          { name: 'Banana', quantity: '1 unidade', calories: 100 },
        ],
      },
      {
        id: 'meal2',
        name: 'Almoço',
        time: '12:30',
        foods: [
          { name: 'Peito de frango grelhado', quantity: '200g', calories: 330 },
          { name: 'Arroz integral', quantity: '150g', calories: 210 },
          { name: 'Brócolis', quantity: '100g', calories: 40 },
        ],
      },
      {
        id: 'meal3',
        name: 'Jantar',
        time: '19:00',
        foods: [
          { name: 'Salmão grelhado', quantity: '180g', calories: 350 },
          { name: 'Batata doce', quantity: '150g', calories: 130 },
          { name: 'Salada verde', quantity: 'à vontade', calories: 30 },
        ],
      },
    ],
  },
  {
    id: 'emagrecimento',
    name: 'Plano Emagrecimento',
    calories: 1800,
    protein: 150,
    carbs: 150,
    fat: 50,
    meals: [
      {
        id: 'meal4',
        name: 'Café da Manhã',
        time: '08:00',
        foods: [
          { name: 'Iogurte natural', quantity: '150g', calories: 90 },
          { name: 'Granola', quantity: '40g', calories: 140 },
          { name: 'Frutas vermelhas', quantity: '100g', calories: 60 },
        ],
      },
      {
        id: 'meal5',
        name: 'Almoço',
        time: '13:00',
        foods: [
          { name: 'Filé de peixe', quantity: '150g', calories: 200 },
          { name: 'Quinoa', quantity: '100g', calories: 120 },
          { name: 'Legumes cozidos', quantity: 'à vontade', calories: 50 },
        ],
      },
      {
        id: 'meal6',
        name: 'Jantar',
        time: '19:30',
        foods: [
          { name: 'Omelete de claras', quantity: '4 claras', calories: 70 },
          { name: 'Salada verde', quantity: 'à vontade', calories: 30 },
          { name: 'Abacate', quantity: '50g', calories: 80 },
        ],
      },
    ],
  },
];

export const recipes = [
  {
    id: 'recipe1',
    name: 'Omelete Proteico',
    prepTime: 15,
    calories: 300,
    difficulty: 'Fácil',
    category: 'Café da Manhã',
    protein: 25,
    ingredients: [
      '3 ovos',
      '50g de peito de peru picado',
      '1 tomate picado',
      'Sal e pimenta a gosto',
      '1 colher de chá de azeite',
    ],
    instructions:
      'Bata os ovos com sal e pimenta. Aqueça o azeite na frigideira, adicione o peito de peru e o tomate. Despeje os ovos batidos e cozinhe até firmar. Dobre e sirva.',
  },
  {
    id: 'recipe2',
    name: 'Frango ao Curry com Legumes',
    prepTime: 40,
    calories: 450,
    difficulty: 'Médio',
    category: 'Almoço',
    protein: 40,
    ingredients: [
      '200g de peito de frango em cubos',
      '1 cebola picada',
      '2 dentes de alho picados',
      '1 cenoura em rodelas',
      '1 pimentão vermelho picado',
      '1 colher de sopa de curry em pó',
      '200ml de leite de coco',
      'Sal e pimenta a gosto',
      'Azeite para refogar',
    ],
    instructions:
      'Refogue a cebola e o alho no azeite, adicione o frango e cozinhe até dourar. Junte os legumes e o curry, mexa bem. Acrescente o leite de coco, tempere e cozinhe até os legumes ficarem macios. Sirva com arroz integral.',
  },
  {
    id: 'recipe3',
    name: 'Smoothie Verde',
    prepTime: 10,
    calories: 250,
    difficulty: 'Fácil',
    category: 'Lanche',
    protein: 15,
    ingredients: [
      '1 copo de leite de amêndoas',
      '1 banana',
      '1 punhado de espinafre',
      '1 colher de sopa de chia',
      'Mel a gosto',
    ],
    instructions:
      'Bata todos os ingredientes no liquidificador até obter uma mistura homogênea. Sirva gelado.',
  },
  {
    id: 'recipe4',
    name: 'Salmão Grelhado com Aspargos',
    prepTime: 30,
    calories: 500,
    difficulty: 'Médio',
    category: 'Jantar',
    protein: 45,
    ingredients: [
      '150g de salmão',
      '100g de aspargos',
      '1 dente de alho picado',
      'Sal e pimenta a gosto',
      'Azeite para grelhar',
    ],
    instructions:
      'Tempere o salmão com sal, pimenta e alho. Grelhe o salmão e os aspargos com azeite até dourar. Sirva com limão.',
  },
];
