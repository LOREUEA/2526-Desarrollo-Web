"""
╔══════════════════════════════════════════════╗
║   GLITCHGIRLS — app.py                       ║
║   Semanas 9 → 15 (base Semana 10)            ║
╚══════════════════════════════════════════════╝
"""
from flask import Flask, render_template, redirect, url_for, flash, request, session
from inventario.bd import init_db, get_connection

# ── Blueprints (se importan más adelante, semana 13+) ──
# from routes.cursos import bp as cursos_bp

app = Flask(__name__)
app.secret_key = 'glitchgirls_2026_secret'

# ── Inicializar base de datos SQLite ──────────────────
init_db()

# ═══════════════════════════════════════════
#   RUTAS PRINCIPALES (Semana 9 + 10)
# ═══════════════════════════════════════════

@app.route('/')
def index():
    """Página de inicio"""
    # Obtiene cursos destacados de SQLite para mostrar en la home
    conn = get_connection()
    cursos_destacados = conn.execute(
        'SELECT * FROM cursos LIMIT 3'
    ).fetchall()
    total_cursos = conn.execute('SELECT COUNT(*) FROM cursos').fetchone()[0]
    conn.close()
    return render_template(
        'index.html',
        cursos_destacados=cursos_destacados,
        total_cursos=total_cursos
    )


@app.route('/nosotras')
def about():
    """Página Nosotras"""
    return render_template('about.html')


@app.route('/comunidad')
def comunidad():
    """Página Comunidad"""
    return render_template('comunidad.html')


# ── Ruta dinámica Semana 9 ────────────────────────────
@app.route('/usuario/<nombre>')
def usuario(nombre):
    return f'Bienvenida, {nombre}! Explora GlitchGirls y aprende tecnología.'


# ═══════════════════════════════════════════
#   AUTH (Semana 14 — versión básica)
# ═══════════════════════════════════════════

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email    = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        conn = get_connection()
        usuario = conn.execute(
            'SELECT * FROM usuarios WHERE email=?', (email,)
        ).fetchone()
        conn.close()

        if usuario and usuario['password'] == password:
            session['usuario_id']  = usuario['id']
            session['nombre']      = usuario['nombre']
            flash(f'¡Bienvenida, {usuario["nombre"]}!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Correo o contraseña incorrectos.', 'danger')

    return render_template('auth/login.html')


@app.route('/registro', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        nombre   = request.form.get('nombre', '').strip()
        email    = request.form.get('email', '').strip()
        password = request.form.get('password', '').strip()

        conn = get_connection()
        existente = conn.execute(
            'SELECT id FROM usuarios WHERE email=?', (email,)
        ).fetchone()

        if existente:
            conn.close()
            flash('Ese correo ya está registrado.', 'warning')
        else:
            conn.execute(
                'INSERT INTO usuarios (nombre, email, password) VALUES (?,?,?)',
                (nombre, email, password)
            )
            conn.commit()
            conn.close()
            flash('Cuenta creada con éxito. ¡Ya puedes ingresar!', 'success')
            return redirect(url_for('login'))

    return render_template('auth/register.html')


@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente.', 'info')
    return redirect(url_for('index'))


# ═══════════════════════════════════════════
#   CURSOS — CRUD completo (Semana 11+)
# ═══════════════════════════════════════════

# Se registra como blueprint para organización por capas
from routes.cursos import bp as cursos_bp
app.register_blueprint(cursos_bp, url_prefix='/cursos')


# ═══════════════════════════════════════════
#   CONTEXT PROCESSOR — usuario en navbar
# ═══════════════════════════════════════════
@app.context_processor
def inject_user():
    """Inyecta el usuario actual a todas las plantillas."""
    class Usuario:
        def __init__(self, nombre):
            self.nombre = nombre
            self.is_authenticated = True

    class Anonimo:
        is_authenticated = False

    if 'usuario_id' in session:
        return {'current_user': Usuario(session.get('nombre', ''))}
    return {'current_user': Anonimo()}


# ═══════════════════════════════════════════
if __name__ == '__main__':
    app.run(debug=True)
