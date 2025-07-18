import { useState, useRef, useEffect  } from 'react';
import { useModalContext } from '../context/ModalContext';
import { ButtonBlue, ButtonDarkRed } from '@utils';

const ModalEditName = ({nombreActual, onAceptar }) => {
    const inputRef = useRef(null);
    useEffect(() => {
    // Enfoca el input al montar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [nuevoNombre, setNuevoNombre] = useState(nombreActual || '');
  const [error, setError] = useState('');
  const { abrirModal, cerrarModal } = useModalContext();

  const guardarNombre = () => {
     const nombre = nuevoNombre.trim();

    if (!nombre) {
      setError('El nombre no puede estar vacío.');
      return;
    }

    if (nombre.length > 20) {
      setError('Máximo 20 caracteres.');
      return;
    }

    let mensaje = `Se actualizara el nombre "${nombreActual}" por "${nombre}".\n¿Desea continuar?`;
    abrirModal('modalConfirm', { mensaje, onAceptar: () => onAceptar(nombre) });
  
  
  };

  const cancelar = () => {
    cerrarModal();
  };


  return (
    <>
        <h2 className="text-lg font-semibold mb-4">Editar nombre</h2>
        <input
            ref={inputRef}
            type="text"
            className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-700 text-white"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            maxLength={20}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                e.preventDefault();
                guardarNombre();
                } else if (e.key === 'Escape') {
                e.preventDefault();
                cancelar();
                }
            }}
        />


        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex justify-end space-x-4">
            <ButtonBlue onClick={guardarNombre}>Guardar</ButtonBlue>
            <ButtonDarkRed onClick={cancelar}>Cancelar</ButtonDarkRed>
        </div>
    </>
  )
}

export default ModalEditName