import sqlite3

def get_connection():
    conn = sqlite3.connect('glitchgirls.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS cursos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL,
        nivel TEXT
    )''')
    conn.commit()
    conn.close()