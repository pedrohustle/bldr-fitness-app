// utils/levelUtils.js

// Define os níveis com faixas de XP e títulos
export const levels = [
  { level: 1, minXP: 0, maxXP: 500, title: 'Iniciante' },
  { level: 2, minXP: 500, maxXP: 1000, title: 'Aprendiz' },
  { level: 3, minXP: 1000, maxXP: 2000, title: 'Guerreiro' },
  { level: 4, minXP: 2000, maxXP: 3500, title: 'Veterano' },
  { level: 5, minXP: 3500, maxXP: 5000, title: 'Lenda' },
  { level: 6, minXP: 5000, maxXP: 999999, title: 'Imortal' }, // Nível máximo
];

// Retorna os dados do nível atual com base no total de XP
export const getUserLevel = (totalXP) => {
  return levels
    .slice()
    .reverse()
    .find((lvl) => totalXP >= lvl.minXP) || levels[0];
};

// Calcula o XP necessário para o próximo nível
export const getXPToNextLevel = (totalXP) => {
  const currentLevel = getUserLevel(totalXP);
  if (!currentLevel || totalXP >= currentLevel.maxXP) return 0;
  return currentLevel.maxXP - totalXP;
};
