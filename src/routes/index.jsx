import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import SplashScreen from '../features/auth/SplashScreen';
import LandingPage from '../features/auth/LandingPage';
import Home from '../features/auth/Home';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import RecuperarContrasena from '../features/auth/RecuperarContrasena';
import IngresarCodigo from '../features/auth/IngresarCodigo';
import NuevaContrasena from '../features/auth/NuevaContrasena';
import PetOnboarding from '../features/pets/PetOnboarding';
import Dashboard from '../components/dashboard/Dashboard';
import Error404 from '../components/errors/Error404';
import Error500 from '../components/errors/Error500';
import LocationPermission from '../features/auth/LocationPermission';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashScreen />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/location-permission',
    element: <LocationPermission />,
  },
  {
    path: '/pet-onboarding',
    element: <PetOnboarding />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    element: <Layout />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/recuperar-contrasena',
        element: <RecuperarContrasena />,
      },
      {
        path: '/codigo',
        element: <IngresarCodigo />,
      },
      {
        path: '/nueva-contrasena',
        element: <NuevaContrasena />,
      },
    ],
  },
  {
    path: '/error-500',
    element: <Error500 />,
  },
  {
    path: '*',
    element: <Error404 />,
  },
]);
