# UnaHur Anti-Social Net

> **Trabajo Práctico N°2** – Construcción de Interfaces de Usuario  
> **UnaHur Anti-Social Net** – Frontend en React + TypeScript

---

## 📋 Descripción del Proyecto

**UnaHur Anti-Social Net** es una red social desarrollada como parte del Trabajo Práctico N°2 de la materia *Construcción de Interfaces de Usuario* en la Universidad Nacional de Hurlingham.

La aplicación permite a los usuarios:

- **Iniciar sesión** con nickName y contraseña fija (`123456`)
- **Registrarse** como nuevos usuarios
-  **Ver el feed** de publicaciones recientes en la página de inicio
-  **Ver el detalle** de una publicación y sus comentarios
-  **Comentar** en cualquier publicación
-  **Ver su perfil** con todas sus publicaciones
-  **Crear nuevas publicaciones** con descripción, etiquetas e imágenes
-  **Cerrar sesión**

El proyecto utiliza una **API REST** provista por la cátedra, y toda la lógica de autenticación es simulada (sin JWT).

---

## Tecnologías Utilizadas

| Tecnología | Descripción |
|------------|-------------|
| **React 18** | Biblioteca para construir interfaces de usuario |
| **TypeScript 5** | Tipado estático para JavaScript |
| **Vite** | Bundler rápido para desarrollo y producción |
| **React Router DOM 6** | Navegación entre vistas y rutas protegidas |
| **Fetch API** | Consumo de endpoints REST (nativo, sin axios) |
| **CSS Modules / CSS Nativo** | Estilos personalizados con soporte para tema claro/oscuro |
| **localStorage** | Persistencia de sesión (usuario logueado) |
| **React Context** | Gestión global del estado de autenticación |

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/unahur-anti-social-net.git
cd unahur-anti-social-net

```
### 2. Instalar dependencias

```bash
npm install
```
### 3. Configurar backend

```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
npm install
npm start
# El servidor correrá en http://localhost:3001
```

### 4.Iniciar el front-end

```bash
npm run dev

```

El proyecto estará disponible en http://localhost:5173

