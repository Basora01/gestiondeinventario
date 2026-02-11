# 📦 Sistema de Gestión de Inventario

Sistema completo de gestión de inventario con control de artículos, almacenes, tipos de inventario, existencias por almacén y transacciones (entradas, salidas, ajustes).

## 📋 Características

- **Gestión de Artículos** — CRUD completo con tipo de inventario, costo unitario y estado
- **Tipos de Inventario** — Clasificación de artículos con cuenta contable
- **Almacenes** — Gestión de ubicaciones de almacenamiento
- **Existencias por Almacén** — Control de stock por artículo y almacén
- **Transacciones** — Registro de entradas, salidas y ajustes con validación completa
- **Prevención de stock negativo** — Validación automática en cada transacción
- **Transacciones atómicas** — Uso de transacciones de BD para garantizar integridad

## 🛠️ Tecnologías

| Componente | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Base de Datos | MySQL 8 |
| Vistas | EJS (server-rendered) |
| Estilos | CSS puro (diseño responsive) |
| Pruebas | Jest |
| Contenedores | Docker + Docker Compose |

## 📁 Estructura del Proyecto

```
├── docker-compose.yml          # MySQL + App
├── Dockerfile
├── package.json
├── sql/
│   ├── 001_schema.sql          # Esquema de base de datos
│   └── 002_datos_semilla.sql   # Datos iniciales
├── public/
│   ├── css/styles.css          # Estilos globales
│   └── js/app.js               # JavaScript del cliente
├── src/
│   ├── server.js               # Punto de entrada
│   ├── domain/
│   │   ├── entities/           # Artículo, Almacén, TipoInventario, etc.
│   │   ├── enums/              # Estado, TipoTransaccion
│   │   ├── services/           # ServicioInventario
│   │   └── interfaces/         # AuthService, ReportService (placeholders)
│   ├── application/
│   │   └── use-cases/          # Casos de uso por módulo
│   ├── infrastructure/
│   │   ├── config/             # Conexión a BD
│   │   └── repositories/      # Repositorios MySQL
│   └── presentation/
│       ├── middleware/         # Error handler, auth placeholder
│       ├── routes/            # Rutas Express
│       └── views/             # Vistas EJS
└── tests/
    └── domain/                # Pruebas unitarias
```

## ⚙️ Requisitos Previos

- **Node.js** 18+ y npm
- **MySQL** 8.0+ (local o Docker)

## 🚀 Instalación y Ejecución

### Opción 1: Local (sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Crear la base de datos MySQL
# Ejecutar en su cliente MySQL:
mysql -u root -p < sql/001_schema.sql
mysql -u root -p < sql/002_datos_semilla.sql

# 3. Configurar variables de entorno
# Editar el archivo .env con sus credenciales de MySQL:
#   DB_HOST=localhost
#   DB_PORT=3306
#   DB_USER=root
#   DB_PASSWORD=su_contraseña
#   DB_NAME=gestion_inventario

# 4. Iniciar servidor
npm run dev
```

### Opción 2: Docker Compose

```bash
docker-compose up --build
```

La aplicación estará disponible en: **http://localhost:3000**

## 🧪 Pruebas

```bash
# Ejecutar pruebas unitarias
npm test
```

Las pruebas cubren la lógica del `ServicioInventario`:
- Entrada incrementa stock correctamente
- Salida decrementa stock correctamente
- No se permite stock negativo
- Ajuste calcula delta correctamente
- Validaciones de datos

## 📖 Guía de Uso

### Panel de Control
Al abrir la aplicación se muestra el panel principal con acceso a los 5 módulos.

### Flujo típico de trabajo
1. Crear **Tipos de Inventario** (Materia Prima, Producto Terminado, etc.)
2. Crear **Almacenes** (Almacén Principal, Almacén Secundario, etc.)
3. Crear **Artículos** asignando tipo de inventario y costo unitario
4. Registrar **Transacciones**:
   - **Entrada**: Aumenta stock en almacén y existencia total del artículo
   - **Salida**: Disminuye stock (valida que no quede negativo)
   - **Ajuste**: Establece una nueva cantidad; el sistema calcula la diferencia

### Lógica de Ajuste
Al registrar una transacción de tipo **"Ajuste"**, el campo "Cantidad" representa la **nueva cantidad deseada** en ese almacén. El sistema calcula automáticamente:
```
delta = cantidad_nueva - cantidad_actual
```
Y ajusta tanto la existencia del almacén como la existencia total del artículo.

## 🔧 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno | development |
| `DB_HOST` | Host de MySQL | localhost |
| `DB_PORT` | Puerto de MySQL | 3306 |
| `DB_USER` | Usuario de MySQL | root |
| `DB_PASSWORD` | Contraseña de MySQL | root |
| `DB_NAME` | Nombre de la BD | gestion_inventario |

## 📝 Licencia

MIT
