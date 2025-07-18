import { useRutinaContext } from '../context/RutinaContext';
import { useModalContext } from '../context/ModalContext';
import { ButtonDark, ButtonDarkRed, ButtonIcon, ArrowUpIcon, ArrowDownIcon, DivAnimatedHoriz } from '@utils';

const CardDayHeader = ({ dia }) => {
  const { perfilActual, diaEnEdicion, editarDia, salirEditar, moverDia, diasOrdenadosLength, eliminarDia, validarDiaAsignado, asignarDiaDeSemana,actualizarNombreDia } = useRutinaContext();

  const { abrirModal } = useModalContext();

  const diasSemana = [
    { letra: 'L', nombre: 'Lunes', index: 1 },
    { letra: 'M', nombre: 'Martes', index: 2 },
    { letra: 'X', nombre: 'Miercoles', index: 3 },
    { letra: 'J', nombre: 'Jueves', index: 4 },
    { letra: 'V', nombre: 'Viernes', index: 5 },
    { letra: 'S', nombre: 'Sábado', index: 6 },
    { letra: 'D', nombre: 'Domingo', index: 7 }
  ];

  const getNombreDia = (index) => {
    return diasSemana.find((d) => d.index === index)?.nombre || '';
  };

  const handleAsignarDia = (diaId, index) => {
    let resultado = validarDiaAsignado(diaId, index);
    let nombreDia = getNombreDia(index);
    let mensaje = '';

    if (resultado === 1) {
      mensaje = `Ya existe un día asignado el ${nombreDia}.`;
      abrirModal('modalConfirm', { mensaje });
    } else if (resultado === 2) {
      mensaje = `El día actual ya está asignado como ${nombreDia}. ¿Desea desasignarlo?`;
      abrirModal('modalConfirm', { mensaje, onAceptar: () => asignarDiaDeSemana(diaId, null) });
    } else {
      mensaje = `Se asignará el día actual al día ${nombreDia}.\n¿Desea continuar?`;
      abrirModal('modalConfirm', { mensaje, onAceptar: () => asignarDiaDeSemana(diaId, index) });
    }
  };

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">{`Día ${dia.orden}`}</h2>

        {perfilActual === 'entrenador' && (
          <div className="flex gap-2 items-center">
            {diaEnEdicion === dia.id ? (
              <>
                <ButtonDark onClick={() => salirEditar(dia.id)}>Guardar cambios</ButtonDark>
              </>
            ) : (
              <ButtonDark onClick={() => editarDia(dia.id)}>Editar</ButtonDark>
            )}

            <DivAnimatedHoriz condition={diaEnEdicion === dia.id}>
              <ButtonDarkRed onClick={() => abrirModal('modalConfirm', { mensaje: 'Se eliminará el día seleccionado.\n¿Desea continuar?', onAceptar: () => eliminarDia(dia.id) })}>Borrar día</ButtonDarkRed>
            </DivAnimatedHoriz>

            {dia.orden !== 1 && (
              <ButtonIcon onClick={() => moverDia(dia.id, 'arriba')}>
                <ArrowUpIcon />
              </ButtonIcon>
            )}

            {dia.orden !== diasOrdenadosLength && (
              <ButtonIcon onClick={() => moverDia(dia.id, 'abajo')}>
                <ArrowDownIcon />
              </ButtonIcon>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-start py-1">
        {diaEnEdicion === dia.id ? (
          <h3
            className="text-gray-400 hover:text-blue-400  hover:underline hover:scale-105 transform transition duration-200 cursor-pointer"
            onClick={() =>
              abrirModal('editarNombre', {
                nombreActual: dia.nombre || '',
                onAceptar: (nombre) => actualizarNombreDia(dia.id, nombre)
              })
            }>
            {dia.nombre || 'Descripción'}
          </h3>
        ) : (
          <h3 className="text-gray-400">{dia.nombre || 'Descripción'}</h3>
        )}
      </div>
      <div className="flex space-x-2 items-center">
        <div className="relative">
          {/* Mostrar día seleccionado solo si existe y no está en edición */}
          {dia.diaAsignado !== null && (
            <div className={`absolute transition-all duration-300 ease-in-out ${diaEnEdicion === dia.id ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
              <span className="flex items-center justify-center p-2 w-full h-6 text-xs font-semibold rounded-full bg-blue-600 text-white">{diasSemana.find((d) => d.index === dia.diaAsignado)?.nombre || ''}</span>
            </div>
          )}

          {/* Mostrar todos los días cuando:
              1. Está en modo edición O
              2. No hay día asignado
          */}
          <div className={`flex gap-2 transition-all duration-300 ease-in-out ${diaEnEdicion === dia.id || dia.diaAsignado === null ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}>
            {diasSemana.map(({ letra, index }) => (
              <span key={index} onClick={() => handleAsignarDia(dia.id, index)} className={`flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${dia.diaAsignado === index ? 'bg-blue-600 text-white hover:bg-gray-700 hover:text-gray-300 transition duration-200 cursor-pointer' : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white hover:scale-105 transform transition duration-200 cursor-pointer'}`}>
                {letra}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDayHeader;
