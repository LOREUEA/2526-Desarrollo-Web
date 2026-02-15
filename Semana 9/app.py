from flask import Flask

app = Flask(__name__)

@app.route('/')
def inicio():
    return """
    <h1>RestroBook</h1>
    <h3>Sistema Web de Reservas y Gestión de Mesas</h3>
    <p>Gestione reservas, controle mesas y promociones fácilmente.</p>
    """

@app.route('/reserva/<cliente>')
def reserva(cliente):
    return f"Bienvenido {cliente}. Tu reserva está en proceso."

if __name__ == "__main__":
    app.run(debug=True)
