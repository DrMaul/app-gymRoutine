import { NavLink } from 'react-router-dom';
import { ButtonIcon, CalendarIcon, RoutinesIcon, HomeIcon, ProfileIcon } from '@utils';
import { useModalContext } from './context/ModalContext';

const Footer = () => {
  const { modalAbierto } = useModalContext();

  return (
    <>
      {!modalAbierto && (
        <div className="grid grid-cols-5 mx-auto fixed z-50 w-[calc(100%-1.5rem)] h-16 max-w-lg -translate-x-1/2 bg-gray-700 border border-gray-600 rounded-full bottom-4 left-1/2 overflow-visible">
          <NavLink to={'/calendar'} className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-800 group" role="button">
            <div className="transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600">
              <CalendarIcon />
            </div>
          </NavLink>

          <NavLink to={'/routines'} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group" role="button">
            <div className="transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600">
              <RoutinesIcon />
            </div>
          </NavLink>

          <div></div>
          <NavLink to={'/'} role="button" className="absolute bottom-0 left-1/2 translate-x-[-50%] inline-flex items-center justify-center w-20 h-20 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none z-10 shadow-lg">
            <div className="transition-transform duration-200 group-hover:scale-110 group-hover:text-white">
              <HomeIcon />
            </div>
          </NavLink>

          <div></div>

          <button type="button" className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-800 group">
            <div className="transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600">
              <ProfileIcon />
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default Footer;
