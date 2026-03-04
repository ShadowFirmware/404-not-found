import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MapPin, Shield } from 'lucide-react';
import Button from '../../components/common/Button';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Encuentra el match perfecto para tu mascota
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Conecta con otros dueños de mascotas cerca de ti
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Comenzar ahora</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Iniciar sesión</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
        <div className="text-center">
          <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Matching Inteligente
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Algoritmo basado en características y compatibilidad
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Geolocalización
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Encuentra mascotas cerca de ti (1-15 km)
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Chat en Tiempo Real
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Comunícate instantáneamente con otros dueños
          </p>
        </div>

        <div className="text-center">
          <div className="bg-primary-100 dark:bg-primary-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Seguro y Confiable
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Perfiles verificados y comunidad activa
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
