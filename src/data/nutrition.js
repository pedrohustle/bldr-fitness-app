// Dados de exemplo para nutrição
export const mealPlans = [
  {
    id: 1,
    name: "Plano de Hipertrofia",
    objective: "hipertrofia",
    calories: 2800,
    protein: 140,
    carbs: 350,
    fat: 93,
    meals: [
      {
        id: 1,
        name: "Café da Manhã",
        time: "07:00",
        foods: [
          { name: "Aveia", quantity: "50g", calories: 190 },
          { name: "Banana", quantity: "1 unidade", calories: 105 },
          { name: "Leite Desnatado", quantity: "200ml", calories: 70 },
          { name: "Mel", quantity: "1 colher", calories: 64 }
        ]
      },
      {
        id: 2,
        name: "Lanche da Manhã",
        time: "10:00",
        foods: [
          { name: "Iogurte Grego", quantity: "150g", calories: 130 },
          { name: "Granola", quantity: "30g", calories: 140 }
        ]
      },
      {
        id: 3,
        name: "Almoço",
        time: "12:30",
        foods: [
          { name: "Peito de Frango", quantity: "150g", calories: 231 },
          { name: "Arroz Integral", quantity: "100g", calories: 123 },
          { name: "Feijão", quantity: "80g", calories: 76 },
          { name: "Brócolis", quantity: "100g", calories: 25 }
        ]
      },
      {
        id: 4,
        name: "Lanche da Tarde",
        time: "15:30",
        foods: [
          { name: "Batata Doce", quantity: "100g", calories: 86 },
          { name: "Ovo Cozido", quantity: "2 unidades", calories: 140 }
        ]
      },
      {
        id: 5,
        name: "Jantar",
        time: "19:00",
        foods: [
          { name: "Salmão", quantity: "120g", calories: 248 },
          { name: "Quinoa", quantity: "80g", calories: 120 },
          { name: "Aspargos", quantity: "100g", calories: 20 }
        ]
      },
      {
        id: 6,
        name: "Ceia",
        time: "21:30",
        foods: [
          { name: "Cottage", quantity: "100g", calories: 98 },
          { name: "Castanha do Pará", quantity: "3 unidades", calories: 60 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Plano de Emagrecimento",
    objective: "emagrecimento",
    calories: 1800,
    protein: 120,
    carbs: 180,
    fat: 60,
    meals: [
      {
        id: 1,
        name: "Café da Manhã",
        time: "07:00",
        foods: [
          { name: "Omelete", quantity: "2 ovos", calories: 140 },
          { name: "Tomate", quantity: "1 unidade", calories: 22 },
          { name: "Chá Verde", quantity: "1 xícara", calories: 2 }
        ]
      },
      {
        id: 2,
        name: "Lanche da Manhã",
        time: "10:00",
        foods: [
          { name: "Maçã", quantity: "1 unidade", calories: 95 }
        ]
      },
      {
        id: 3,
        name: "Almoço",
        time: "12:30",
        foods: [
          { name: "Peito de Frango Grelhado", quantity: "120g", calories: 185 },
          { name: "Salada Verde", quantity: "150g", calories: 20 },
          { name: "Azeite", quantity: "1 colher", calories: 40 }
        ]
      },
      {
        id: 4,
        name: "Lanche da Tarde",
        time: "15:30",
        foods: [
          { name: "Iogurte Natural", quantity: "100g", calories: 61 }
        ]
      },
      {
        id: 5,
        name: "Jantar",
        time: "19:00",
        foods: [
          { name: "Peixe Grelhado", quantity: "100g", calories: 206 },
          { name: "Legumes Refogados", quantity: "150g", calories: 45 }
        ]
      }
    ]
  }
];

export const recipes = [
  {
    id: 1,
    name: "Omelete Proteica",
    category: "café da manhã",
    prepTime: 10,
    difficulty: "fácil",
    calories: 280,
    protein: 24,
    ingredients: [
      "3 ovos",
      "1 clara de ovo",
      "50g de queijo cottage",
      "Temperos a gosto",
      "1 colher de azeite"
    ],
    instructions: [
      "Bata os ovos com as claras",
      "Adicione o cottage e temperos",
      "Aqueça a frigideira com azeite",
      "Despeje a mistura e cozinhe por 3-4 minutos",
      "Dobre ao meio e sirva"
    ]
  },
  {
    id: 2,
    name: "Frango com Batata Doce",
    category: "almoço",
    prepTime: 25,
    difficulty: "fácil",
    calories: 420,
    protein: 35,
    ingredients: [
      "150g de peito de frango",
      "200g de batata doce",
      "Temperos variados",
      "1 colher de azeite",
      "Brócolis a gosto"
    ],
    instructions: [
      "Tempere o frango e deixe marinar",
      "Corte a batata doce em cubos",
      "Asse a batata doce por 20 minutos",
      "Grelhe o frango por 6-8 minutos cada lado",
      "Refogue o brócolis rapidamente",
      "Monte o prato e sirva"
    ]
  }
];

