const GalleryDisplay = ({handleClic, handleClicCom, images, serverBack, role})=>{
    return(
        <>
            <div>
                {images.map((imageDisplay)=>{
                    return (
                        <div key={imageDisplay.id_pic}>
                            <div className="imgTitleGallery">
                                <p>{imageDisplay.title}</p>
                                <p>{imageDisplay.first_name+" "+imageDisplay.name}</p>
                                <p>{imageDisplay.name_gal}</p>
                            </div>
                            <img className="imageGalleryPic" src={serverBack+"/uploads/"+imageDisplay.picture} alt="images"></img>
                                <div className="imgsup">
                                    {/* <i className="fa-regular fa-trash-can fa-3x"></i> */}
                                    <button onClick={()=>handleClicCom(imageDisplay)}>commenter</button>
                                    {role=="admin" && 
                                        <button onClick={()=>handleClic(imageDisplay)}>supprimer</button>
                                    }
                                </div>           
                            
                        </div>
                        
                    );
                })}
            </div>
        </>
    )
}
export default GalleryDisplay;