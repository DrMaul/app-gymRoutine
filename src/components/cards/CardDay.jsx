import CardDayHeader from "./CardDayHeader";
import CardDayBody from "./CardDayBody";

const CardDay = ({ item: dia }) => {
    
  return (
    <>
        <CardDayHeader dia={dia}/>
        <CardDayBody dia={dia}/>
    </>
  );
};
export default CardDay;
