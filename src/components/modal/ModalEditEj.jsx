import React, { useState } from 'react';
import Ejercicios from '../../json/ejercicios.json'
import { useRutinaContext } from "../context/RutinaContext";
import { useEffect } from 'react';
import { useModalContext } from '../context/ModalContext';

const Modal = ({ diaId, ejercicioId, categoriaSeleccionada, ejercicioSeleccionado }) => {

  const { semanaActual, agregarEjercicioEnDia, actualizarEjercicioEnDia } = useRutinaContext();

  const { abrirModal, cerrarModal } = useModalContext();

  const [categoriaInput, setcategoriaInput] = useState("");
  const [ejercicioInput, setejercicioInput] = useState("");
  const [repsInput, setReps] = useState("");
  const [seriesInput, setSeries] = useState("");
  const [pesoInput, setPeso] = useState("");
  const [listaEjercicios, setListaEjercicios] = useState([]);

  useEffect(() => {
    if (ejercicioId) {
      const dia = semanaActual.dias.find((d) => d.id === diaId);
      const ejercicio = dia?.ejercicios.find((ej) => ej.id === ejercicioId);

      if (ejercicio) {
        // Caso: el ejercicio ya está agregado a la rutina
        const categoriaInput = ejercicio.ejercicio.categoria;
        const ejercicioInput = ejercicio.ejercicio.id;

        setReps(ejercicio.reps);
        setSeries(ejercicio.series);
        setPeso(ejercicio.peso);

        cargarEjerciciosPorCategoria(categoriaInput, ejercicioInput);
      } else if (categoriaSeleccionada) {
        // Caso: ejercicio aún no agregado a la rutina, pero lo acaban de crear
        cargarEjerciciosPorCategoria(categoriaSeleccionada, ejercicioId);
      }
    } else if (categoriaSeleccionada) {
      // Caso: sin ejercicioId, pero con categoría
      cargarEjerciciosPorCategoria(categoriaSeleccionada, ejercicioSeleccionado);
    }
  }, [ejercicioId, categoriaSeleccionada, ejercicioSeleccionado]);

  const cargarEjerciciosPorCategoria = (categoria, ejercicio = "") => {

    setcategoriaInput(categoria);
    const lista = Ejercicios[categoria.toLowerCase()] || [];
    setListaEjercicios(lista);

    if (ejercicio) {
    setejercicioInput(ejercicio);
    } else {
      setejercicioInput("");
    }

  
  };

  const agregarEjercicio = (diaId) => {
    if (!categoriaInput || !ejercicioInput || !repsInput || !seriesInput || !pesoInput) {
      alert('Completa todos los campos');
      return;
    }

    const datos = {
      categoriaInput,
      ejercicioInput,
      repsInput,
      seriesInput,
      pesoInput
    };

    agregarEjercicioEnDia(diaId, datos);
    cerrarModal();
  };

  const actualizarEjercicio = (diaId, ejercicioId) => {
    if (!categoriaInput || !ejercicioInput || !repsInput || !seriesInput || !pesoInput) {
      alert('Completa todos los campos');
      return;
    }

    const datos = {
      categoriaInput,
      ejercicioInput,
      repsInput,
      seriesInput,
      pesoInput
    };

    actualizarEjercicioEnDia(diaId, ejercicioId, datos);
    cerrarModal();
  };

  const abrirModalNuevoEjercicio = (diaId) => {

    if (!categoriaInput) {
      alert("Seleccioná primero una categoría para crear un nuevo ejercicio.");
      return;
    }

    abrirModal('nuevoEj', {diaId, categoriaInput})
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{ejercicioId ? 'Editar' : 'Agregar'} Ejercicio</h2>
      <select value={categoriaInput} onChange={(e) => cargarEjerciciosPorCategoria(e.target.value)} className="w-full mb-2 p-2 border border-gray-700 rounded bg-gray-700 text-white">
        <option value="">Seleccionar categoría</option>
        <option value="pecho">Pecho</option>
        <option value="piernas">Piernas</option>
        <option value="espalda">Espalda</option>
        <option value="biceps">Bíceps</option>
        <option value="triceps">Tríceps</option>
      </select>

      <div className="flex items-center gap-2 mb-2">
        <select value={ejercicioInput} onChange={(e) => setejercicioInput(e.target.value)} className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white">
          <option disabled value="">
            Seleccionar ejercicio
          </option>
          {listaEjercicios.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>

        {!ejercicioId && (
          <button onClick={() => abrirModalNuevoEjercicio(diaId)} title="Crear nuevo ejercicio" className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm">
            +
          </button>
        )}
      </div>

      <input type="number" placeholder="Repeticiones" value={repsInput} onChange={(e) => setReps(e.target.value)} className="w-full mb-2 p-2 border border-gray-700 rounded bg-gray-700 text-white" />
      <input type="number" placeholder="Series" value={seriesInput} onChange={(e) => setSeries(e.target.value)} className="w-full mb-2 p-2 border border-gray-700 rounded bg-gray-700 text-white" />
      <input type="number" placeholder="Peso (kg)" value={pesoInput} onChange={(e) => setPeso(e.target.value)} className="w-full mb-4 p-2 border border-gray-700 rounded bg-gray-700 text-white" />

      <div className="flex justify-end space-x-2">
        <button onClick={cerrarModal} className="text-gray-400 hover:text-red-400">
          Cancelar
        </button>
        {ejercicioId ? (
          <button onClick={() => actualizarEjercicio(diaId, ejercicioId)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Actualizar
          </button>
        ) : (
          <button onClick={() => agregarEjercicio(diaId)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Guardar
          </button>
        )}
      </div>
    </>
  );
};

export default Modal;
