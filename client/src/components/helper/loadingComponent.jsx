

function LoadingComponent() {
    return (
       <div className="flex justify-center items-center h-[300px] w-full"> 
         <div className="spinner-container">
            <div className="spinner">
                <div className="spinner-circle"></div>
            </div>
        </div>
       </div>

    );
}

export default LoadingComponent;