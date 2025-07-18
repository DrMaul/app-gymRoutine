import { useModalContext } from '../context/ModalContext';
import { useState } from 'react';
import Ejercicios from '../../json/ejercicios.json'

const ModalNewEj = ({diaId, categoriaInput,}) => {

  const { abrirModal, cerrarModal } = useModalContext();
  const [nombreEjercicio, setNombreEjercicio] = useState("");

  const guardarNuevoEjercicio = () => {
    const nombre = nombreEjercicio.trim();
    if (!nombre) {
      alert("El nombre del ejercicio no puede estar vacío.");
      return;
    }
  
    if (!Ejercicios[categoriaInput]) {
      Ejercicios[categoriaInput] = [];
    }
  
    const nuevoId = `ejercicio-${categoriaInput}-${Ejercicios[categoriaInput].length + 1}`;
  
    Ejercicios[categoriaInput].push({
      id: nuevoId,
      nombre,
      categoria: categoriaInput,
    });

    setNombreEjercicio("");
    cerrarModal();
    abrirModal("editarEj", { diaId, categoriaSeleccionada: categoriaInput, ejercicioSeleccionado: nuevoId  });
  
  };

  const cancelar = () => {
    setNombreEjercicio("");
    cerrarModal();
    abrirModal("editarEj", { diaId, categoriaSeleccionada: categoriaInput });
  };

  return (
      <>
        <h2 className="text-lg font-semibold mb-4">Nuevo Ejercicio</h2>
        <p className="mb-2 text-sm text-gray-400">Categoría: <strong>{categoriaInput}</strong></p>
        <input
          type="text"
          value={nombreEjercicio}
          onChange={(e) => setNombreEjercicio(e.target.value)}
          placeholder="Nombre del ejercicio"
          className="w-full mb-4 p-2 border border-gray-700 rounded bg-gray-700 text-white"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={cancelar} className="text-gray-400 hover:text-red-400">Cancelar</button>
          <button onClick={guardarNuevoEjercicio} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </>
        

  );
};

export default ModalNewEj;
