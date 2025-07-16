import React, { useState } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  ScaleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { signUpWithEmail, signInWithGoogle } from '../services/firebase';
import { BIOTYPES } from '../utils/constants';

const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    height: '',
    fitnessGoal: '',
    activityLevel: '',
    biotipo: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem');
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = {
      name: formData.name,
      age: parseInt(formData.age) || null,
      weight: parseFloat(formData.weight) || null,
      height: parseFloat(formData.height) || null,
      fitnessGoal: formData.fitnessGoal,
      activityLevel: formData.activityLevel,
      biotipo: formData.biotipo
    };

    const result = await signUpWithEmail(formData.email, formData.password, userData);
    
    if (result.success) {
      onRegisterSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();
    
    if (result.success) {
      onRegisterSuccess();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const renderStep1 = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Criar Conta
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo *
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Seu nome"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha *
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar senha *
          </label>
          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Confirme sua senha"
              required
            />
          </div>
        </div>

        <Button
          onClick={handleNextStep}
          variant="primary"
          className="w-full"
        >
          Continuar
        </Button>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
        Perfil Fitness
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Ajude-nos a personalizar sua experiência
      </p>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Idade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Idade
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ex: 25"
            />
          </div>
        </div>

        {/* Peso e Altura */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso (kg)
            </label>
            <div className="relative">
              <ScaleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="70"
                step="0.1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="175"
            />
          </div>
        </div>

        {/* Objetivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objetivo principal
          </label>
          <select
            name="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Selecione seu objetivo</option>
            <option value="hipertrofia">Ganhar massa muscular</option>
            <option value="emagrecimento">Perder peso</option>
            <option value="definicao">Definir músculos</option>
            <option value="manutencao">Manter forma física</option>
          </select>
        </div>

        {/* Nível de atividade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nível de atividade
          </label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Selecione seu nível</option>
            <option value="sedentario">Sedentário</option>
            <option value="leve">Levemente ativo</option>
            <option value="moderado">Moderadamente ativo</option>
            <option value="intenso">Muito ativo</option>
          </select>
        </div>

        {/* Biotipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Biotipo
          </label>
          <select
            name="biotipo"
            value={formData.biotipo}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Selecione seu biotipo</option>
            <option value="ectomorfo">Ectomorfo (magro, metabolismo rápido)</option>
            <option value="mesomorfo">Mesomorfo (atlético, equilibrado)</option>
            <option value="endomorfo">Endomorfo (tendência a ganhar peso)</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </div>
      </form>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BLDR</h1>
          <p className="text-gray-600">Construa seu melhor eu</p>
        </div>

        <Card className="p-6">
          {step === 1 ? renderStep1() : renderStep2()}

          {step === 1 && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGoogleRegister}
                  disabled={loading}
                  className="w-full mt-4"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar com Google
                </Button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Entrar
                  </button>
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Register;

