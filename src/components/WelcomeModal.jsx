import React, { useState, useEffect } from 'react';
import { updateUserProfile } from '../services/firebase';

const options = {
  goals: ['Perder gordura', 'Ganho de massa muscular', 'Definição'],
  weights: Array.from({ length: 81 }, (_, i) => i + 40),
  heights: Array.from({ length: 71 }, (_, i) => i + 140),
  biotypes: ['Ectomorfo', 'Mesomorfo', 'Endomorfo'],
  activityLevels: ['Iniciante', 'Intermediário', 'Avançado'],
};

const WelcomeModal = ({ userProfile, setUserProfile }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const alreadyCompleted = localStorage.getItem('welcomeModalCompleted');
    if (userProfile && userProfile.age) return; // já completou
    if (!alreadyCompleted) {
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      // Limpa overflow ao desmontar (ex: trocar de página)
      document.body.style.overflow = 'auto';
    };
  }, [userProfile]);

  // Atualiza formData e avança a etapa
  const handleNext = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStep((prev) => prev + 1);
  };

  // Função para salvar no Firebase e fechar modal
  const handleFrequencySelect = async (freq) => {
    if (!userProfile?.uid) {
      alert("Aguarde o carregamento do perfil.");
      return;
    }
    setSelectedFrequency(freq);
    setIsSaving(true);
    try {
      const finalData = { ...formData, weeklyFrequency: freq };
      await updateUserProfile(userProfile.uid, finalData);
      setUserProfile((prev) => ({ ...prev, ...finalData }));
      localStorage.setItem('welcomeModalCompleted', 'true');
      setShowModal(false);
      document.body.style.overflow = 'auto';
    } catch (error) {
      console.error("Erro ao salvar os dados:", error);
      alert("Ocorreu um erro ao salvar seu perfil. Tente novamente.");
      setIsSaving(false);
    }
  };

  // Base do modal: overlay + container centralizado
  const baseModal = (title, content, subtitle) => (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4 font-montserrat"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {subtitle && <p className="mb-4 text-sm text-gray-600">{subtitle}</p>}
        {content}
      </div>
    </div>
  );

  if (!showModal) return null;

  switch (step) {
    case 0:
      return baseModal(
        'Bem-Vindo ao BLDR!',
        <button
          onClick={() => setStep(1)}
          className="mt-6 px-4 py-2 bg-black text-white rounded-md hover:bg-[#d4af37]"
        >
          Começar
        </button>,
        'Antes de prosseguir com o uso do app, por favor preencha as seguintes informações'
      );

    case 1:
      return baseModal(
        'Qual a sua idade?',
        <div className="flex space-x-2 overflow-x-auto py-2">
          {Array.from({ length: 100 }, (_, i) => i + 10).map((age) => (
            <button
              key={age}
              onClick={() => handleNext('age', age)}
              className="min-w-[60px] bg-black text-white rounded-md px-3 py-2 hover:bg-[#d4af37]"
            >
              {age}
            </button>
          ))}
        </div>
      );

    case 2:
      return baseModal(
        'Seu objetivo principal',
        <div className="grid gap-3">
          {options.goals.map((goal) => (
            <button
              key={goal}
              onClick={() => handleNext('goal', goal)}
              className="w-full bg-black text-white rounded-md px-4 py-3 hover:bg-[#d4af37]"
            >
              {goal}
            </button>
          ))}
        </div>,
        'Com a sua rotina de treino, qual a sua maior prioridade?'
      );

    case 3:
      return baseModal(
        'Qual seu peso atual?',
        <div className="flex flex-wrap justify-center gap-2 max-h-60 overflow-y-auto">
          {options.weights.map((peso) => (
            <button
              key={peso}
              onClick={() => handleNext('currentWeight', peso)}
              className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#d4af37]"
            >
              {peso}kg
            </button>
          ))}
        </div>
      );

    case 4:
      return baseModal(
        'Qual a sua meta de peso?',
        <div className="flex flex-wrap justify-center gap-2 max-h-60 overflow-y-auto">
          {options.weights.map((peso) => (
            <button
              key={peso}
              onClick={() => handleNext('weightGoal', peso)}
              className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#d4af37]"
            >
              {peso}kg
            </button>
          ))}
        </div>
      );

    case 5:
      return baseModal(
        'Qual sua altura?',
        <div className="flex space-x-1 overflow-x-auto">
          {options.heights.map((altura) => (
            <button
              key={altura}
              onClick={() => handleNext('height', altura)}
              className="min-w-[60px] bg-black text-white rounded-md px-3 py-2 hover:bg-[#d4af37]"
            >
              {altura}cm
            </button>
          ))}
        </div>
      );

    case 6:
      return baseModal(
        'Quantos dias da semana você se compromete em treinar na academia?',
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3, 4, 5].map((dias) => {
            const isSelected = selectedFrequency === dias;
            return (
              <button
                key={dias}
                onClick={() => handleFrequencySelect(dias)}
                disabled={isSaving}
                className={`rounded-md px-4 py-3 ${
                  isSelected
                    ? 'bg-[#d4af37] text-black ring-2 ring-[#d4af37]'
                    : 'bg-black text-white hover:bg-[#d4af37]'
                } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {dias}x
              </button>
            );
          })}
        </div>
      );

          case 7:
      return baseModal(
        'Qual o seu biotipo?',
        <div className="grid gap-3">
          {options.biotipo.map((type) => (
            <button
              key={type}
              onClick={() => handleNext('biotipo', type)}
              className="w-full bg-black text-white rounded-md px-4 py-3 hover:bg-[#d4af37]"
            >
              {type}
            </button>
          ))}
        </div>,
        'O biotipo influencia na resposta aos treinos e alimentação.'
      );

    case 8:
      return baseModal(
        'Qual seu nível de treino?',
        <div className="grid gap-3">
          {options.activityLevels.map((level) => (
            <button
              key={level}
              onClick={() => handleNext('activityLevel', level)}
              className="w-full bg-black text-white rounded-md px-4 py-3 hover:bg-[#d4af37]"
            >
              {level}
            </button>
          ))}
        </div>,
        'Isso nos ajuda a personalizar melhor seus treinos.'
      );

    default:
      return null;
  }
};

export default WelcomeModal;
