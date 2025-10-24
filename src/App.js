import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const tablasDelExamen = ['clientes', 'productos', 'pedidos', 'detalles'];
  
  const [tablaSeleccionada, setTablaSeleccionada] = useState(tablasDelExamen[0]);
  const [datos, setDatos] = useState([]);
  const [columnas, setColumnas] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({});

  // Cargar datos automáticamente
  useEffect(() => {
    cargarDatos();
  }, [tablaSeleccionada]);

  const cargarDatos = async () => {
    const { data, error } = await supabase
      .from(tablaSeleccionada)
      .select('*');

    if (error) {
      alert(`Error: La tabla "${tablaSeleccionada}" no existe en Supabase`);
    } else {
      setDatos(data || []);
      if (data && data.length > 0) {
        setColumnas(Object.keys(data[0]));
      }
    }
  };

  const insertarDato = async () => {
    // Filtrar campos vacíos
    const datosLimpios = Object.fromEntries(
      Object.entries(nuevoRegistro).filter(([_, value]) => value !== '')
    );

    if (Object.keys(datosLimpios).length === 0) {
      alert('Ingresa al menos un dato');
      return;
    }

    const { error } = await supabase
      .from(tablaSeleccionada)
      .insert([datosLimpios]);

    if (error) {
      alert('Error al insertar: ' + error.message);
    } else {
      setNuevoRegistro({});
      cargarDatos();
      alert('✅ Registro insertado');
    }
  };

  const eliminarDato = async (id) => {
    if (window.confirm('¿Eliminar este registro?')) {
      const { error } = await supabase
        .from(tablaSeleccionada)
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error al eliminar');
      } else {
        cargarDatos();
      }
    }
  };

  return (
    <div className="App">
      <h1>📊 Sistema de Gestión</h1>
      
      {/* Selector de tabla - MUY SIMPLE */}
      <div className="selector">
        <h3>Selecciona la tabla:</h3>
        <select 
          value={tablaSeleccionada} 
          onChange={(e) => setTablaSeleccionada(e.target.value)}
        >
          {tablasDelExamen.map(tabla => (
            <option key={tabla} value={tabla}>{tabla}</option>
          ))}
        </select>
        <button onClick={cargarDatos}>🔄 Actualizar</button>
      </div>

      {/* Formulario de inserción */}
      <div className="formulario">
        <h3>Agregar a {tablaSeleccionada}:</h3>
        <div className="campos">
          {columnas.map(columna => 
            columna !== 'id' && (
              <input
                key={columna}
                placeholder={columna}
                value={nuevoRegistro[columna] || ''}
                onChange={(e) => setNuevoRegistro({
                  ...nuevoRegistro,
                  [columna]: e.target.value
                })}
              />
            )
          )}
        </div>
        <button onClick={insertarDato} className="btn-insertar">
          ➕ Agregar
        </button>
      </div>

      {/* Tabla de datos */}
      <div className="tabla-datos">
        <h3>Datos de {tablaSeleccionada}:</h3>
        
        {datos.length === 0 ? (
          <p>No hay datos o la tabla no existe</p>
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  {columnas.map(columna => (
                    <th key={columna}>{columna}</th>
                  ))}
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {datos.map((fila) => (
                  <tr key={fila.id}>
                    {columnas.map(columna => (
                      <td key={columna}>{fila[columna]}</td>
                    ))}
                    <td>
                      <button 
                        onClick={() => eliminarDato(fila.id)}
                        className="btn-eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;