import { useRutinaContext } from './context/RutinaContext';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import GraficExercise from './grafics/GraficExercise';
dayjs.locale('es');

const ProgressHome = ({ isToday, ...event }) => {
  const { progresoDiaActual } = useRutinaContext();
  const { rutinaId, semanaId, diaId } = event;

  const historial = progresoDiaActual(rutinaId, semanaId, diaId);

  // Obtener lista única de ejercicios
  const ejerciciosUnicos = new Set();
  historial.semanas.forEach((semana) => {
    const dia = semana.dias[0];
    dia.ejercicios.forEach((ej) => {
      ejerciciosUnicos.add(ej.ejercicio.nombre);
    });
  });

  const ejercicios = Array.from(ejerciciosUnicos);

  // Estructura final: lista por semana
  const datosEvolucion = historial.semanas.map((semana) => {
    const dia = semana.dias[0];

    const fila = { semana: `Semana ${semana.orden}` };

    ejercicios.forEach((nombreEjercicio) => {
      const ej = dia.ejercicios.find((e) => e.ejercicio.nombre === nombreEjercicio);
      fila[nombreEjercicio] = ej?.peso ?? 0;
    });

    return fila;
  });

  // Agrupar por ejercicio
  const progresoPorEjercicio = ejercicios.map((nombreEjercicio) => {
  // Para cada nombre de ejercicio, creamos un objeto que representará ese ejercicio
  // en nuestro array final.
  return {
    nombre: nombreEjercicio, // El nombre del ejercicio
    datos: datosEvolucion.map((fila) => ({
      // Mapeamos 'datosEvolucion' para obtener los puntos de progreso
      // (semana y peso) específicos para este 'nombreEjercicio'.
      semana: fila.semana,
      peso: fila[nombreEjercicio], // Accedemos al peso usando el nombre del ejercicio como clave
    })),
  };
});

  console.log('progresoPorEjercicio', progresoPorEjercicio);

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 space-y-10">
      {progresoPorEjercicio.map((ejercicio, idx) => (
        <GraficExercise key={idx} nombreEjercicio={ejercicio.nombre} datosProgreso={ejercicio.datos} />
      ))}
    </div>
  );
};

export default ProgressHome;
