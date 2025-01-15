const CertifMed = ({imageCert, checkC, handleSubmitCertifPic, certPreview, certPicture, demand})=>{
    return(
        <>
        {console.log("demand",demand)}
            {demand==="Ajouter certificat médical" &&
            <form className="profilForm" onSubmit={handleSubmitCertifPic}>
                <label>Certificat médical<input type="file" name="certifPic" accept="application/pdf, image/jpg, image/jpeg" onChange={certPreview}/></label>
                <button className="userDel" type="submit">Choisir</button>
            </form>
            }
            {demand==="Ajouter dossier inscription" &&
            <form className="profilForm" onSubmit={handleSubmitCertifPic}>
                <label>Inscription<input type="file" name="certifPic" accept="application/pdf, image/jpg, image/jpeg" onChange={certPreview}/></label>
                <button className="userDel" type="submit">Choisir</button>
            </form>
            }
            <div className="prevCont">
                {imageCert?
                    <img className="previewC" src={certPicture} />:
                    <iframe className="previewC" src={certPicture} />
                }   
                {checkC==true &&
                    <i className="fa-solid fa-check fa-3x profilCheck"></i>} 
            </div>
        </>
    )
}
export default CertifMed;