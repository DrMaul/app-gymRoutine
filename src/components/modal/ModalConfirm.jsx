import { useModalContext } from '../context/ModalContext';
import { ButtonBlue, ButtonDarkRed } from '@utils';

const ModalConfirm = ({mensaje, onAceptar}) => {

    const { abrirModal, cerrarModal } = useModalContext();

    const aceptar = () => {

        if (onAceptar) onAceptar();
        cerrarModal();
  
    };


    const cancelar = () => {
        cerrarModal();
    };

  return (
    <>
        <h2 className="text-lg font-semibold mb-4">Atención</h2>
        <p className="mb-2 text-xl text-gray-400">{mensaje}</p>
        <div className="flex justify-center space-x-4 mt-6">
        <ButtonBlue onClick={aceptar}>
            Aceptar
        </ButtonBlue>
        <ButtonDarkRed onClick={cancelar}>Cancelar</ButtonDarkRed>
        </div>
    </>
        

  );
}

export default ModalConfirm