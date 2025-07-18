import React, { createContext, useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useRutinaContext } from './RutinaContext';

const CalendarContext = createContext();
export const useCalendarContext = () => useContext(CalendarContext);

export const CalendarContextProvider = ({ children }) => {
  const { rutinas } = useRutinaContext();

  const [fechaActual, setFechaActual] = useState(dayjs());
  const [eventos, setEventos] = useState({});

  const siguienteMes = () => setFechaActual((prev) => prev.add(1, 'month'));
  const mesAnterior = () => setFechaActual((prev) => prev.subtract(1, 'month'));

  const cargarEventosDesdeRutinas = () => {
    const eventosGenerados = {};

    rutinas?.forEach((rutina) => {
      let fechaInicio = dayjs(rutina.fechaInicio);
      if (!fechaInicio.isValid()) return;

      rutina.semanas?.forEach((semana, semanaIndex) => {
        
        const startOfWeek = fechaInicio.add(semanaIndex, 'week').startOf('week');

        semana.dias?.forEach((dia) => {
          if (typeof dia.diaAsignado === 'number') {

            const offsetDias = dia.diaAsignado - 1;
            const fecha = startOfWeek.add(offsetDias, 'day');
            const key = fecha.format('YYYY-MM-DD');

            if (!eventosGenerados[key]) eventosGenerados[key] = [];

            eventosGenerados[key].push({
              title: dia.nombre,
              subtitle: rutina.nombre,
              rutinaId: rutina.id,
              nombreRutina: rutina.nombre,
              semanaId: semana.id,
              diaId: dia.id,
              nombreDia: dia.nombre,
              ejercicios: dia.ejercicios,
              fechaInicio: fecha.format('YYYY-MM-DD')
            });
          }
        });
      });

      // Agregar evento de inicio de rutina
      const keyInicio = fechaInicio.format('YYYY-MM-DD');
      if (!eventosGenerados[keyInicio]) eventosGenerados[keyInicio] = [];

      // Determinar fechaFin
      let fechaFin = rutina.fechaFin ? dayjs(rutina.fechaFin) : fechaInicio.add(35, 'day'); // 5 semanas x 7 - 1 = 34

      eventosGenerados[keyInicio].push({
        title: 'Inicio de rutina',
        subtitle: rutina.nombre,
        rutinaId: rutina.id,
        fechaInicio: keyInicio,
        fechaFin: fechaFin.format('YYYY-MM-DD'), // ✅ también incluimos fechaFin
        esInicio: true
      });

      // Agregar evento de fin de rutina
      const keyFin = fechaFin.format('YYYY-MM-DD');
      if (!eventosGenerados[keyFin]) eventosGenerados[keyFin] = [];

      eventosGenerados[keyFin].push({
        title: 'Fin de rutina',
        subtitle: rutina.nombre,
        rutinaId: rutina.id,
        fechaInicio: fechaInicio.format('YYYY-MM-DD'), // ✅ también incluimos fechaInicio
        fechaFin: keyFin,
        esFin: true
      });
    });

    setEventos(eventosGenerados);
  };

  const obtenerEventosPorDia = (fechaStr) => eventos[fechaStr] || [];

  useEffect(() => {
    if (rutinas.length > 0) cargarEventosDesdeRutinas();
  }, [rutinas]);

  const obtenerProximoEvento = (desdeFecha) => {
    for (let i = 0; i < 30; i++) {
      const fecha = desdeFecha.add(i, 'day');
      const eventos = obtenerEventosPorDia(fecha.format('YYYY-MM-DD'));

      if (eventos.length > 0) {
        return eventos[0];
      }
    }
  };

  return (
    <CalendarContext.Provider
      value={{
        fechaActual,
        setFechaActual,
        siguienteMes,
        mesAnterior,
        eventos,
        obtenerEventosPorDia,
        obtenerProximoEvento
      }}>
      {children}
    </CalendarContext.Provider>
  );
};
