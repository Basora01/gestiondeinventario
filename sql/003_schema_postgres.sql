-- ============================================================
-- Sistema de Gestión de Inventario — Esquema PostgreSQL (Supabase)
-- ============================================================

-- Tipos ENUM simulados con CHECK constraints o tipos nativos
-- En Supabase/Postgres recomendaos usar TEXT con CHECK para simplicidad,
-- o crear tipos con CREATE TYPE. Usaremos CHECK para máxima portabilidad.

-- -----------------------------------------------------------
-- Tabla: tipos_inventario
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_inventario (
  id            SERIAL PRIMARY KEY,
  descripcion   VARCHAR(150)  NOT NULL,
  cuenta_contable VARCHAR(50) NOT NULL DEFAULT '',
  estado        VARCHAR(20)   NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
  creado_en     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Tabla: articulos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS articulos (
  id                SERIAL PRIMARY KEY,
  descripcion       VARCHAR(200) NOT NULL,
  tipo_inventario_id INT         NOT NULL,
  costo_unitario    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estado            VARCHAR(20)   NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
  existencia_total  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creado_en         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_articulo_tipo_inventario
    FOREIGN KEY (tipo_inventario_id) REFERENCES tipos_inventario(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- -----------------------------------------------------------
-- Tabla: almacenes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS almacenes (
  id            SERIAL PRIMARY KEY,
  descripcion   VARCHAR(150)  NOT NULL,
  estado        VARCHAR(20)   NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')),
  creado_en     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------
-- Tabla: existencias_por_almacen
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS existencias_por_almacen (
  almacen_id    INT           NOT NULL,
  articulo_id   INT           NOT NULL,
  cantidad      DECIMAL(12,2) NOT NULL DEFAULT 0.00,

  PRIMARY KEY (almacen_id, articulo_id),

  CONSTRAINT fk_existencia_almacen
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_existencia_articulo
    FOREIGN KEY (articulo_id) REFERENCES articulos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_existencia_articulo ON existencias_por_almacen(articulo_id);

-- -----------------------------------------------------------
-- Tabla: transacciones
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS transacciones (
  id            SERIAL PRIMARY KEY,
  tipo          VARCHAR(20)   NOT NULL CHECK (tipo IN ('Entrada', 'Salida', 'Ajuste')),
  articulo_id   INT           NOT NULL,
  almacen_id    INT           NOT NULL,
  fecha         DATE          NOT NULL,
  cantidad      DECIMAL(12,2) NOT NULL,
  monto         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creado_en     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_transaccion_articulo
    FOREIGN KEY (articulo_id) REFERENCES articulos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_transaccion_almacen
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX idx_transaccion_fecha      ON transacciones(fecha);
CREATE INDEX idx_transaccion_articulo   ON transacciones(articulo_id);
CREATE INDEX idx_transaccion_almacen    ON transacciones(almacen_id);
CREATE INDEX idx_transaccion_tipo       ON transacciones(tipo);

-- -----------------------------------------------------------
-- Datos Semilla
-- -----------------------------------------------------------
INSERT INTO tipos_inventario (descripcion, cuenta_contable, estado) VALUES
  ('Materia Prima',       '1101-01', 'Activo'),
  ('Producto Terminado',  '1101-02', 'Activo'),
  ('Material de Empaque', '1101-03', 'Activo'),
  ('Suministros',         '1101-04', 'Activo')
ON CONFLICT DO NOTHING;

INSERT INTO almacenes (descripcion, estado) VALUES
  ('Almacén Principal',  'Activo'),
  ('Almacén Secundario', 'Activo'),
  ('Almacén Zona Norte', 'Activo')
ON CONFLICT DO NOTHING;

INSERT INTO articulos (descripcion, tipo_inventario_id, costo_unitario, estado, existencia_total) VALUES
  ('Tornillo Hexagonal 1/4"',  1, 0.50,  'Activo', 500),
  ('Caja de Cartón 30x30',     3, 2.75,  'Activo', 200),
  ('Aceite Lubricante 1L',     4, 15.00, 'Activo', 80),
  ('Placa de Acero 2mm',       1, 45.00, 'Activo', 50),
  ('Producto Final Tipo A',    2, 120.00,'Activo', 100)
ON CONFLICT DO NOTHING;

INSERT INTO existencias_por_almacen (almacen_id, articulo_id, cantidad) VALUES
  (1, 1, 300),
  (2, 1, 200),
  (1, 2, 150),
  (3, 2,  50),
  (1, 3,  80),
  (1, 4,  30),
  (2, 4,  20),
  (1, 5,  60),
  (2, 5,  40)
ON CONFLICT DO NOTHING;

INSERT INTO transacciones (tipo, articulo_id, almacen_id, fecha, cantidad, monto) VALUES
  ('Entrada', 1, 1, CURRENT_DATE, 300, 150.00),
  ('Entrada', 1, 2, CURRENT_DATE, 200, 100.00),
  ('Entrada', 2, 1, CURRENT_DATE, 150, 412.50),
  ('Entrada', 3, 1, CURRENT_DATE,  80, 1200.00),
  ('Entrada', 5, 1, CURRENT_DATE,  60, 7200.00)
ON CONFLICT DO NOTHING;
