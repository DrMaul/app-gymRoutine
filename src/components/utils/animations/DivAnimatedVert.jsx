const DivAnimatedVert = ({ children, condition }) => {
    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${condition ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0'}`}>
            {children}
        </div>
    )
}

export default DivAnimatedVert