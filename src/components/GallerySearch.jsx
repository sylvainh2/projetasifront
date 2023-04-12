// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


const GallerySearch =({handleSubmitSearch, menuDeroul})=>{
    return(
        <>
            <h2 className="searchTitle">Recherche</h2>
            <form onSubmit={handleSubmitSearch} id="search">
                <label>Galerie</label>
                <input className="findInput" type="search" name="gallery" list="searchList" />
                <datalist id="searchList">
                    {menuDeroul.map((menuList)=>{
                        return(
                            <option key={menuList.id_gall} value={menuList.name_gal}/>
                        )
                    })}
                </datalist>
                <label>Date</label>
                <input className="findInput findInputBtn" type="date" name="date" />
                <button className="findInputBtn" type="submit">Rechercher</button>
            </form>
            {/* <div className="uplDirectContent">
                <a className="uplDirect" href="#upl"><i className="fa-sharp fa-solid fa-arrow-down"></i> Poster Une Image <i className="fa-sharp fa-solid fa-arrow-down"></i></a>
            </div> */}
        </>
    )
}
export default GallerySearch;