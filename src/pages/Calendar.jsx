import { useCalendarContext } from './context/CalendarContext';
import { useModalContext } from './context/ModalContext';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { ButtonDark, ArrowRightIcon, ArrowLeftIcon } from '@utils';

dayjs.locale('es');
const daysShort = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const today = dayjs();

const Calendar = () => {
  const { fechaActual, siguienteMes, mesAnterior, obtenerEventosPorDia } = useCalendarContext();
  const {abrirModal} = useModalContext();

  const startOfMonth = fechaActual.startOf('month');
  const endOfMonth = fechaActual.endOf('month');
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
  const daysInMonth = fechaActual.daysInMonth();

  const generateCalendar = () => {
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    const days = [];

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startDay + 1;
      const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
      const date = isCurrentMonth ? fechaActual.date(dayNum) : null;
      const dateKey = date?.format('YYYY-MM-DD');
      const events = date ? obtenerEventosPorDia(dateKey) : [];

      const isToday = date && date.isSame(today, 'day');

      days.push(
        <td key={i} className={`border border-gray-700 p-1 h-40 w-10 overflow-hidden ${isCurrentMonth ? '' : 'bg-gray-900/40'} transition cursor-pointer duration-500 ease hover:bg-gray-600 active:bg-gray-600`}>
          <div className="flex flex-col justify-start w-full h-full overflow-hidden break-words">
            <div className="h-5 mb-2">{dayNum > 0 && dayNum <= daysInMonth && <span className={`text-xs ${isToday ? 'font-bold bg-blue-600 border border-gray-500 shadow-lg rounded-xl px-2 py-1' : 'text-gray-500'}`}>{dayNum}</span>}</div>
            <div className="flex-grow py-1 space-y-1">
              {events.map((event, idx) => (
                <div key={idx} onClick={() => abrirModal('modalDiaCalendar',{event})} className="flex-grow space-y-1 bg-blue-600 text-white rounded p-1 text-xs w-full break-words whitespace-normal hover:bg-blue-700 active:bg-blue-700">
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-[10px]">{event.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </td>
      );
    }

    return Array.from({ length: totalCells / 7 }, (_, i) => (
      <tr key={i} className="text-center h-20">
        {days.slice(i * 7, i * 7 + 7)}
      </tr>
    ));
  };

  const formattedDate = fechaActual.format('MMMM YYYY');
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <ButtonDark onClick={mesAnterior}>
          <ArrowLeftIcon />
        </ButtonDark>
        <h3 className="text-xl text-gray-300">{capitalizedDate}</h3>
        <ButtonDark onClick={siguienteMes}>
          <ArrowRightIcon />
        </ButtonDark>
      </div>

      <div className="bg-gray-800 rounded-lg shadow text-white">
        <table className="table-fixed w-full border-separate border-spacing-0 rounded-md border border-gray-700">
          <thead>
            <tr>
              {daysShort.map((day, i) => (
                <th key={i} className="p-2 h-10 w-10">
                  <span>{day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{generateCalendar()}</tbody>
        </table>
      </div>
    </>
  );
};

export default Calendar;
