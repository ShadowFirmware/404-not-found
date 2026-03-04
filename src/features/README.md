# Features Structure

Esta carpeta contiene todos los features/módulos de la aplicación organizados por funcionalidad.

## Estructura

```
features/
├── auth/           # Autenticación y páginas públicas
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── pets/           # Gestión de mascotas
│   ├── PetCard.jsx
│   ├── CreatePet.jsx
│   └── PetList.jsx
│
├── matches/        # Sistema de matching
│   ├── Matches.jsx
│   └── MatchCard.jsx
│
├── chat/           # Chat en tiempo real
│   ├── Chat.jsx
│   ├── ChatList.jsx
│   └── ChatMessage.jsx
│
└── admin/          # Panel administrativo
    ├── Dashboard.jsx
    └── UserManagement.jsx
```

## Convenciones

- Cada feature puede tener sus propios componentes, estilos y lógica
- Los componentes compartidos van en `/src/components`
- Los servicios compartidos van en `/src/services`
- Los contexts globales van en `/src/context`
