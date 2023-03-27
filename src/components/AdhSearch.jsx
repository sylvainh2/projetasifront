const AdhSearch = ({trombiImg, handleSubmitSearch, serverBack})=>{
    return(
        <>
            <form className="searchForm" id="formulsearch" onSubmit={handleSubmitSearch}>
                <div className="userDelCont">
                <label className="userDel">Nom:<input className="userDelLab" type="text" name="nameSearch" /></label>
                <label className="userDel">Prénom:<input type="text" name="first_nameSearch" /></label>
                <button className="userDel" type="submit">Chercher</button>
                </div>
            </form>
            {trombiImg.length !=0 ?
                <div className="searchImg">
                    <img className="searchPic" src={serverBack+"/profiles/"+trombiImg.profil_picture}/>
                    <p>{trombiImg.name}</p>
                    <p>{trombiImg.first_name}</p>
                </div>:
            <>
            </>
            }
        </>
    )
}
export default AdhSearch;