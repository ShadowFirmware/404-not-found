# PauMatch - Frontend

Plataforma de matching para mascotas tipo Tinder con sistema de chat en tiempo real.

## Tecnologías

- **React 19** - Framework principal
- **Vite** - Build tool y dev server
- **React Router** - Navegación
- **TailwindCSS** - Estilos
- **Axios** - Cliente HTTP
- **Socket.io** - Chat en tiempo real
- **Lucide React** - Iconos

## Estructura del Proyecto

```
src/
├── components/
│   ├── auth/          # Componentes de autenticación
│   ├── pets/          # Componentes de mascotas
│   ├── matching/      # Componentes de matching
│   ├── chat/          # Componentes de chat
│   ├── admin/         # Componentes de administración
│   ├── layout/        # Layout y navegación
│   └── common/        # Componentes reutilizables
├── pages/             # Páginas principales
├── services/          # Servicios API
├── context/           # Context API (Auth, Theme, Socket)
├── hooks/             # Custom hooks
├── utils/             # Utilidades
├── routes/            # Configuración de rutas
└── assets/            # Imágenes e iconos
```

## Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de Entorno

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:8000
```

## Características

- ✅ Sistema de autenticación (Login/Register)
- ✅ Gestión de perfiles de mascotas (hasta 5 por usuario)
- ✅ Matching basado en características y geolocalización (1-15km)
- ✅ Chat en tiempo real con WebSockets
- ✅ Panel de administración
- ✅ Temas claro/oscuro
- ✅ Diseño responsive

## Temas

El proyecto incluye soporte para temas claro y oscuro que se pueden cambiar desde la navegación.

## API Backend

Este frontend se conecta con un backend Django. Asegúrate de que el backend esté corriendo en `http://localhost:8000`

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter
```
