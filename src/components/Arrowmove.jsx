function arrowmove(props) {
    return(
        <>
            <div>
                {offst>=10 &&
                    <>
                        <i className="fa-solid fa-arrow-up-to-line arrow"></i>
                        <i className="fa-solid fa-arrow-up arrow"></i>
                    </>
                }
                {(long-offst)>10 &&
                    <>
                        <i className="fa-solid fa-arrow-down arrow"></i>
                        <i className="fa-solid fa-arrow-up-to-line arrow"></i>
                    </>
                }
            </div>
        </>
    )
} 