-- ============================================================
-- Datos Semilla — Sistema de Gestión de Inventario
-- ============================================================

USE gestion_inventario;

-- Tipos de Inventario
INSERT INTO tipos_inventario (descripcion, cuenta_contable, estado) VALUES
  ('Materia Prima',       '1101-01', 'Activo'),
  ('Producto Terminado',  '1101-02', 'Activo'),
  ('Material de Empaque', '1101-03', 'Activo'),
  ('Suministros',         '1101-04', 'Activo');

-- Almacenes
INSERT INTO almacenes (descripcion, estado) VALUES
  ('Almacén Principal',  'Activo'),
  ('Almacén Secundario', 'Activo'),
  ('Almacén Zona Norte', 'Activo');

-- Artículos
INSERT INTO articulos (descripcion, tipo_inventario_id, costo_unitario, estado, existencia_total) VALUES
  ('Tornillo Hexagonal 1/4"',  1, 0.50,  'Activo', 500),
  ('Caja de Cartón 30x30',     3, 2.75,  'Activo', 200),
  ('Aceite Lubricante 1L',     4, 15.00, 'Activo', 80),
  ('Placa de Acero 2mm',       1, 45.00, 'Activo', 50),
  ('Producto Final Tipo A',    2, 120.00,'Activo', 100);

-- Existencias por Almacén
INSERT INTO existencias_por_almacen (almacen_id, articulo_id, cantidad) VALUES
  (1, 1, 300),
  (2, 1, 200),
  (1, 2, 150),
  (3, 2,  50),
  (1, 3,  80),
  (1, 4,  30),
  (2, 4,  20),
  (1, 5,  60),
  (2, 5,  40);

-- Transacciones de ejemplo
INSERT INTO transacciones (tipo, articulo_id, almacen_id, fecha, cantidad, monto) VALUES
  ('Entrada', 1, 1, CURDATE(), 300, 150.00),
  ('Entrada', 1, 2, CURDATE(), 200, 100.00),
  ('Entrada', 2, 1, CURDATE(), 150, 412.50),
  ('Entrada', 3, 1, CURDATE(),  80, 1200.00),
  ('Entrada', 5, 1, CURDATE(),  60, 7200.00);
