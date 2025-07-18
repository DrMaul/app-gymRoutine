import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { useCalendarContext } from './context/CalendarContext';
import ModalCalendarDay from './modal/ModalCalendarDay';
import Card from './cards/Card';
import { ArrowLeftIcon, ArrowRightIcon, ButtonIcon } from '@utils';
import CardHome from './cards/CardHome';
import ProgressHome from './ProgressHome';

dayjs.locale('es');

const WeeklyCarousel = () => {
  const { obtenerEventosPorDia, obtenerProximoEvento, eventos } = useCalendarContext();
  const today = dayjs();

  const [semanaInicio, setSemanaInicio] = useState(today.startOf('week'));

  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [isToday, setIsToday] = useState(false);
  const [esInicioFin, setEsInicioFin] = useState(false);

  const scrollRef = useRef(null);

  const diasSemana = Array.from({ length: 7 }, (_, i) => semanaInicio.add(i, 'day'));

  // Buscar evento de hoy o próximo
  useEffect(() => {
    if (!eventos || eventos.length === 0) return; // No ejecutar hasta que haya eventos

    const evento = obtenerProximoEvento(today);
    if (evento) {
      const fechaEvento = evento.esFin ? dayjs(evento.fechaFin) : dayjs(evento.fechaInicio);

      setIsToday(fechaEvento.isSame(today, 'day'));
      setEsInicioFin(evento.esInicio || evento.esFin);

      console.log('isToday', fechaEvento.isSame(today, 'day'));
      setEventoSeleccionado(evento);
    }
  }, [eventos]); // <- solo se ejecuta cuando cambia eventos

  const scrollByCard = (direction = 'right') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemWidth = 200;
    container.scrollBy({
      left: direction === 'left' ? -itemWidth : itemWidth,
      behavior: 'smooth'
    });
  };

  const scrollToToday = () => {
    const index = diasSemana.findIndex((d) => d.isSame(today, 'day'));
    if (index !== -1 && scrollRef.current) {
      const itemWidth = scrollRef.current.firstChild?.offsetWidth || 150;
      scrollRef.current.scrollTo({
        left: itemWidth * (index - 1),
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToToday();
  }, [semanaInicio]);

  const cambiarSemana = (direction) => {
    const delta = direction === 'prev' ? -1 : 1;
    setSemanaInicio((prev) => prev.add(delta, 'week'));
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    const [año, mes, día] = fechaISO.split('-');
    return `${día}-${mes}-${año}`;
  };

  return (
    <div>
      {/* Cabecera con botones de semana 
      <div className="flex justify-between items-center mb-4">
        <ButtonIcon onClick={() => cambiarSemana('prev')}>
          <ArrowLeftIcon />
        </ButtonIcon>

        <h3 className="text-lg font-semibold text-gray-300 text-center">
          Semana del {semanaInicio.format('DD')} al {semanaInicio.add(6, 'day').format('DD MMM')}
        </h3>

        <ButtonIcon onClick={() => cambiarSemana('next')}>
          <ArrowRightIcon />
        </ButtonIcon>
      </div> */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl text-gray-300"> Mi semana</h3>
        <ButtonIcon onClick={() => cambiarSemana('next')}>
          <ArrowRightIcon />
        </ButtonIcon>
      </div>

      {/* Botones de desplazamiento horizontal */}
      <div className="relative">
        <button onClick={() => scrollByCard('left')} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 rounded-full z-10 hover:bg-gray-600">
          <ArrowLeftIcon />
        </button>

        <div ref={scrollRef} className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-8" style={{ scrollBehavior: 'smooth' }}>
          {diasSemana.map((date, idx) => {
            const dateKey = date.format('YYYY-MM-DD');
            const eventos = obtenerEventosPorDia(dateKey);
            const isToday = date.isSame(today, 'day');

            return (
              <div key={idx} className={`min-w-[150px] bg-gray-800 border border-gray-600 rounded-lg p-3 snap-center flex-shrink-0 cursor-pointer hover:bg-gray-600 ${isToday ? 'ring-4 ring-blue-500' : ''}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400 capitalize">{date.format('dddd')}</span>
                  <span className="text-sm font-bold">{date.format('D')}</span>
                </div>

                {eventos.length > 0 ? (
                  eventos.map((ev, i) => (
                    <div
                      key={i}
                      className="bg-blue-600 rounded p-1 text-xs text-white text-center hover:bg-blue-700"
                      onClick={() => {
                        setEventoSeleccionado(ev);
                      }}>
                      <div className="font-semibold">{ev.title}</div>
                      <div>{ev.subtitle}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">Día de descanso</p>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={() => scrollByCard('right')} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-1 rounded-full z-10 hover:bg-gray-600">
          <ArrowRightIcon />
        </button>
      </div>

      {/* Botón para volver al día actual */}
      <div className="mt-2 flex justify-center">
        <ButtonIcon onClick={scrollToToday}>
          <ArrowRightIcon />
        </ButtonIcon>
      </div>

      {/* Evento seleccionado */}
      {eventoSeleccionado && (
        <div className="mt-8 p-4 rounded-xl bg-gray-800 shadow-lg border border-gray-700 space-y-3">
          {/* Encabezado */}
          <div>
            <h2 className="text-xl font-bold text-white">
              {isToday ? 'Día de entrenamiento' : 'Próximo entrenamiento'}: <span className="font-normal text-blue-400">{eventoSeleccionado.title}</span>
            </h2>
            {eventoSeleccionado.subtitle && <p className="text-base text-gray-400 mt-1">{eventoSeleccionado.subtitle}</p>}
          </div>

          {/* Fechas */}
          <div className="text-sm text-gray-400">
            <p>
              <span className="font-medium text-gray-300">Inicio:</span> {formatearFecha(eventoSeleccionado.fechaInicio)}
            </p>
            {esInicioFin && eventoSeleccionado.fechaFin && (
              <p>
                <span className="font-medium text-gray-300">Fin:</span> {formatearFecha(eventoSeleccionado.fechaFin)}
              </p>
            )}
          </div>

          {/* Contenido dinámico */}
          {!esInicioFin && (
            <div className="mt-4">
              <Card>
                <CardHome {...eventoSeleccionado} isToday={isToday} />
              </Card>
            </div>
          )}
        </div>
      )}

      {eventoSeleccionado && (
        <div className="mt-8 p-4 rounded-xl bg-gray-800 shadow-lg border border-gray-700 space-y-3">
            {!esInicioFin && (
              <div className="mt-4">
                <ProgressHome {...eventoSeleccionado} isToday={isToday} />
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default WeeklyCarousel;
