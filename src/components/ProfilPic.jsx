const ProfilPic = ({check, handleSubmitProfilPic, picPreview, profilPicture})=>{
    return(
        <>
            <form className="profilForm" onSubmit={handleSubmitProfilPic}>
                <label>Image de profil<input type="file" name="profilePic" accept="image/png, image/jpg, image/jpeg" onChange={picPreview}/></label>
                <button className="userDel" type="submit">Choisir</button>
            </form>
            <div className="prevCont">
                <img className="preview" src={profilPicture} />
                {check==true &&
                <i className="fa-solid fa-check fa-3x profilCheck"></i>} 
            </div>
        </>
    )
}
export default ProfilPic;