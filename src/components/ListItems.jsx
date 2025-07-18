import Card from "./cards/Card"
const ListItems = ({idContainer, items = [], CardComponent}) => {
  
  return (
    <div id={idContainer} className='space-y-4'>
        {items.length === 0 ? 
          (
            <p className="text-gray-500 text-center">No hay elementos para mostrar.</p>
          ) 
          : 
          (
            items.map((item) => (
              <Card  key={item.id}>
                <CardComponent item={item} />
              </Card>
            ))
          )
        }
        

    </div>
 
  
  )
}

export default ListItems