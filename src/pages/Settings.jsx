import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../components/ui/switch';
import { Button } from '../components/ui/button';
import FeedbackModal from '../components/Feedback/FeedbackModal.jsx';

const Settings = () => {
  const navigate = useNavigate();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const togglePushNotifications = () => {
    setPushNotificationsEnabled((prev) => !prev);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white text-[#d4af37] font-montserrat p-4 pb-20">
      <header className="bg-black p-6 rounded-b-3xl mb-6 relative">
        <h1 className="text-2xl font-bold text-center">Configurações</h1>
        <button
          onClick={handleClose}
          aria-label="Fechar configurações"
          className="absolute top-6 right-6 text-yellow-400 text-3xl font-bold hover:text-yellow-300 transition cursor-pointer select-none"
          type="button"
        >
          ×
        </button>
      </header>

      <section className="mb-10">
        <h2 className="text-xl text-yellow-400 font-semibold mb-4 text-center">Preferências</h2>
        <div className="flex items-center justify-between mb-6 px-4">
          <span className="text-black">Notificações Push</span>
          <Switch
            id="push-notifications"
            checked={pushNotificationsEnabled}
            onCheckedChange={togglePushNotifications}
            className="data-[state=checked]:bg-green-600"
          />
        </div>
        <div className="flex items-center justify-between px-4">
          <span className="text-black">Tema Escuro</span>
          <Switch id="dark-theme" checked disabled />
        </div>
      </section>

      <section className="mb-10 px-4 text-center">
        <h2 className="text-xl text-yellow-400 font-semibold mb-6">Conta</h2>
        <Button
          variant="outline"
          className="w-full max-w-xs mx-auto rounded-full border-white text-black hover:bg-[#d4af37] hover:text-black transition"
          onClick={() => navigate('/profile')}
        >
          Editar Perfil
        </Button>
      </section>

      <section className="px-4 text-center">
        <h2 className="text-xl text-yellow-400 font-semibold mb-4">Feedback</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Tem alguma sugestão, bug ou elogio? Envie para a gente!
        </p>
        <Button
          variant='outline'
          onClick={() => setShowFeedbackModal(true)}
        >
          Enviar Feedback
        </Button>
      </section>

      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </div>
  );
};

export default Settings;
