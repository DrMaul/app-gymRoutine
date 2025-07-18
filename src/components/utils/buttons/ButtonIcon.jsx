
const ButtonIcon = ({ onClick, children, className = "" }) => {
  return (
    <button
        onClick={onClick}
        className={`transition-transform duration-200 hover:scale-110 hover:text-blue-600 ${className}`}>
        {children}
    </button>
  )
}

export default ButtonIcon