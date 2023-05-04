const AdhSearch = ({trombiImg, userList, handleSubmitSearch, serverBack})=>{
    return(
        <>
            <form className="searchForm" id="formulsearch" onSubmit={handleSubmitSearch}>
                <div className="userDelCont">
                <label className="userDel">Adhérent:<input className="userDelLab" type="search" name="nameSearch" list="searchList"/></label>
                {/* <label className="userDel">Prénom:<input type="text" name="first_nameSearch" /></label> */}
                <datalist id="searchList">
                    {userList.map((user)=>{
                        return(
                            <option key={user.id} value={user.name+" "+user.first_name} />
                        )
                    })}
                </datalist>
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