from flask import Flask
from flask_login import LoginManager
from conexion.conexion import get_connection

app = Flask(__name__)
app.secret_key = 'glitchgirls_secret'

login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Importar rutas
from routes import auth, cursos, main
app.register_blueprint(auth.bp)
app.register_blueprint(cursos.bp)
app.register_blueprint(main.bp)