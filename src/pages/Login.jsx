import { useState, useContext } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const SplashLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await loginWithEmail(formData.email, formData.password);

    setLoading(false);
    
    if (result.success) {
      setError('');
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erro ao entrar');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error || 'Erro ao entrar com Google');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-20 bg-[url('/fundo-fitness.jpg')]"></div>

        <video
          className="fixed top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          src="/videos/gym.mp4" 
          onError={() => console.error('Erro ao carregar o vídeo')}
        />

        {/* Overlay para escurecer o vídeo e melhorar contraste */}
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 bg-opacity-70 z-10" />

      <AnimatePresence>
        {!showForm && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
            className="relative z-10 text-center flex flex-col items-center justify-center h-screen max-w-md mx-auto px-4 -translate-y-15"
          >
            <motion.img
              src="images/BLDR_CLEAN_BGLESS.png"
              alt="Logo BLDR"
              className="w-48 md:w-64 lg:w-72 mx-auto -mb-22"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
            />
            <motion.p
              className="mt-4 sm:mt-0 text-yellow-400 font-montserrat text-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <i>CONSTRUA sua melhor versão</i>
            </motion.p>
            <Button
              className="mt-9 px-6 py-3 text-lg bg-black-500 hover:bg-yellow-400 text-white rounded-full w-full"
              onClick={() => setShowForm(true)}
            >
              Entrar
            </Button>
            <p className="text-gray-400 mt-6">
              Não tem conta?{' '}
              <button
                className="text-yellow-400 underline"
                onClick={() => navigate('/register')}
                type="button"
              >
                Criar agora
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md bg-black border border-yellow-400 p-8 rounded-xl shadow-lg text-white"
          >
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Entrar</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-yellow-500"
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-8 rounded-full bg-black-500 text-white hover:bg-yellow-400"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-400 my-4">ou</div>

            <Button
              onClick={handleGoogleLogin}
              className="w-full rounded-full bg-black-500 !text-white hover:bg-yellow-400"
              variant="outline"
              disabled={loading}
            >
              Entrar com Google
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Não possui uma conta?{' '}
                <button
                  className="text-yellow-400 hover:underline"
                  onClick={() => navigate('/register')}
                  type="button"
                >
                  Criar agora
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashLogin;
