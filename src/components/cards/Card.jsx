
const Card = ({ onClick, children, className = "" }) => {
  return (
    <div 
        onClick={onClick}
        className={`bg-gradient-to-r from-gray-800 to-gray-800/90 
            hover:from-gray-700/20 hover:to-gray-700/30 
            backdrop-blur-lg rounded-lg p-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all transform hover:-translate-y-1 ${className}`}>
        {children}
    </div>
  )
}

export default Card