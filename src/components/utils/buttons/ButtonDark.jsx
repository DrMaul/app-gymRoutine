
const ButtonDark = ({ onClick, children, className = "" }) => {
  return (
    <button
        onClick={onClick}
        className={`py-2 px-2.5 text-sm font-medium rounded-full border bg-gray-800/10 text-gray-400 border-gray-700 transition-hover duration-200 hover:text-white hover:bg-gray-700/50 ${className}`}>
        {children}
    </button>
  )
}

export default ButtonDark