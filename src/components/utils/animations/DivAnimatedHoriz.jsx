const DivAnimatedHoriz = ({ children, condition }) => {
    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${condition ? 'opacity-100 max-w-[200px] max-h-[100px]' : 'opacity-0 max-w-0 max-h-0'}`}>
            {children}
        </div>
    )
}

export default DivAnimatedHoriz