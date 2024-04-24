create database loginbase;
USE loginbase;

CREATE TABLE IF NOT EXISTS register (
   
    nombre_completo VARCHAR(100) DEFAULT '',
    codigo_estudiantil VARCHAR(50) DEFAULT '',
    NRC INT DEFAULT 12341,
    
);
