import { NavLink } from 'react-router-dom';
import { ButtonDark, OptionsIcon } from '@utils';
import { useState, useRef, useEffect } from 'react';
import { useModalContext } from '../context/ModalContext';
import { useRutinaContext } from '../context/RutinaContext';

const CardRoutine = ({ item: rutina }) => {
  const { abrirModal } = useModalContext();
  const {editarNombreRutina, borrarRutina, finalizarRutina} = useRutinaContext();

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    const [año, mes, día] = fechaISO.split('-');
    return `${día}-${mes}-${año}`;
  };

  const handleModalMenu = (rutina) => {
    abrirModal('modalListMenu', {
      rutina,
      opciones: [
        {
          label: 'Editar',
          onClick: () =>
            abrirModal('editarNombre', {nombreActual: rutina.nombre, onAceptar: (nombre) => editarNombreRutina(rutina.id, nombre)})
        },
        {
          label: 'Finalizar',
          onClick: () => abrirModal('modalConfirm', { mensaje: 'Se finalizará la rutina seleccionada.\n¿Desea continuar?', onAceptar: () => finalizarRutina(rutina.id) })
        },
        {
          label: 'Borrar',
          onClick: () => abrirModal('modalConfirm', { mensaje: 'Se eliminará la rutina seleccionada.\n¿Desea continuar?', onAceptar: () => borrarRutina(rutina.id) })
        }
      ]
    });
  };

  return (
    <div className="flex justify-between items-center my-2">
      <div className="flex flex-col">
        <NavLink to={`/routines/${rutina.id}`} className="text-blue-400 hover:underline">
          <h2 className="font-semibold text-xl">{rutina.nombre}</h2>
        </NavLink>
        <p className="text-md text-gray-400">{`Inicio: ${formatearFecha(rutina.fechaInicio)}`}</p>
        {rutina.fechaFin && <p className="text-md text-gray-400">{`Fin: ${formatearFecha(rutina.fechaFin)}`}</p>}
      </div>

      <ButtonDark onClick={() => handleModalMenu(rutina)} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors">
        <OptionsIcon />
      </ButtonDark>
    </div>
  );
};

export default CardRoutine;
