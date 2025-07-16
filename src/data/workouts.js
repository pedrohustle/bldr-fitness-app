// Dados de exemplo para treinos
export const workouts = [
  {
    id: 1,
    name: "Treino de Peito e Tríceps",
    level: "iniciante",
    objective: "hipertrofia",
    type: "academia",
    biotipo: "mesomorfo",
    duration: 45,
    exercises: [
      {
        id: 1,
        name: "Supino Reto",
        sets: 3,
        reps: "8-12",
        rest: 90,
        videoUrl: "https://example.com/supino-reto.mp4"
      },
      {
        id: 2,
        name: "Supino Inclinado",
        sets: 3,
        reps: "8-12",
        rest: 90,
        videoUrl: "https://example.com/supino-inclinado.mp4"
      },
      {
        id: 3,
        name: "Crucifixo",
        sets: 3,
        reps: "10-15",
        rest: 60,
        videoUrl: "https://example.com/crucifixo.mp4"
      },
      {
        id: 4,
        name: "Tríceps Testa",
        sets: 3,
        reps: "10-15",
        rest: 60,
        videoUrl: "https://example.com/triceps-testa.mp4"
      }
    ]
  },
  {
    id: 2,
    name: "Treino de Costas e Bíceps",
    level: "iniciante",
    objective: "hipertrofia",
    type: "academia",
    biotipo: "mesomorfo",
    duration: 50,
    exercises: [
      {
        id: 5,
        name: "Puxada Frontal",
        sets: 3,
        reps: "8-12",
        rest: 90,
        videoUrl: "https://example.com/puxada-frontal.mp4"
      },
      {
        id: 6,
        name: "Remada Curvada",
        sets: 3,
        reps: "8-12",
        rest: 90,
        videoUrl: "https://example.com/remada-curvada.mp4"
      },
      {
        id: 7,
        name: "Rosca Direta",
        sets: 3,
        reps: "10-15",
        rest: 60,
        videoUrl: "https://example.com/rosca-direta.mp4"
      },
      {
        id: 8,
        name: "Rosca Martelo",
        sets: 3,
        reps: "10-15",
        rest: 60,
        videoUrl: "https://example.com/rosca-martelo.mp4"
      }
    ]
  },
  {
    id: 3,
    name: "Treino de Pernas",
    level: "iniciante",
    objective: "hipertrofia",
    type: "academia",
    biotipo: "mesomorfo",
    duration: 60,
    exercises: [
      {
        id: 9,
        name: "Agachamento",
        sets: 4,
        reps: "8-12",
        rest: 120,
        videoUrl: "https://example.com/agachamento.mp4"
      },
      {
        id: 10,
        name: "Leg Press",
        sets: 3,
        reps: "12-15",
        rest: 90,
        videoUrl: "https://example.com/leg-press.mp4"
      },
      {
        id: 11,
        name: "Extensora",
        sets: 3,
        reps: "12-15",
        rest: 60,
        videoUrl: "https://example.com/extensora.mp4"
      },
      {
        id: 12,
        name: "Flexora",
        sets: 3,
        reps: "12-15",
        rest: 60,
        videoUrl: "https://example.com/flexora.mp4"
      }
    ]
  },
  {
    id: 4,
    name: "Treino em Casa - Peso Corporal",
    level: "iniciante",
    objective: "emagrecimento",
    type: "casa",
    biotipo: "endomorfo",
    duration: 30,
    exercises: [
      {
        id: 13,
        name: "Flexão de Braço",
        sets: 3,
        reps: "8-15",
        rest: 60,
        videoUrl: "https://example.com/flexao.mp4"
      },
      {
        id: 14,
        name: "Agachamento Livre",
        sets: 3,
        reps: "15-20",
        rest: 60,
        videoUrl: "https://example.com/agachamento-livre.mp4"
      },
      {
        id: 15,
        name: "Prancha",
        sets: 3,
        reps: "30-60s",
        rest: 60,
        videoUrl: "https://example.com/prancha.mp4"
      },
      {
        id: 16,
        name: "Burpee",
        sets: 3,
        reps: "5-10",
        rest: 90,
        videoUrl: "https://example.com/burpee.mp4"
      }
    ]
  }
];

export const workoutFilters = {
  levels: ["iniciante", "intermediário", "avançado"],
  objectives: ["hipertrofia", "definição", "emagrecimento"],
  types: ["casa", "academia", "peso corporal"],
  biotypes: ["ectomorfo", "mesomorfo", "endomorfo"]
};

