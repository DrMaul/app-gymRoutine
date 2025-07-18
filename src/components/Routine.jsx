import ListItems from './ListItems';
import CardDay from './cards/CardDay';
import { useRutinaContext } from './context/RutinaContext';
import { ButtonDark, ButtonBlue, AddIcon, ArrowRightIcon, ArrowLeftIcon } from '@utils';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

const Routine = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const semanaId = searchParams.get('semanaId');

  const { rutinas, crearDia, cambiarRutinaId, semanaActual, cambiarSemana, perfilActual, diasOrdenados } = useRutinaContext();

  const rutinaExiste = useMemo(() => rutinas.find((r) => r.id === id), [rutinas, id]);

  useEffect(() => {
    if (rutinaExiste) {
      cambiarRutinaId(id, semanaId);
    } else {
      // Redireccionamos al home
      navigate('/', { replace: true });
    }
  }, [id, rutinaExiste, semanaId]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <ButtonDark onClick={() => cambiarSemana(-1)}>
          <ArrowLeftIcon />
        </ButtonDark>
        <h3 className="text-xl text-gray-300">Semana {semanaActual.orden}</h3>
        <ButtonDark onClick={() => cambiarSemana(1)}>
          <ArrowRightIcon />
        </ButtonDark>
      </div>

      <ListItems id="diasContainer" items={diasOrdenados} CardComponent={CardDay} />

      {perfilActual === 'entrenador' && (
        <div className="mt-6 text-center" id="agregarDiaContainer">
          <ButtonBlue id="btnAgregarDia" onClick={crearDia} className="text-xl inline-flex gap-x-2">
            <AddIcon />
            Agregar día de entrenamiento
          </ButtonBlue>
        </div>
      )}
    </>
  );
};

export default Routine;
