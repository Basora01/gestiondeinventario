-- ============================================================
-- Sistema de Gestión de Inventario — Esquema de Base de Datos
-- ============================================================

CREATE DATABASE IF NOT EXISTS gestion_inventario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestion_inventario;

-- -----------------------------------------------------------
-- Tabla: tipos_inventario
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipos_inventario (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  descripcion   VARCHAR(150)  NOT NULL,
  cuenta_contable VARCHAR(50) NOT NULL DEFAULT '',
  estado        ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Tabla: articulos
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS articulos (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  descripcion       VARCHAR(200) NOT NULL,
  tipo_inventario_id INT         NOT NULL,
  costo_unitario    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  estado            ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  existencia_total  DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creado_en         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_articulo_tipo_inventario
    FOREIGN KEY (tipo_inventario_id) REFERENCES tipos_inventario(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- Tabla: almacenes
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS almacenes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  descripcion   VARCHAR(150)  NOT NULL,
  estado        ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices adicionales para búsqueda
CREATE INDEX idx_existencia_articulo ON existencias_por_almacen(articulo_id);

-- -----------------------------------------------------------
-- Tabla: transacciones
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS transacciones (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  tipo          ENUM('Entrada','Salida','Ajuste') NOT NULL,
  articulo_id   INT           NOT NULL,
  almacen_id    INT           NOT NULL,
  fecha         DATE          NOT NULL,
  cantidad      DECIMAL(12,2) NOT NULL,
  monto         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  creado_en     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_transaccion_articulo
    FOREIGN KEY (articulo_id) REFERENCES articulos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT fk_transaccion_almacen
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para filtros frecuentes
CREATE INDEX idx_transaccion_fecha      ON transacciones(fecha);
CREATE INDEX idx_transaccion_articulo   ON transacciones(articulo_id);
CREATE INDEX idx_transaccion_almacen    ON transacciones(almacen_id);
CREATE INDEX idx_transaccion_tipo       ON transacciones(tipo);
