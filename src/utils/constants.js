// Constantes do aplicativo BLDR
export const COLORS = {
  primary: '#1a1a1a', // Preto grafite
  secondary: '#d4af37', // Dourado
  background: '#f8f9fa',
  text: '#333333',
  textLight: '#666666',
  white: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
};

export const FONTS = {
  primary: 'Montserrat, sans-serif',
  secondary: 'SF Pro Display, sans-serif'
};

export const MOTIVATIONAL_QUOTES = [
  "Construa seu corpo, construa sua mente.",
  "Cada rep te aproxima do seu objetivo.",
  "A disciplina é a ponte entre objetivos e conquistas.",
  "Seu único limite é você mesmo.",
  "Transforme suor em resultados.",
  "A consistência é a chave do sucesso.",
  "Seja mais forte que suas desculpas.",
  "O progresso, não a perfeição.",
  "Construa hoje o corpo de amanhã.",
  "Sua jornada fitness começa agora."
];

export const BIOTYPES = {
  ectomorfo: {
    name: "Ectomorfo",
    description: "Metabolismo acelerado, dificuldade para ganhar peso",
    characteristics: ["Magro naturalmente", "Metabolismo rápido", "Dificuldade para ganhar massa"]
  },
  mesomorfo: {
    name: "Mesomorfo",
    description: "Facilidade para ganhar massa muscular e perder gordura",
    characteristics: ["Corpo atlético", "Ganha músculo facilmente", "Metabolismo equilibrado"]
  },
  endomorfo: {
    name: "Endomorfo",
    description: "Tendência a acumular gordura, metabolismo mais lento",
    characteristics: ["Corpo mais arredondado", "Ganha peso facilmente", "Metabolismo lento"]
  }
};

export const WORKOUT_OBJECTIVES = {
  hipertrofia: "Ganho de massa muscular",
  definicao: "Definição muscular",
  emagrecimento: "Perda de peso"
};

export const WORKOUT_LEVELS = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado"
};

export const WORKOUT_TYPES = {
  casa: "Em casa",
  academia: "Academia",
  peso_corporal: "Peso corporal"
};

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', name: 'Início', icon: 'home' },
  { id: 'workouts', name: 'Treinos', icon: 'dumbbell' },
  { id: 'nutrition', name: 'Nutrição', icon: 'utensils' },
  { id: 'progress', name: 'Progresso', icon: 'chart-line' },
  { id: 'profile', name: 'Perfil', icon: 'user' }
];

export const WATER_GOAL = 2500; // ml por dia
export const DAILY_CALORIES_DEFAULT = 2000;

