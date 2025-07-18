import { useRutinaContext } from '../context/RutinaContext';
import { ButtonIcon, ButtonDark, ButtonBlue } from '@utils';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
dayjs.locale('es');

const CardHome = ({ isToday, ...event }) => {
  const { obtenerDiaPorId, actualizarEjerciciosDelDia, marcarDiaComoCompletado } = useRutinaContext();

  const { rutinaId, semanaId, diaId } = event;

  const dia = obtenerDiaPorId(rutinaId, semanaId, diaId);
  const estado = dia?.estado || 'pendiente';
  const ejercicios = dia?.ejercicios;

  const [modoEntrenamiento, setModoEntrenamiento] = useState(false);
  const [ejerciciosTemp, setEjerciciosTemp] = useState(ejercicios?.map((ej) => ({ ...ej, completed: ej.completed || false })));
  const [ejerciciosOriginales, setEjerciciosOriginales] = useState([]);

  const iniciarEntrenamiento = (toggle) => {
    setEjerciciosOriginales(ejercicios.map((ej) => ({ ...ej })));
    setModoEntrenamiento(toggle);
  };

  // Calcular progreso
  const total = ejerciciosTemp.length;
  const completados = ejerciciosTemp.filter((e) => e.completed).length;
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

  const modificarValor = (id, campo, operacion) => {
    setEjerciciosTemp((prev) => prev.map((ej) => (ej.id === id ? { ...ej, [campo]: Math.max(0, ej[campo] + (operacion === 'sumar' ? 1 : -1)) } : ej)));
  };

  const toggleCompleted = (id) => {
    setEjerciciosTemp((prev) => prev.map((ej) => (ej.id === id ? { ...ej, completed: !ej.completed } : ej)));
  };

  const finalizarEntrenamiento = () => {
    actualizarEjerciciosDelDia(rutinaId, semanaId, diaId, ejerciciosTemp);
    marcarDiaComoCompletado(rutinaId, semanaId, diaId);
    setModoEntrenamiento(false);
  };

  const estadoVisual = estado === 'completado' ? (porcentaje === 100 ? 'Día completado' : 'Día incompleto') : 'Día pendiente';
  const buttonClasses = estado === 'completado' ? (porcentaje === 100 ? 'text-green-400 border-green-700' : 'text-yellow-400 border-yellow-700') : 'text-gray-400 border-gray-600';

  return (
    <div className="relative overflow-x-auto">
      <div className="flex justify-between items-center mb-2">
        <ButtonDark className={buttonClasses}>
          <span className="text-sm">{estadoVisual}</span>
        </ButtonDark>

        {isToday && (
          <ButtonBlue onClick={() => iniciarEntrenamiento(!modoEntrenamiento)} className={`m-1`}>
            {modoEntrenamiento ? 'Pausar' : 'Iniciar'}
          </ButtonBlue>
        )}
      </div>

      {/* Progreso */}
      {modoEntrenamiento || estado === 'completado' ? (
        <div className="mb-3">
          <p className="text-sm text-gray-300 mb-1">{`Progreso: ${completados} / ${total} ejercicios (${porcentaje}%)`}</p>
          <div className="w-full bg-gray-600 rounded-full h-2.5">
            <div className="h-2.5 bg-blue-600 rounded-full transition-all" style={{ width: `${porcentaje}%` }}></div>
          </div>
        </div>
      ) : null}

      {ejercicios.length === 0 ? (
        <div className="flex justify-center items-center mb-2">
          <h3 className="font-semibold text-lg">Aún no hay ejercicios en el día.</h3>
        </div>
      ) : (
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs uppercase text-gray-400">
            <tr>
              <th colSpan={2} className="px-2 py-3 w-[200px]">
                Ejercicio
              </th>
              <th className="px-2 py-3 text-center">Reps</th>
              <th className="px-2 py-3 text-center">Ser</th>
              <th className="px-2 py-3 text-center">Kg</th>
              {modoEntrenamiento && <th className="px-2 py-3 text-center">✔</th>}
            </tr>
          </thead>
          <tbody>
            {ejerciciosTemp.map((ej) => (
              <tr key={ej.id} className="border-b border-gray-700">
                <td colSpan={2} className="px-2 py-3 text-white font-medium">
                  {ej.ejercicio.nombre}
                </td>

                {['reps', 'series', 'peso'].map((campo) => {
                  const original = ejerciciosOriginales.find((e) => e.id === ej.id)?.[campo];
                  const actual = ej[campo];
                  const diferencia = original !== undefined ? actual - original : 0;

                  return (
                    <td key={campo} className="px-2 py-3 text-center">
                      {modoEntrenamiento ? (
                        <div className="flex flex-col items-center">
                          {/* Mostrar diferencia arriba */}
                          {diferencia !== 0 && <span className={`text-xs font-bold ${diferencia > 0 ? 'text-green-400' : 'text-red-400'}`}>{diferencia > 0 ? `+${diferencia}` : diferencia}</span>}

                          <button onClick={() => modificarValor(ej.id, campo, 'sumar')} className="text-green-400">
                            ▲
                          </button>
                          <span>{actual}</span>
                          <button onClick={() => modificarValor(ej.id, campo, 'restar')} className="text-red-400">
                            ▼
                          </button>
                        </div>
                      ) : (
                        actual
                      )}
                    </td>
                  );
                })}

                {modoEntrenamiento && (
                  <td className="px-2 py-3 text-center">
                    <input type="checkbox" checked={ej.completed} onChange={() => toggleCompleted(ej.id)} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Finalizar */}
      {modoEntrenamiento && (
        <div className="mt-4 flex justify-end">
          <button onClick={finalizarEntrenamiento} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
            Finalizar entrenamiento
          </button>
        </div>
      )}
    </div>
  );
};

export default CardHome;
