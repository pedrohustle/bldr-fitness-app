import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
    console.log('register:', register);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(formData.email, formData.password, { name: formData.name });
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Erro ao registrar');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      {/* Vídeo de fundo */}
      <video
          className="fixed top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          src="/videos/gym.mp4" 
          onError={() => console.error('Erro ao carregar o vídeo')}
        />

      {/* Overlay escuro para contraste */}
      <div className="absolute inset-0 bg-black/60 bg-opacity-70 z-0" />

      {/* Conteúdo do formulário */}
      <div className="relative z-10 w-full max-w-md bg-black border border-yellow-400 p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">Criar Conta</h2>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-500"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-yellow-500"
              placeholder="Sua senha"
            />
          </div>

          <Button
            type="submit"
            className="bg-black border transition text-white px-4 py-2 rounded-full w-full hover:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 active:bg-yellow-400"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="text-center mt-6 text-gray-400 text-sm">
          Já tem uma conta?{' '}
          <button
            type="button"
            className="text-yellow-400 underline"
            onClick={() => navigate('/')}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
