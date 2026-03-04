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
]);
