
const ButtonBlue = ({ onClick, children, className = "" }) => {
  return (
    <button 
        onClick={onClick}
        className={`py-2.5 px-5 text-white font-medium items-center transition-hover duration-200 text-center bg-blue-600 rounded-full hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none ${className}`}>
        {children}
    </button>
  )
}

export default ButtonBlue