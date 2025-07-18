import ListItems from './ListItems';
import CardRoutine from './cards/CardRoutine';
import { useRutinaContext } from './context/RutinaContext';
import { useModalContext } from './context/ModalContext';
import { ButtonBlue, AddIcon} from '@utils';


const Routines = () => {

  const { abrirModal, cerrarModal } = useModalContext();
  
  const {rutinasOrdenadas, crearDia,perfilActual } = useRutinaContext();

  return (
    <>

      <ListItems id="rutinasContainer" items={rutinasOrdenadas} CardComponent={CardRoutine} />

      {perfilActual === 'entrenador' && (
        <div className="mt-6 text-center" id="agregarRutinaContainer">
          <ButtonBlue id="btnAgregarDia" onClick={() => abrirModal('nuevaRuti')} className="text-xl inline-flex gap-x-2">
            <AddIcon />
            Crear nueva rutina
          </ButtonBlue>
        </div>
      )}
    </>
  );
}

export default Routines