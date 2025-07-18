import React, { createContext, useContext, useEffect, useState } from 'react';
import RutinasJSON from '../../json/rutinas.json';
import Ejercicios from '../../json/ejercicios.json';

const RutinaContext = createContext();

export const useRutinaContext = () => useContext(RutinaContext);

const LOCAL_STORAGE_KEY = 'rutinas_storage';
const LOCAL_STORAGE_TEMP = 'rutina_temp_progress';

export const RutinaContextProvider = ({ children }) => {
  const getRutinasIniciales = () => {
    const guardadas = localStorage.getItem(LOCAL_STORAGE_KEY);
    return guardadas ? JSON.parse(guardadas) : RutinasJSON.rutinas;
  };

  const [rutinas, setRutinas] = useState(getRutinasIniciales);
  const [rutinaTemporal, setRutinaTemporal] = useState(() => {
    const temp = localStorage.getItem(LOCAL_STORAGE_TEMP);
    return temp ? JSON.parse(temp) : {};
  });

  const rutinasOrdenadas = [...rutinas].sort((a, b) => {
    const fechaA = new Date(a.fechaInicio);
    const fechaB = new Date(b.fechaInicio);
    return fechaB - fechaA; // De más reciente a más antigua
  });

  const [perfilActual, setPerfilActual] = useState('entrenador');

  const [rutinaActualId, setRutinaActualId] = useState(rutinas[0]?.id || null);
  const rutinaActual = rutinas.find((r) => r.id === rutinaActualId);

  const [semanaActualId, setSemanaActualId] = useState(rutinaActual?.semanas?.[0]?.id || null);
  const semanaActual = rutinaActual?.semanas.find((s) => s.id === semanaActualId) || null;
  const semanaOrdenada = rutinaActual?.semanas.slice()?.sort((a, b) => a.orden - b.orden) || [];

  const [diaEnEdicion, setDiaEnEdicion] = useState(null);

  const crearRutina = (nombre, fecha) => {
    if (rutinas.length >= 6) {
      alert('Máximo 6 rutinas');
      return;
    }

    const nuevaFecha = new Date(fecha);

    // Validar que no haya superposición con rutinas anteriores
    const esSuperpuesta = rutinas.some((rut) => {
      const inicio = new Date(rut.fechaInicio);
      const fin = rut.fechaFin ? new Date(rut.fechaFin) : null;

      // Rutina sin fecha de fin → la nueva fecha no puede ser posterior
      if (!fin) {
        return nuevaFecha <= inicio;
      }

      return nuevaFecha >= inicio && nuevaFecha <= fin;
    });

    if (esSuperpuesta) {
      alert('Ya existe una rutina que cubre esa fecha o posterior.');
      return;
    }

    // Cerrar rutina anterior (si está activa)
    if (rutinas.length > 0) {
      const rutinasActualizadas = [...rutinas];
      const ultimaRutina = rutinasActualizadas[rutinas.length - 1];

      if (!ultimaRutina.fechaFin) {
        let fechaFinAnterior = new Date(fecha);
        fechaFinAnterior.setDate(fechaFinAnterior.getDate() - 1);
        let fechaFinAnteriorStr = dateString(fechaFinAnterior);
        ultimaRutina.fechaFin = fechaFinAnteriorStr;
        setRutinas(rutinasActualizadas); // Guardamos esta actualización
      }
    }

    const nuevoId = `rutina-${rutinas.length + 1}`;

    const semanas = Array.from({ length: 5 }, (_, i) => ({
      id: `semana-${i + 1}`,
      orden: i + 1,
      dias: []
    }));

    const nuevaRutina = {
      id: nuevoId,
      nombre,
      fechaInicio: fecha,
      fechaFin: null,
      semanas
    };

    const nuevasRutinas = [...rutinas, nuevaRutina];

    setRutinas(nuevasRutinas);
  };

  const editarNombreRutina = (nuevaRutinaId, nuevaRutinaNombre) => {
    const nuevasRutinas = rutinas.map((rutina) => (rutina.id === nuevaRutinaId ? { ...rutina, nombre: nuevaRutinaNombre } : rutina));
    setRutinas(nuevasRutinas);
  };

  const finalizarRutina = (nuevaRutinaId) => {
    let fechaFinAnterior = new Date();
    let fechaFinAnteriorStr = dateString(fechaFinAnterior);

    const nuevasRutinas = rutinas.map((rutina) => (rutina.id === nuevaRutinaId ? { ...rutina, fechaFin: fechaFinAnteriorStr } : rutina));

    setRutinas(nuevasRutinas);
  };

  const borrarRutina = (rutinaId) => {
    const nuevasRutinas = rutinas.filter((r) => r.id !== rutinaId);
    setRutinas(nuevasRutinas);
  };

  const cambiarRutinaId = (nuevaRutinaId, nuevaSemanaId = null) => {
    const nuevaRutina = rutinas.find((r) => r.id === nuevaRutinaId);

    if (nuevaRutina) {
      setRutinaActualId(nuevaRutinaId);

      if (nuevaSemanaId && nuevaRutina.semanas?.some((s) => s.id === nuevaSemanaId)) {
        setSemanaActualId(nuevaSemanaId);
      } else {
        setSemanaActualId(nuevaRutina.semanas?.[0]?.id || null);
      }
    }
  };

  const cambiarSemana = (direccion) => {
    const semanas = rutinaActual?.semanas || [];
    const ordenActual = semanaActual.orden;

    let nuevaSemana = semanas.find((s) => s.orden === ordenActual + direccion);
    if (nuevaSemana) setSemanaActualId(nuevaSemana.id);
  };

  const crearDia = () => {
    const dias = semanaActual?.dias || [];
    if (dias.length >= 6) {
      alert('Máximo 6 días por semana');
      return;
    }

    const nuevoOrden = dias.length + 1;
    const nuevoId = `dia-${nuevoOrden}`;
    const nuevoDia = {
      id: nuevoId,
      nombre: null,
      orden: nuevoOrden,
      diaAsignado: null,
      estado: 'Pendiente',
      ejercicios: []
    };

    const nuevasRutinas = [...rutinas];
    const rutinaIndex = nuevasRutinas.findIndex((r) => r.id === rutinaActualId);
    const semanaIndex = nuevasRutinas[rutinaIndex].semanas.findIndex((s) => s.id === semanaActualId);
    nuevasRutinas[rutinaIndex].semanas[semanaIndex].dias.push(nuevoDia);

    setRutinas(nuevasRutinas);
  };

  const eliminarDia = (id) => {
    const nuevasRutinas = [...rutinas];
    const rutinaIndex = nuevasRutinas.findIndex((r) => r.id === rutinaActualId);
    const semanaIndex = nuevasRutinas[rutinaIndex].semanas.findIndex((s) => s.id === semanaActualId);

    let nuevosDias = nuevasRutinas[rutinaIndex].semanas[semanaIndex].dias.filter((d) => d.id !== id);

    nuevosDias.forEach((dia, i) => {
      dia.orden = i + 1;
      dia.id = `dia-${i + 1}`;
    });

    nuevasRutinas[rutinaIndex].semanas[semanaIndex].dias = nuevosDias;
    setRutinas(nuevasRutinas);

    // Resetear edición si el día eliminado estaba siendo editado
    // if (diaEnEdicion === id) {
    //   setDiaEnEdicion(null);
    // }
  };

  const editarDia = (id) => setDiaEnEdicion(id);
  const salirEditar = (id) => {
    if (diaEnEdicion === id) setDiaEnEdicion(null);
  };

  const moverDia = (id, direccion) => {
    const nuevasRutinas = [...rutinas];
    const rutinaIndex = nuevasRutinas.findIndex((r) => r.id === rutinaActualId);
    const semanaIndex = nuevasRutinas[rutinaIndex].semanas.findIndex((s) => s.id === semanaActualId);
    const dias = nuevasRutinas[rutinaIndex].semanas[semanaIndex].dias;
    const index = dias.findIndex((d) => d.id === id);

    if (index === -1) return;

    let offset = 0;

    if (direccion === 'arriba' && index > 0) {
      offset = -1;
    }

    if (direccion === 'abajo' && index < dias.length - 1) {
      offset = +1;
    }

    if (offset !== 0) {
      // Swap de objetos día
      [dias[index], dias[index + offset]] = [dias[index + offset], dias[index]];

      // Swap de diaAsignado (solo si ambos tienen asignado uno)
      const dia1 = dias[index];
      const dia2 = dias[index + offset];

      if (typeof dia1.diaAsignado === 'number' && typeof dia2.diaAsignado === 'number') {
        [dia1.diaAsignado, dia2.diaAsignado] = [dia2.diaAsignado, dia1.diaAsignado];
      }
    }

    dias.forEach((d, i) => (d.orden = i + 1));
    setRutinas(nuevasRutinas);
  };

  const agregarEjercicioEnDia = (id, inputs) => {
    const { categoriaInput, ejercicioInput, repsInput, seriesInput, pesoInput } = inputs;

    const nuevasRutinas = [...rutinas];
    const rutinaIndex = nuevasRutinas.findIndex((r) => r.id === rutinaActual.id);
    const semanaIndex = nuevasRutinas[rutinaIndex].semanas.findIndex((s) => s.id === semanaActual.id);
    const dia = nuevasRutinas[rutinaIndex].semanas[semanaIndex].dias.find((d) => d.id === id);
    if (!dia) return;

    const ejercicioBase = Ejercicios[categoriaInput]?.find((ej) => ej.id === ejercicioInput);
    if (!ejercicioBase) return;

    const nuevoOrden = dia.ejercicios.length + 1;
    const nuevoId = dia.id + 'ej-' + nuevoOrden;

    const nuevoEjercicio = {
      id: nuevoId,
      ejercicio: ejercicioBase,
      reps: parseInt(repsInput),
      series: parseInt(seriesInput),
      peso: parseFloat(pesoInput),
      orden: nuevoOrden,
      completed: false
    };

    dia.ejercicios.push(nuevoEjercicio);

    setRutinas(nuevasRutinas);
  };

  const actualizarEjercicioEnDia = (diaId, ejercicioId, inputs) => {
    const { categoriaInput, ejercicioInput, repsInput, seriesInput, pesoInput } = inputs;

    const nuevasRutinas = [...rutinas];
    const rutinaIndex = nuevasRutinas.findIndex((r) => r.id === rutinaActual.id);
    const semanaIndex = nuevasRutinas[rutinaIndex].semanas.findIndex((s) => s.id === semanaActual.id);
    const dia = nuevasRutinas[rutinaIndex].semanas[semanaIndex].dias.find((d) => d.id === diaId);
    if (!dia) return;

    const ejercicioBase = Ejercicios[categoriaInput]?.find((ej) => ej.id === ejercicioInput);
    if (!ejercicioBase) return;

    const ejDiaActualizar = dia.ejercicios.find((ej) => ej.id === ejercicioId);
    if (!ejDiaActualizar) return;

    ejDiaActualizar.ejercicio = ejercicioBase;
    ejDiaActualizar.reps = parseInt(repsInput);
    ejDiaActualizar.series = parseInt(seriesInput);
    ejDiaActualizar.peso = parseInt(pesoInput);

    setRutinas(nuevasRutinas);
  };

  const diasOrdenados = semanaActual?.dias?.slice()?.sort((a, b) => a.orden - b.orden) || [];

  const diasOrdenadosLength = diasOrdenados.length;

  const dateString = (date) => {
    let newDate = date;
    return newDate.toISOString().split('T')[0];
  };

  const validarDiaAsignado = (diaId, nuevoIndex) => {
    const rutina = rutinas.find((r) => r.id === rutinaActualId);
    if (!rutina) return 0;

    const semana = rutina.semanas.find((s) => s.id === semanaActualId);
    if (!semana) return 0;

    const dia = semana.dias.find((d) => d.id === diaId);
    if (!dia) return 0;

    if (dia.diaAsignado === nuevoIndex) return 2;

    const duplicado = semana.dias.find((d) => d.diaAsignado === nuevoIndex && d.id !== diaId);
    if (duplicado) return 1;

    return 0;
  };

  const asignarDiaDeSemana = (diaId, nuevoIndex) => {
    const nuevasRutinas = [...rutinas];
    const rutinaIndex = nuevasRutinas.findIndex((r) => r.id === rutinaActualId);
    const semanaIndex = nuevasRutinas[rutinaIndex].semanas.findIndex((s) => s.id === semanaActualId);
    const semana = nuevasRutinas[rutinaIndex].semanas[semanaIndex];

    const dia = semana.dias.find((d) => d.id === diaId);
    if (!dia) return;

    dia.diaAsignado = nuevoIndex;

    // Ordena los días dejando los sin asignar al final
    semana.dias.sort((a, b) => {
      if (a.diaAsignado === null) return 1;
      if (b.diaAsignado === null) return -1;
      return a.diaAsignado - b.diaAsignado;
    });

    // Reasignar orden secuencial
    semana.dias.forEach((d, i) => {
      d.orden = i + 1;
    });

    setRutinas(nuevasRutinas);
    setDiaEnEdicion(null); // opcional
  };

  const actualizarNombreDia = (diaId, nuevoNombre) => {
    const nuevasRutinas = [...rutinas];
    const rutina = nuevasRutinas.find((r) => r.id === rutinaActualId);
    if (!rutina) return;

    const semana = rutina.semanas.find((s) => s.id === semanaActualId);
    if (!semana) return;

    const dia = semana.dias.find((d) => d.id === diaId);
    if (!dia) return;

    dia.nombre = nuevoNombre;
    setRutinas(nuevasRutinas);
  };

  const obtenerRutinaPorId = (rutinaId) => {
    return rutinas.find((r) => r.id === rutinaId);
  };

  const obtenerSemanaPorId = (rutinaId, semanaId) => {
    const rutina = obtenerRutinaPorId(rutinaId);
    return rutina?.semanas?.find((s) => s.id === semanaId);
  };

  const obtenerDiaPorId = (rutinaId, semanaId, diaId) => {
    const semana = obtenerSemanaPorId(rutinaId, semanaId);
    return semana?.dias?.find((d) => d.id === diaId);
  };

  const progresoDiaActual = (rutinaId, semanaId, diaId) => {

    const rutinaSeleccionada = obtenerRutinaPorId(rutinaId);
    const semanaActual = obtenerSemanaPorId(rutinaId, semanaId);
    const diaActual = obtenerDiaPorId(rutinaId, semanaId, diaId);
    const nombreDelDia = diaActual?.nombre?.toLowerCase();

    if (!nombreDelDia) return 'No se encuentra día con nombre';

    // Filtrar semanas anteriores con días que coincidan por nombre
    const semanasHistoricas = rutinaSeleccionada.semanas
      .filter((sem) => sem.orden < semanaActual.orden)
      .map((semana) => ({
        ...semana,
        dias: semana.dias.filter((dia) => dia.nombre?.toLowerCase() === nombreDelDia)
      }))
      .filter((sem) => sem.dias.length > 0);

    // Agregar semana actual con solo el día actual
    const semanaActualSimplificada = {
      id: semanaActual.id,
      orden: semanaActual.orden,
      dias: [diaActual]
    };

    console.log("semanasHistoricas", semanasHistoricas)
    console.log("semanaActualSimplificada", semanaActualSimplificada)

    return {
      ...rutinaSeleccionada,
      semanas: [...semanasHistoricas, semanaActualSimplificada]
    };
  };

  // LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rutinas));
  }, [rutinas]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_TEMP, JSON.stringify(rutinaTemporal));
  }, [rutinaTemporal]);

  // ✅ Guardar progreso temporal de ejercicios
  const guardarProgresoTemporal = (rutinaId, semanaId, diaId, ejerciciosTemp) => {
    setRutinaTemporal((prev) => ({
      ...prev,
      [`${rutinaId}-${semanaId}-${diaId}`]: ejerciciosTemp
    }));
  };

  // 🔄 Obtener progreso temporal si existe
  const obtenerProgresoTemporal = (rutinaId, semanaId, diaId) => {
    return rutinaTemporal[`${rutinaId}-${semanaId}-${diaId}`] || null;
  };

  // ✅ Finalizar y guardar ejercicios definitivos
  const actualizarEjerciciosDelDia = (rutinaId, semanaId, diaId, ejerciciosFinal) => {
    const nuevasRutinas = [...rutinas];
    const rutina = nuevasRutinas.find((r) => r.id === rutinaId);
    const semana = rutina?.semanas.find((s) => s.id === semanaId);
    const dia = semana?.dias.find((d) => d.id === diaId);
    if (dia) dia.ejercicios = ejerciciosFinal;
    setRutinas(nuevasRutinas);

    // Eliminar progreso temporal
    setRutinaTemporal((prev) => {
      const copy = { ...prev };
      delete copy[`${rutinaId}-${semanaId}-${diaId}`];
      return copy;
    });
  };

  const marcarDiaComoCompletado = (rutinaId, semanaId, diaId) => {
    const nuevasRutinas = [...rutinas];
    const rutina = nuevasRutinas.find((r) => r.id === rutinaId);
    const semana = rutina?.semanas.find((s) => s.id === semanaId);
    const dia = semana?.dias.find((d) => d.id === diaId);
    if (dia) dia.estado = 'completado';
    setRutinas(nuevasRutinas);
  };

  return (
    <RutinaContext.Provider
      value={{
        rutinas,
        setRutinas,
        cambiarRutinaId,
        perfilActual,
        setPerfilActual,
        rutinaActual,
        semanaActual,
        diaEnEdicion,
        editarDia,
        salirEditar,
        moverDia,
        diasOrdenados,
        diasOrdenadosLength,
        crearDia,
        cambiarSemana,
        eliminarDia,
        crearRutina,
        rutinasOrdenadas,
        agregarEjercicioEnDia,
        actualizarEjercicioEnDia,
        validarDiaAsignado,
        asignarDiaDeSemana,
        actualizarNombreDia,
        editarNombreRutina,
        finalizarRutina,
        borrarRutina,
        obtenerDiaPorId,
        actualizarEjerciciosDelDia,
        marcarDiaComoCompletado,
        guardarProgresoTemporal,
        obtenerProgresoTemporal,
        progresoDiaActual
      }}>
      {children}
    </RutinaContext.Provider>
  );
};
