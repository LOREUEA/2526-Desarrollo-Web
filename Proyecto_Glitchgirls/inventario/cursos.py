class Curso:
    def __init__(self, id_curso, nombre, descripcion, precio, nivel):
        self._id = id_curso
        self._nombre = nombre
        self._descripcion = descripcion
        self._precio = precio
        self._nivel = nivel

    @property
    def id(self): return self._id
    @property
    def nombre(self): return self._nombre