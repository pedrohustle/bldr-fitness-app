// src/components/ConfirmDeleteModal.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './ui/button';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password) {
      setError('Digite sua senha para confirmar.');
      return;
    }
    setError('');
    onConfirm(password);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-80 px-4">
        <Dialog.Panel className="bg-zinc-900 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-lg border border-zinc-700">
          <Dialog.Title className="text-xl font-montserrat-bold text-yellow-400 text-center">
            Confirmar Exclusão
          </Dialog.Title>
          <p className="text-sm text-muted-foreground text-center font-montserrat">
            Para sua segurança, digite sua senha para confirmar a exclusão da conta.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full px-4 py-2 rounded-md bg-zinc-800 text-white placeholder-gray-500 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-montserrat"
          />
          {error && <p className="text-red-500 text-sm font-montserrat text-center">{error}</p>}

          <div className="flex justify-center gap-4 mt-2">
            <Button
              onClick={onClose}
              variant='outline'
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              variant='outline'
            >
              Confirmar
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
