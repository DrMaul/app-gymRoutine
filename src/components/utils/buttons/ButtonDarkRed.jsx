
const ButtonDarkRed = ({ onClick, children, className = "" }) => {
  return (
    <button
        onClick={onClick}
        className={`py-2 px-4 text-sm font-medium rounded-full border bg-gray-800/10 text-red-400 border-red-700 transition-hover duration-200 hover:text-white hover:bg-red-700/50 ${className}`}>
        {children}
    </button>
  )
}

export default ButtonDarkRed