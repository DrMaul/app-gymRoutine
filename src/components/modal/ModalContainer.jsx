import { useModalContext } from '../context/ModalContext';
import { useEffect } from 'react';
import ModalEditEj from './ModalEditEj';
import ModalNewEj from './ModalNewEj';
import ModalConfirm from './ModalConfirm';
import ModalNewRoutine from './ModalNewRoutine';
import ModalEditName from './ModalEditName';
import ModalCalendarDay from './ModalCalendarDay';
import ModalListMenu from './ModalListMenu';

const ModalContainer = () => {
  const { modalAbierto, modalProps } = useModalContext();

  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();

    if (modalAbierto) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', preventScroll, { passive: false });
    } else {
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', preventScroll);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [modalAbierto]);

  return (
    <>
      {modalAbierto && modalAbierto !== 'modalListMenu' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl p-6 w-11/12 max-w-sm">
            {modalAbierto === 'nuevaRuti' && <ModalNewRoutine />}

            {modalAbierto === 'editarEj' && <ModalEditEj diaId={modalProps.diaId} ejercicioId={modalProps.ejercicioId} categoriaSeleccionada={modalProps.categoriaSeleccionada} ejercicioSeleccionado={modalProps.ejercicioSeleccionado} />}

            {modalAbierto === 'nuevoEj' && <ModalNewEj diaId={modalProps.diaId} categoriaInput={modalProps.categoriaInput} />}

            {modalAbierto === 'modalConfirm' && <ModalConfirm mensaje={modalProps.mensaje} onAceptar={modalProps.onAceptar} />}

            {modalAbierto === 'editarNombre' && <ModalEditName nombreActual={modalProps.nombreActual} onAceptar={modalProps.onAceptar} />}

            {modalAbierto === 'modalDiaCalendar' && <ModalCalendarDay {...modalProps.event} />}
          </div>
        </div>
      )}

      {modalAbierto === 'modalListMenu' && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
          <div className="bg-gray-800 text-white rounded-xl mt-8 py-2 w-11/12 max-w-sm">
            <ModalListMenu {...modalProps} />
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContainer;
