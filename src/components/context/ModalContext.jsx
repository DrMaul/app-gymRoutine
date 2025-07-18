import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModalContext = () => useContext(ModalContext);

export const ModalContextProvider = ({ children }) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalProps, setModalProps] = useState({}); 

  const abrirModal = (nombre, props = {}) => {
    setModalAbierto(nombre)
    setModalProps(props);
  };

  const cerrarModal = () => {
    setModalAbierto(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ modalAbierto, modalProps, abrirModal, cerrarModal }}>
      {children}
    </ModalContext.Provider>
  );
};
