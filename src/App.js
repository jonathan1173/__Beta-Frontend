import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';
import Dashboard from './Pages/Dashboard';
import Register from './Pages/Register';
import Login from './Pages/login';
import NavBar from './components/NavBar';
import PrivateRoute from './contexts/PrivateRoute';
import Home from './Pages/Home';
import ChallengesList from './Pages/ChallengesList';
import Layout from './layouts/Layout'; // Asegúrate de tener este componente creado
import ChallengeDetails from './Pages/ChallengeDetails';

function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <Layout> {/* Aquí engloba los componentes con Layout */}
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Ruta privada */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/challenges" element={<ChallengesList />} />
                <Route path="/challenges/:id" element={<ChallengeDetails />} />
              </Route>
            </Routes>
          </Layout>
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
}

export default App;
