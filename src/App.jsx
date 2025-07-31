import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import BottomNavigation from './components/Navigation/BottomNavigation';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import SplashLogin from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import Checkout from './pages/Checkout';
import SportDetail from './pages/SportDetail';
import SportsPremium from './pages/SportsPremium';
import RecipePage from './pages/RecipesPage';

import Tennis from './pages/sports/Tennis';                   // ADICIONADO
import Agility from './pages/trainings/tennis/Agility';       // ADICIONADO
import Power from './pages/trainings/tennis/Power';           // ADICIONADO
import Pilates from './pages/sports/Pilates.jsx';      // IMPORT AJUSTADO

import { useAuth } from './contexts/AuthContext';
import './App.css';

function PrivateRoute({ children }) {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Carregando dados do usuário...</div>;
  }

  if (!userProfile) {
    return <Navigate to="/" />;
  }

  if (!userProfile.age) {
    return <Navigate to="/onboarding" />;
  }

  return children;
}

function App() {
  const { userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Carregando dados do usuário...</div>;
  }

  const redirectTo = (pathname = '/') => {
    if (!userProfile) return '/';
    if (!userProfile.age) return '/onboarding';

    const allowedRoutes = ['/premium', '/sports'];

    if (allowedRoutes.some(route => pathname.startsWith(route))) {
      return pathname;
    }

    return '/dashboard';
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={userProfile ? <Navigate to={redirectTo(location.pathname)} /> : <SplashLogin />}
        />
        <Route
          path="/register"
          element={userProfile ? <Navigate to={redirectTo(location.pathname)} /> : <Register />}
        />
        <Route
          path="/onboarding"
          element={
            !userProfile ? (
              <Navigate to="/" />
            ) : userProfile.age ? (
              <Navigate to="/dashboard" />
            ) : (
              <Onboarding />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <Workouts />
            </PrivateRoute>
          }
        />
        <Route
          path="/nutrition"
          element={
            <PrivateRoute>
              <Nutrition />
            </PrivateRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <PrivateRoute>
              <Progress />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/sports/:sportName"
          element={
            <PrivateRoute>
              <SportDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/premium"
          element={
            <PrivateRoute>
              <SportsPremium />
            </PrivateRoute>
          }
        />

        {/* ROTAS DE TÊNIS ADICIONADAS */}
        <Route
          path="/sports/tenis"
          element={
            <PrivateRoute>
              <Tennis />
            </PrivateRoute>
          }
        />
        <Route
          path="/trainings/tennis/agility"
          element={
            <PrivateRoute>
              <Agility />
            </PrivateRoute>
          }
        />
        <Route
          path="/trainings/tennis/power"
          element={
            <PrivateRoute>
              <Power />
            </PrivateRoute>
          }
        />
        {/* FIM DAS ROTAS DE TÊNIS */}

        {/* ROTA DINÂMICA PILATES */}
        <Route
          path="/sports/pilates"
          element={
            <PrivateRoute>
              <Pilates />
            </PrivateRoute>
          }
        />

        {/* ROTA PARA RECEITAS */}
        <Route
          path="/recipes"
          element={
            <PrivateRoute>
              <RecipePage />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to={redirectTo(location.pathname)} replace />}
        />
      </Routes>

      {userProfile && userProfile.age && <BottomNavigation />}
    </div>
  );
}

export default App;
