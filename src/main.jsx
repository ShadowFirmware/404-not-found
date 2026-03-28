import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import App from './App.jsx';

// Cargar Facebook SDK dinámicamente
window.fbAsyncInit = function () {
  window.FB.init({
    appId: import.meta.env.VITE_FACEBOOK_APP_ID,
    cookie: true,
    xfbml: true,
    version: 'v19.0',
  });
};

(function (d, s, id) {
  if (d.getElementById(id)) return;
  const fjs = d.getElementsByTagName(s)[0];
  const js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/es_LA/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
