import { useLocation, useNavigate } from 'react-router-dom';
import { useRutinaContext } from './context/RutinaContext';
import { ButtonDark, ArrowLeftIcon } from '@utils';
import { useState, useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setPerfilActual, rutinas } = useRutinaContext();

  const [mostrarFlecha, setMostrarFlecha] = useState(false);
  const pathParts = location.pathname.split('/').filter(Boolean);

  useEffect(() => {
    setMostrarFlecha(pathParts.length === 2);
  }, [location.pathname]);

  const titles = {
    '/': 'Inicio',
    '/calendar': 'Calendario',
    '/routines': 'Rutinas',
  };

  const getTitle = () => {
    if (mostrarFlecha) {
      const [resource, id] = pathParts;
      if (resource === 'routines') {
        const rutina = rutinas.find(r => r.id === id);
        return rutina?.nombre;
      }
    }

    return titles[location.pathname];
  };

  const cambiarPerfil = (e) => {
    setPerfilActual(e.target.value);
  };

  const volverAtras = () => {
    if (mostrarFlecha) {
      const [resource] = pathParts;
      navigate(`/${resource}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-800 mb-4 py-6 px-4">
      <div className="flex justify-between items-center">
        <div className="inline-flex gap-x-4 items-center min-h-[42px]">
          {mostrarFlecha && (
            <ButtonDark onClick={volverAtras}>
              <ArrowLeftIcon />
            </ButtonDark>
          )}
          <h1 className="text-2xl font-bold">{getTitle()}</h1>
        </div>
        <select
          id="perfil"
          onChange={cambiarPerfil}
          className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm"
        >
          <option value="entrenador">Entrenador</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>
    </div>
  );
};

export default Header;
