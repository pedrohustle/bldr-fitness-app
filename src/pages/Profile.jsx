// ... imports (sem alteração)
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { Settings, History, LogOut, Pencil } from 'lucide-react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { 
  deleteUser, 
  signOut, 
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';


const Profile = () => {
  const { userProfile, logout, setUserProfile } = useAuth();
  const navigate = useNavigate(); 
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAchievements] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const fromSettings = new URLSearchParams(location.search).get('from') === 'settings';

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (fromSettings) {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [fromSettings]);

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);         
    setUserProfile(updatedUser);  
  };

  // Aqui usamos auth e db importados (REMOVIDAS as linhas que criavam instâncias locais)

  const handleDeleteAccount = async (password) => {
  if (!auth.currentUser || !password) return;

  const email = auth.currentUser.email;
  const credential = EmailAuthProvider.credential(email, password);

  try {
    await reauthenticateWithCredential(auth.currentUser, credential);
    console.log('🔐 Reautenticado');

    await deleteDoc(doc(db, 'users', auth.currentUser.uid));
    console.log('Documento do Firestore excluído');
    await deleteUser(auth.currentUser);

    console.log('✅ Conta excluída');
    navigate('/');
  } catch (error) {
    console.error('❌ Erro ao excluir conta:', error);
    if (error.code === 'auth/wrong-password') {
      alert('Senha incorreta. Tente novamente.');
    } else {
      alert('Erro ao excluir conta. Faça login novamente.');
      await signOut(auth);
      navigate('/');
    }
  } finally {
    setShowDeleteModal(false);
  }
};

  if (!user) {
    return (
      <div className="p-4">
        <p className="text-center text-muted-foreground font-montserrat">Carregando perfil...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Treinos Concluídos', value: user.workoutsCompleted || 0 },
    { label: 'Dias Consecutivos', value: user.currentStreak || 0 },
  ];

  const achievements = user.unlockedAchievements || [];

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="bg-black text-yellow-400 p-6 rounded-b-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold">PERFIL</h1>
          <p className="text-gray-300">Sua jornada fitness</p>
        </div>
      </div>

      {/* Avatar e nome */}
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-montserrat-bold">
                {user.displayName?.split(' ').map((n) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-montserrat-bold text-foreground">{user.displayName || 'Usuário'}</h2>
                {user.isPremium && (
                  <Badge className="bg-primary text-primary-foreground">
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-montserrat">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-montserrat-bold text-primary">{user.weight || '-'}kg</p>
              <p className="text-sm text-muted-foreground font-montserrat">Peso</p>
            </div>
            <div>
              <p className="text-2xl font-montserrat-bold text-primary">{user.height || '-'}cm</p>
              <p className="text-sm text-muted-foreground font-montserrat">Altura</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade para Premium */}
      {!user.isPremium && (
        <div className="text-center">
          <Button
            className="primary"
            onClick={() => navigate('/checkout')}
          >
            Upgrade para Premium
          </Button>
        </div>
      )}

      {/* Informações */}
      <Card className="card-glass">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="font-montserrat text-lg text-center w-full">Informações</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsModalOpen(true)} 
            aria-label="Editar informações do perfil"
            className="hover:bg-yellow-500 hover:text-black transition"
          >
            <Pencil size={16} />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between"><span className="font-montserrat text-muted-foreground">Biotipo</span><span className="font-montserrat-bold text-foreground">{user.biotipo || '-'}</span></div>
          <div className="flex justify-between"><span className="font-montserrat text-muted-foreground">Objetivo</span><span className="font-montserrat-bold text-foreground">{user.fitnessGoal || '-'}</span></div>
          <div className="flex justify-between"><span className="font-montserrat text-muted-foreground">Frequência semanal</span><span className="font-montserrat-bold text-foreground">{user.frequency ? `${user.frequency} dia${user.frequency > 1 ? 's' : ''}` : '-'}</span></div>
          <div className="flex justify-between"><span className="font-montserrat text-muted-foreground">Nível</span><span className="font-montserrat-bold text-foreground">{user.activityLevel || '-'}</span></div>
          <div className="flex justify-between"><span className="font-montserrat text-muted-foreground">Idade</span><span className="font-montserrat-bold text-foreground">{user.age || '-'} anos</span></div>
          <div className="flex justify-between"><span className="font-montserrat text-muted-foreground">Meta de Peso</span><span className="font-montserrat-bold text-foreground">{user.weightGoal ? `${user.weightGoal}kg` : '-'}</span></div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="font-montserrat text-lg text-center">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-montserrat-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-montserrat">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conquistas */}
      {showAchievements && (
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="font-montserrat text-lg text-center">Conquistas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground font-montserrat text-center">Nenhuma conquista desbloqueada ainda.</p>
            ) : achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-montserrat-bold text-foreground">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground font-montserrat">{achievement.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Botões inferiores */}
      <Card className="card-glass">
        <CardContent className="p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start font-montserrat"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-3" size={18} />
            Configurações
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start font-montserrat"
            onClick={() => navigate('/history')}
          >
            <History className="mr-3" size={18} />
            Histórico
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start font-montserrat text-destructive hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-3" size={18} />
            Sair
          </Button>

          {/* Botão para excluir conta */}
          <Button
            variant="destructive"
            className="w-full font-montserrat mt-2"
            onClick={() => setShowDeleteModal(true)}
          >
            Excluir Conta
          </Button>
        </CardContent>
      </Card>

      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        userProfile={user}
        onProfileUpdated={handleProfileUpdated} 
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default Profile;
