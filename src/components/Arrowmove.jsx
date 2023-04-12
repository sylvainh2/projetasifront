function Arrowmove(props) {
    // const offst = props.offtab.offs;
    // const long = props.offtab.longP;
    const pushToTop = props.pushToTop;
    // console.log("arrow",props,offst,long);
    return(
        <>
            <div className="arrow_cont">
                {/* {offst>=10 && */}
                    {/* <> */}
                    {/* {document.documentElement.clientHeight>1000 && */}
                        <button className="arrow_top" type="button" name="retour_max" onClick={pushToTop}>
                            <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        {/* } */}
                        {/* <button className="arrow_up" type="button" name="retour">
                            <i className="fa-solid fa-arrow-up"></i>
                        </button> */}
                    {/* </> */}
                {/* } */}
                {/* {(long-offst)>10 && */}
                    {/* <> */}
                        {/* <button className="arrow_down" type="button" name="avance">
                            <i className="fa-solid fa-arrow-down"></i>
                        </button> */}
                        {/* <button className="arrow_bottom" type="button" name="avance_max">
                            <i className="fa-solid fa-arrow-down"></i>
                        </button> */}
                    {/* </> */}
                {/* } */}
            </div>
        </>
    )
} 

export default Arrowmove;