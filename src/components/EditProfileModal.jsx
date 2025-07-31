import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { updateUserProfile } from '../services/firebase';

const EditProfileModal = ({ isOpen, onClose, userProfile, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    biotipo: '',
    frequency: '',
    activityLevel: '',
    weightGoal: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        age: userProfile.age || '',
        height: userProfile.height || '',
        weight: userProfile.weight || '',
        fitnessGoal: userProfile.fitnessGoal || '',
        biotipo: userProfile.biotipo || '',
        frequency: userProfile.frequency || '',
        activityLevel: userProfile.activityLevel || '',
        weightGoal: userProfile.weightGoal || '',
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!userProfile?.uid) {
        console.error('User ID não encontrado para atualização');
        return;
      }
      // Atualiza o perfil no Firestore
      await updateUserProfile(userProfile.uid, formData);

      // Atualiza estado no componente pai para refletir as mudanças imediatamente
      if (onProfileUpdated) {
        onProfileUpdated({
          ...userProfile,
          ...formData,
        });
      }

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-zinc-900 p-6 rounded-xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-montserrat-bold mb-4">Editar Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Idade"
            type="number"
          />
          <Input
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="Altura (cm)"
            type="number"
          />
          <Input
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Peso (kg)"
            type="number"
          />
          <Input
            name="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleChange}
            placeholder="Objetivo"
          />
          <Input
            name="biotipo"
            value={formData.biotipo}
            onChange={handleChange}
            placeholder="Biotipo"
          />
          <Input
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            placeholder="Frequência semanal"
            type="number"
          />
          <Input
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            placeholder="Nível de Atividade"
          />
          <Input
            name="weightGoal"
            value={formData.weightGoal}
            onChange={handleChange}
            placeholder="Meta de Peso (kg)"
            type="number"
        />
        </div>

        <Button
          className="mt-6 w-full font-montserrat-bold"
          onClick={handleSubmit}
        >
          Salvar Alterações
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
