const PostPicture = ({handleSubmitPost})=>{
    return(
        <>
            <form id="upl" className="imageGallery" onSubmit={handleSubmitPost}>
                <label className="upImage">Poster Une Image</label>
                <label className="upImage">Titre de l'image</label>
                <input className="uploadTitre" type="text" name="titreImgUp" />
                <label className="upImage">Galerie</label>
                <input className="uploadTitre" type="text" name="uploadGallery" />
                <label className="upImage">Fichier</label>
                <input className="uploadInput upImage" type="file" name="imageSubmit" />
                <button className="upImage upImageBtn" type="submit">Poster</button>
            </form>
        </>
    )
}
export default PostPicture;