import { useModalContext } from '../context/ModalContext';
import { useRutinaContext } from '../context/RutinaContext';
import { useState, useEffect } from 'react';

const ModalNewRoutine = () => {

  const { abrirModal, cerrarModal } = useModalContext();
  const {crearRutina} = useRutinaContext();
  const [nombreRutina, setNombreRutina] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");

  useEffect(() => {
    
    const fechaHoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    console.log(fechaHoy)
    setFechaInicio(fechaHoy);
    }, []);

  const guardarNuevaRutina  = () => {
    const nombre = nombreRutina.trim();
    if (!nombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    if(!fechaInicio){
      alert("La fecha no puede estar vacía.");
      return;
    }
    
    const mensaje =  `Al crear la nueva rutina, se finalizará la anterior. 
    ¿Desea continuar?`

    abrirModal('modalConfirm', {mensaje,onAceptar: () => crearRutina(nombre, fechaInicio)})
  
  };

  const cancelar = () => {
    setNombreRutina("");
    setFechaInicio("");
    cerrarModal();
  };

  return (
      <>
        <h2 className="text-lg font-semibold mb-4">Nueva Rutina</h2>
        <p className="mb-2 text-sm text-gray-400">Nombre</p>
        <input
          type="text"
          value={nombreRutina}
          onChange={(e) => setNombreRutina(e.target.value)}
          placeholder="Nombre de rutina"
          className="w-full mb-4 p-2 border border-gray-700 rounded bg-gray-700 text-white"
        />
        <p className="mb-2 text-sm text-gray-400">Fecha Inicio</p>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-700 rounded bg-gray-700 text-white"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={cancelar} className="text-gray-400 hover:text-red-400">Cancelar</button>
          <button onClick={guardarNuevaRutina } className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </>
        

  );
};

export default ModalNewRoutine;
