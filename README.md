# Capilora Salón — Sistema de Reservas Online

Sistema completo de reservas para negocios de servicios (peluquerías, spas, consultorios), con vista pública de reserva y panel de administración para el negocio.

**Demo en vivo:** [https://capilora-salon.vercel.app/](https://capilora-salon.vercel.app/)
**Repositorio:** [https://github.com/JhoyCardona/capilora-salon](https://github.com/JhoyCardona/capilora-salon)

## Capturas

<img width="1852" height="1028" alt="screencapture-hair-salon-booking-system-sable-vercel-app-2026-07-06-20_02_38" src="https://github.com/user-attachments/assets/f75265b0-6e5b-41d8-aae7-afa824c76883" />

## Funcionalidades

**Vista pública (sin necesidad de cuenta):**
- Catálogo de servicios del negocio
- Selección de fecha con cálculo automático de horarios realmente disponibles (cruza la disponibilidad del negocio con las reservas ya existentes)
- Formulario de reserva con validación de solapamiento de horarios

**Panel del negocio (autenticado):**
- Registro e inicio de sesión con JWT
- Gestión de turnos: ver y cancelar reservas
- Gestión de servicios (crear, editar, eliminar)
- Gestión de horarios de disponibilidad por día de la semana

## Stack técnico

- **Frontend:** React + Vite, CSS responsive (mobile-first)
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT + bcrypt para hasheo de contraseñas
- **Deploy:** Vercel (frontend), Render (backend), Neon (base de datos)

## Arquitectura

El proyecto sigue una arquitectura de 3 capas:

El backend expone una API REST organizada en rutas/controladores/middleware, con:
- Consultas parametrizadas (protección contra SQL injection)
- Middleware de autenticación reutilizable
- Validación de pertenencia de recursos (un negocio solo puede modificar sus propios datos)

## Cómo correrlo localmente

### Backend

```bash
cd backend
npm install
# Crear un archivo .env con DATABASE_URL, JWT_SECRET y PORT
psql -d tu_base_de_datos -f sql/schema.sql
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Crear un archivo .env.local con VITE_API_URL apuntando a tu backend
npm run dev
```

## Autor

Desarrollado por [Jhoyners Cardona] (https://github.com/JhoyCardona) (https://www.linkedin.com/in/jhoyners-cardona-dev)
