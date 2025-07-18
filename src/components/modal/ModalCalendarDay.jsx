import { useModalContext } from '../context/ModalContext';
import { ButtonIcon, ButtonDark, ExitIcon} from '@utils';
import { NavLink } from 'react-router-dom';

const ModalCalendarDay = (event) => {

  let { title, subtitle, rutinaId, nombreRutina, semanaId, nombreDia, ejercicios, esInicio, esFin,fechaInicio, fechaFin } = event

  const { cerrarModal } = useModalContext();

  const esInicioFin = esInicio || esFin;

    const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    const [año, mes, día] = fechaISO.split('-');
    return `${día}-${mes}-${año}`;
  };

  return (
    <>
      <div className="flex flex-col space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">{title}</h2>
          <div className="flex gap-2 items-center">
            <NavLink to={esInicioFin ? `/routines/${rutinaId}` : `/routines/${rutinaId}?semanaId=${semanaId}`} onClick={cerrarModal}>
              <ButtonDark>Ver Rutina</ButtonDark>
            </NavLink>
            <ButtonIcon onClick={cerrarModal}>
              <ExitIcon />
            </ButtonIcon>
          </div>
        </div>
        <div className="flex items-center justify-start">
          <h3 className="text-gray-400 text-lg">{subtitle}</h3>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        {esInicioFin ? 
        ( 
          <div className="flex flex-col">
              <p className="text-gray-400 text-sm">{`Inicio: ${formatearFecha(fechaInicio)}`}</p>
              <p className="text-gray-400 text-sm">{`Fin: ${formatearFecha(fechaFin)}`}</p>

          </div>
        ) 
        : 
        (
          <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs uppercase text-gray-400">
            <tr>
              <th scope="col" colSpan={2} className="px-2 py-3 w-[200px] max-w-[200px]">
                Ejercicio
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                Reps
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                Ser
              </th>
              <th scope="col" className="px-2 py-3 text-center">
                Kg
              </th>
            </tr>
          </thead>
          <tbody>
            {ejercicios.map((ej) => (
              <tr key={ej.id} className="border-b border-gray-700">
                <th scope="row" colSpan={2} className="px-2 py-4 font-medium whitespace-normal break-words text-white w-[200px] max-w-[200px]">
                  {ej.ejercicio.nombre}
                </th>
                <td className="px-2 py-4 text-center">{ej.reps}</td>
                <td className="px-2 py-4 text-center">{ej.series}</td>
                <td className="px-2 py-4 text-center">{ej.peso}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        
      </div>
    </>
  );
};

export default ModalCalendarDay;
