-- ═══════════════════════════════════════════════════════
--   GLITCHGIRLS — Script SQL (Semana 13)
--   Ejecutar en DBeaver o MySQL Workbench
-- ═══════════════════════════════════════════════════════

-- 1. Crear base de datos
CREATE DATABASE IF NOT EXISTS glitchgirls_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE glitchgirls_db;

-- ── Tabla 1: usuarios ────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario  INT           AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla 2: cursos ──────────────────────────────────
CREATE TABLE IF NOT EXISTS cursos (
    id_curso    INT           AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(150)  NOT NULL,
    descripcion TEXT,
    precio      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    nivel       ENUM('Básico','Intermedio','Avanzado') NOT NULL DEFAULT 'Básico',
    created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP
);

-- ── Tabla 3: inscripciones (relación) ────────────────
CREATE TABLE IF NOT EXISTS inscripciones (
    id_inscripcion INT      AUTO_INCREMENT PRIMARY KEY,
    id_usuario     INT      NOT NULL,
    id_curso       INT      NOT NULL,
    fecha          DATE     DEFAULT (CURRENT_DATE),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_curso)   REFERENCES cursos(id_curso)     ON DELETE CASCADE
);

-- ── Datos de prueba ──────────────────────────────────

INSERT INTO usuarios (nombre, email, password) VALUES
  ('Admin GlitchGirls', 'admin@glitchgirls.com', 'Admin123!'),
  ('Ana Torres',         'ana@glitchgirls.com',   'Test123!');

INSERT INTO cursos (nombre, descripcion, precio, nivel) VALUES
  ('Introducción a la IA',     'Fundamentos de inteligencia artificial y ML.',         0.00,  'Básico'),
  ('Python para Data Science', 'Análisis de datos con Python, Pandas y Matplotlib.',  79.90, 'Intermedio'),
  ('Ciberseguridad 101',       'Principios de seguridad informática y ethical hacking.',49.90,'Básico'),
  ('Deep Learning Avanzado',   'Redes neuronales, CNN, RNN y transformers.',           149.90,'Avanzado'),
  ('Machine Learning Práctico','Algoritmos de ML aplicados a casos reales.',            99.90,'Intermedio');

INSERT INTO inscripciones (id_usuario, id_curso, fecha) VALUES
  (2, 1, CURRENT_DATE),
  (2, 3, CURRENT_DATE);

-- ── Verificar ────────────────────────────────────────
SELECT 'usuarios'     AS tabla, COUNT(*) AS registros FROM usuarios
UNION ALL
SELECT 'cursos',       COUNT(*) FROM cursos
UNION ALL
SELECT 'inscripciones',COUNT(*) FROM inscripciones;
