import { useModalContext } from '../context/ModalContext';
import { ButtonIcon, ButtonDark, ExitIcon } from '@utils';

const ModalListMenu = ({ rutina, opciones }) => {
  const { cerrarModal } = useModalContext();

  return (
    <>
    <div className='flex justify-between py-2 px-4'>
        <h2 className="font-semibold text-lg">{rutina.nombre}</h2>

        <ButtonIcon onClick={cerrarModal}>
            <ExitIcon />
        </ButtonIcon>

    </div>

      <div className="w-full rounded-xl">
        <ul className="py-1 text-gray-200">
          {opciones?.map((opcion, index) => (
            <li key={index}>
              <button
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-600 hover:text-white"
                onClick={() => {
                  opcion.onClick?.();
                }}
              >
                {opcion.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ModalListMenu;
