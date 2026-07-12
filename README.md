# UnaHur Anti-Social Net

> **Trabajo Práctico N°2** – Construcción de Interfaces de Usuario
> **UnaHur Anti-Social Net** – Frontend en React + TypeScript

---

## Descripción del Proyecto

**UnaHur Anti-Social Net** es una red social desarrollada como parte del Trabajo Práctico N°2 de la materia *Construcción de Interfaces de Usuario* en la Universidad Nacional de Hurlingham.

La interfaz utiliza un layout de dos columnas: una barra de navegación lateral fija y un feed centrado tipo timeline con las publicaciones.

La aplicación permite a los usuarios:

- **Iniciar sesión** con nickName y contraseña fija (`123456`)
- **Registrarse** como nuevos usuarios
- **Ver el feed** de publicaciones recientes en la página de inicio
- **Ver el detalle** de una publicación, sus etiquetas, imágenes y comentarios
- **Comentar** en cualquier publicación
- **Ver su perfil** con todas sus publicaciones
- **Crear nuevas publicaciones** con descripción, URLs de imágenes y selección de etiquetas existentes
- **Cerrar sesión**

El proyecto utiliza una **API REST** provista por la cátedra (a modo de "caja negra", sin modificaciones), y toda la lógica de autenticación es simulada (sin JWT).

---

## 🌐 API utilizada

Este proyecto consume el backend provisto por la cátedra:

**Repositorio:** [https://github.com/lucasfigarola/backend-api](https://github.com/lucasfigarola/backend-api)

Corriendo localmente, queda disponible en:

```
http://localhost:3001
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **React 18** | Biblioteca para construir interfaces de usuario |
| **TypeScript 5** | Tipado estático para JavaScript |
| **Vite** | Bundler rápido para desarrollo y producción |
| **React Router DOM 6** | Navegación entre vistas y rutas protegidas |
| **Fetch API** | Consumo de endpoints REST (nativo, sin axios) |
| **CSS nativo** | Estilos personalizados con soporte para tema claro/oscuro y layout tipo timeline |
| **localStorage** | Persistencia de sesión (usuario logueado) |
| **React Context** | Gestión global del estado de autenticación |

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/unahur-anti-social-net.git
cd unahur-anti-social-net
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Configurar y correr el backend

En otra carpeta (fuera del proyecto del frontend):

```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
npm install
node seed.js   # crea la base de datos SQLite con datos de ejemplo
npm start
# El servidor correrá en http://localhost:3001
```


### 4. Iniciar el frontend

Con el backend ya corriendo en `http://localhost:3001`:

```bash
npm run dev
```

El proyecto estará disponible en [http://localhost:5173](http://localhost:5173)

---

## Estructura del proyecto

```
src/
├── api/            # Funciones de consumo de la API (fetch)
├── components/
│   ├── auth/       # Register
│   └── common/     # Sidebar, PostCard, PostFeed, ProtectedRoute
├── context/        # AuthContext (sesión global)
├── pages/          # Home, LoginPage, Profile, PostDetail, CreatePost
├── types/          # Interfaces de TypeScript (User, Post, Comment, Tag, etc.)
├── index.css       # Estilos globales y layout
└── App.tsx         # Rutas y estructura general
```

---

## Integrantes del grupo

  Fontivero Agustina

