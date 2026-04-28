"""
GLITCHGIRLS — routes/cursos.py
Blueprint CRUD de cursos + reporte PDF (Semanas 11–15)
"""
import io
from flask import Blueprint, render_template, request, redirect, url_for, flash, send_file
from inventario.bd import get_connection

bp = Blueprint('cursos', __name__)


# ─── Helpers ───────────────────────────────────────────

def _get_cursos(q=None, nivel=None):
    """Obtiene cursos con filtros opcionales."""
    conn  = get_connection()
    query = 'SELECT * FROM cursos WHERE 1=1'
    args  = []
    if q:
        query += ' AND nombre LIKE ?'
        args.append(f'%{q}%')
    if nivel:
        query += ' AND nivel = ?'
        args.append(nivel)
    query += ' ORDER BY id DESC'
    cursos = conn.execute(query, args).fetchall()
    conn.close()
    return cursos


# ─── LEER ──────────────────────────────────────────────

@bp.route('/')
def lista():
    """Lista todos los cursos con búsqueda/filtro."""
    q     = request.args.get('q', '').strip()
    nivel = request.args.get('nivel', '').strip()
    cursos = _get_cursos(q or None, nivel or None)
    return render_template('cursos/lista.html', cursos=cursos)


# ─── CREAR ─────────────────────────────────────────────

@bp.route('/nuevo', methods=['GET', 'POST'])
def nuevo():
    """Formulario y procesamiento para crear un curso."""
    if request.method == 'POST':
        nombre      = request.form.get('nombre', '').strip()
        descripcion = request.form.get('descripcion', '').strip()
        precio      = request.form.get('precio', 0)
        nivel       = request.form.get('nivel', 'Básico')

        if not nombre:
            flash('El nombre del curso es obligatorio.', 'danger')
            return render_template('cursos/form.html', curso=None)

        conn = get_connection()
        conn.execute(
            'INSERT INTO cursos (nombre, descripcion, precio, nivel) VALUES (?,?,?,?)',
            (nombre, descripcion, float(precio), nivel)
        )
        conn.commit()
        conn.close()
        flash(f'Curso "{nombre}" creado exitosamente.', 'success')
        return redirect(url_for('cursos.lista'))

    return render_template('cursos/form.html', curso=None)


# ─── ACTUALIZAR ────────────────────────────────────────

@bp.route('/editar/<int:id>', methods=['GET', 'POST'])
def editar(id):
    """Formulario y procesamiento para editar un curso."""
    conn  = get_connection()
    curso = conn.execute('SELECT * FROM cursos WHERE id=?', (id,)).fetchone()
    conn.close()

    if not curso:
        flash('Curso no encontrado.', 'danger')
        return redirect(url_for('cursos.lista'))

    if request.method == 'POST':
        nombre      = request.form.get('nombre', '').strip()
        descripcion = request.form.get('descripcion', '').strip()
        precio      = request.form.get('precio', 0)
        nivel       = request.form.get('nivel', 'Básico')

        conn = get_connection()
        conn.execute(
            'UPDATE cursos SET nombre=?, descripcion=?, precio=?, nivel=? WHERE id=?',
            (nombre, descripcion, float(precio), nivel, id)
        )
        conn.commit()
        conn.close()
        flash(f'Curso "{nombre}" actualizado correctamente.', 'success')
        return redirect(url_for('cursos.lista'))

    return render_template('cursos/form.html', curso=curso)


# ─── ELIMINAR ──────────────────────────────────────────

@bp.route('/eliminar/<int:id>')
def eliminar(id):
    """Elimina un curso por ID."""
    conn  = get_connection()
    curso = conn.execute('SELECT nombre FROM cursos WHERE id=?', (id,)).fetchone()

    if curso:
        conn.execute('DELETE FROM cursos WHERE id=?', (id,))
        conn.commit()
        flash(f'Curso "{curso["nombre"]}" eliminado.', 'success')
    else:
        flash('Curso no encontrado.', 'danger')

    conn.close()
    return redirect(url_for('cursos.lista'))


# ─── REPORTE PDF (Semana 15) ────────────────────────────

@bp.route('/reporte')
def reporte_pdf():
    """
    Genera un reporte PDF de todos los cursos registrados.
    Usa ReportLab.
    """
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.units import cm
        from reportlab.platypus import (
            SimpleDocTemplate, Table, TableStyle,
            Paragraph, Spacer
        )
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.enums import TA_CENTER
        from datetime import datetime

        # Obtener datos
        conn   = get_connection()
        cursos = conn.execute('SELECT * FROM cursos ORDER BY nivel, nombre').fetchall()
        conn.close()

        buffer = io.BytesIO()
        doc    = SimpleDocTemplate(
            buffer, pagesize=A4,
            leftMargin=2*cm, rightMargin=2*cm,
            topMargin=2*cm, bottomMargin=2*cm
        )

        styles = getSampleStyleSheet()

        # Estilos personalizados
        titulo_style = ParagraphStyle(
            'Titulo',
            parent=styles['Title'],
            fontSize=20,
            textColor=colors.HexColor('#b084ff'),
            spaceAfter=6,
            alignment=TA_CENTER
        )
        sub_style = ParagraphStyle(
            'Sub',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#888888'),
            alignment=TA_CENTER,
            spaceAfter=20
        )
        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#333333')
        )

        story = []

        # Encabezado
        story.append(Paragraph('⬡ GLITCHGIRLS', titulo_style))
        story.append(Paragraph(
            f'Reporte de Cursos · Generado el {datetime.now().strftime("%d/%m/%Y %H:%M")}',
            sub_style
        ))
        story.append(Spacer(1, 0.5*cm))

        # Tabla de datos
        data = [['#', 'Nombre', 'Nivel', 'Precio (S/)', 'Descripción']]
        for c in cursos:
            desc = (c['descripcion'] or '')[:50]
            if len(c['descripcion'] or '') > 50:
                desc += '...'
            data.append([
                str(c['id']),
                c['nombre'],
                c['nivel'],
                f"{c['precio']:.2f}",
                desc
            ])

        # Si no hay datos
        if len(data) == 1:
            data.append(['-', 'Sin cursos registrados', '-', '-', '-'])

        tabla = Table(
            data,
            colWidths=[1.2*cm, 4.5*cm, 2.5*cm, 2.5*cm, 6.5*cm]
        )
        tabla.setStyle(TableStyle([
            # Encabezado
            ('BACKGROUND',  (0,0), (-1,0), colors.HexColor('#141420')),
            ('TEXTCOLOR',   (0,0), (-1,0), colors.HexColor('#b084ff')),
            ('FONTNAME',    (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE',    (0,0), (-1,0), 8),
            ('ALIGN',       (0,0), (-1,0), 'CENTER'),
            # Filas
            ('FONTSIZE',    (0,1), (-1,-1), 8),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.HexColor('#f9f9f9'), colors.white]),
            ('TEXTCOLOR',   (0,1), (-1,-1), colors.HexColor('#222222')),
            # Bordes
            ('GRID',        (0,0), (-1,-1), 0.5, colors.HexColor('#dddddd')),
            ('TOPPADDING',  (0,0), (-1,-1), 6),
            ('BOTTOMPADDING',(0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
        ]))

        story.append(tabla)
        story.append(Spacer(1, 1*cm))

        # Totales
        total = len(cursos)
        story.append(Paragraph(
            f'<b>Total de cursos:</b> {total}',
            body_style
        ))

        doc.build(story)
        buffer.seek(0)
        return send_file(
            buffer,
            mimetype='application/pdf',
            as_attachment=False,
            download_name='glitchgirls_cursos.pdf'
        )

    except ImportError:
        flash('Instala reportlab: pip install reportlab', 'danger')
        return redirect(url_for('cursos.lista'))
