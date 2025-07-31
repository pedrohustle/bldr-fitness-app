import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import WelcomeModal from '../components/WelcomeModal';

const isProfileComplete = (profile) => {
  if (!profile) return false;

  const requiredFields = [
    'age',
    'height',
    'fitnessGoal',
    'weeklyFrequency',
    'currentWeight',
    'weightGoal',
    'activityLevel',
    'biotipo'
  ];

  return requiredFields.every(
    (field) => profile[field] !== undefined && profile[field] !== ''
  );
};

const Onboarding = () => {
  const { userProfile, setUserProfile } = useContext(AuthContext);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile) return;

    const complete = isProfileComplete(userProfile);

    if (complete) {
      navigate('/dashboard');
    } else {
      setShowWelcomeModal(true); // só mostra o modal se o perfil estiver incompleto
    }
  }, [userProfile, navigate]);

  // Enquanto userProfile estiver carregando, exibe nada
  if (!userProfile) return null;

  // Só mostra o modal se showModal estiver true
  return (
    <>
      {showWelcomeModal && (
        <WelcomeModal
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          show={showWelcomeModal}
          onComplete={() => {
            setShowWelcomeModal(false);
            navigate('/dashboard');
          }}
        />
      )}
    </>
  );
};

export default Onboarding;
