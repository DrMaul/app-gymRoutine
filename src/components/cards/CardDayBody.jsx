import { useRutinaContext } from "../context/RutinaContext";
import { useModalContext } from '../context/ModalContext';
import { ButtonIcon, EditIcon, DeleteIcon, ButtonBlue, AddIcon, DivAnimatedVert } from '@utils';

const CardDayBody = ({ dia }) => {
  const { diaEnEdicion, rutinas, setRutinas, rutinaActualIndex, semanaActualIndex } = useRutinaContext();

    const { abrirModal } = useModalContext();

    const ejercicios = dia.ejercicios;
    const ejerciciosOrdenados = ejercicios.sort((a, b) => a.orden - b.orden);

    const borrarEjercicio = (diaId, ejercicioId) => {

        const confirmBorrar = confirm("Desea borrar el ejercicio?.");
        if (confirmBorrar) {
            const nuevasRutinas = [...rutinas];
            const rutina = nuevasRutinas[rutinaActualIndex];
            const semana = rutina.semanas[semanaActualIndex];
            const dia = semana.dias.find(d => d.id === diaId);
            if (!dia) return;
        
            dia.ejercicios = dia.ejercicios.filter((ej) => ej.id !== ejercicioId);
        
            setRutinas(nuevasRutinas);

        }else{
            return
        }

    }


  return (

    <>
        <div className="relative overflow-x-auto">
            {ejercicios.length === 0 
                ? (
                    <div className="flex justify-center items-center mb-2">
                        <h3 className="font-semibold text-lg">Aún no hay ejercicios en el día.</h3>
                    </div>
                ) 
                : (
                    <>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                            <thead className="text-xs uppercase text-gray-400">
                            <tr>
                                <th scope="col" colSpan={2} className="px-2 py-3 w-[200px] max-w-[200px]">Ejercicio</th>
                                <th scope="col" className="px-2 py-3 text-center">Reps</th>
                                <th scope="col" className="px-2 py-3 text-center">Ser</th>
                                <th scope="col" className="px-2 py-3 text-center">Kg</th>
                                {diaEnEdicion === dia.id && (
                                <th scope="col" colSpan={2} className="px-2 py-3 text-center">Acciones</th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {ejerciciosOrdenados.map((ej) => (
                                <tr key={ej.id} className="border-b border-gray-700">
                                    <th scope="row" colSpan={2} className="px-2 py-4 font-medium whitespace-normal break-words text-white w-[200px] max-w-[200px]">
                                        {ej.ejercicio.nombre}
                                    </th>
                                    <td className="px-2 py-4 text-center">{ej.reps}</td>
                                    <td className="px-2 py-4 text-center">{ej.series}</td>
                                    <td className="px-2 py-4 text-center">{ej.peso}</td>
                                    {diaEnEdicion === dia.id && (
                                        <>
                                            <td className="px-2 py-4 text-center">
                                                <ButtonIcon onClick={() => abrirModal('editarEj', {diaId: dia.id, ejercicioId: ej.id})}><EditIcon/></ButtonIcon>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <ButtonIcon onClick={() => borrarEjercicio(dia.id, ej.id)}><DeleteIcon/></ButtonIcon>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </>
                )
            }

            <DivAnimatedVert condition={diaEnEdicion === dia.id}>
                <div className="text-center mt-4">
                    <ButtonBlue onClick={() => abrirModal('editarEj', {diaId: dia.id})} className='inline-flex gap-x-2'>
                        <AddIcon/>
                        Agregar ejercicio
                    </ButtonBlue>
                </div>
            </DivAnimatedVert>
            

        </div>
    </>
  )
}

export default CardDayBody;
