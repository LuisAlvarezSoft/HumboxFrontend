Humbox - Red Social Estudiantil
Descripción
Humbox es una plataforma social diseñada para estudiantes que permite:

Visualizar publicaciones de otros usuarios

Crear y compartir contenido académico y social

Personalizar perfiles de usuario

Tecnologías Principales
Frontend: Vue 3, Nuxt 3, Nuxt UI

Gestión de estado: Pinia

Estilos: Tailwind CSS

Estructura del Proyecto
humbox-frontend/
├── components/    # Componentes reutilizables
├── composables/   # Lógica reusable
├── pages/         # Vistas de la aplicación
├── public/        # Archivos estáticos
├── stores/        # Gestión de estado (Pinia)
└── nuxt.config.ts # Configuración de Nuxt
Instalación
Clonar el repositorio:

git clone https://github.com/LuisAlvarezSoft/HumboxFrontend.git
cd HumboxFrontend

Instalar dependencias:
npm install

Iniciar servidor de desarrollo:

npm run dev

Flujo de Trabajo

El repositorio sigue el siguiente esquema de ramas:

main: Versión de producción

qa: Entorno de pruebas

dev: Desarrollo principal

feature/[nombre]: Ramas para nuevas funcionalidades

fix/[nombre]: Ramas para correcciones

Hacer commit de los cambios:

git add .
git commit -m "Descripción clara de los cambios"
Subir los cambios y crear pull request hacia dev