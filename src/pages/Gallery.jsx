import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";


function Gallery () {

    const [images, setImages] = useState([]);
    const jwtData = window.localStorage.getItem('jwt');


    useEffect(() => {
        (async() => {
            const responseImage = await fetch('http://localhost:8080/api/photos',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })
    
            const images = await responseImage.json();
            setImages(images);
        })()
    }, [])

    const handleSubmitSearch = async (event)=>{
        event.preventDefault();

        let gallery = event.target.gallery.value;
        let date = event.target.date.value;
        if(gallery==""){gallery=false};
        if(date==""){date=false};

    
        if(gallery && !date){
           const responseGallery = await fetch("http://localhost:8080/api/photos/gallery/"+gallery, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })

            const responseGalleryData = await responseGallery.json();
            console.log(responseGalleryData);
        };
        if(!gallery && date){
            const responseDate = await fetch("http://localhost:8080/api/photos/date/"+date, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })

            const responseDateData = await responseDate.json();
            console.log(responseDateData);
        };
        if(gallery != "" && date !=""){
            const responseGalleryDate = await fetch("http://localhost:8080/api/photos/gallery&date/"+gallery+"&"+date, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })

            const responseGalleryDateData = await responseGalleryDate.json();
            console.log(responseGalleryDateData);
        };
    };

    const handleSubmitPost = async(event)=> {
        event.preventDefault();
        const title = event.target.titreImgUp.value;
        const name = event.target.uploadGallery.value;
        const picture = event.target.imageSubmit.value;
        
        console.log(name);

        const gallery_id= await fetch("http://localhost:8080/api/galleryupload/"+name,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        })
        const responseGallery = await gallery_id.json();
        console.log(responseGallery); 

        if(responseGallery.length==0){
            const create_gallery = await fetch("https//localhost:8080/api/galleryupload/"+name,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body: JSON.stringify({
                    name
                })
            })
            const responseCreateGallery = await create_gallery.json();
            if(!responseCreateGallery || responseCreateGallery.length===0){
                alert("Problème lors de la création de la gallerie");
            } else {
                const gallery_id = responseCreateGallery.id_gall;
                const user_id = (jwt_decode(jwtData)).id;
                const add_picture = await fetch("http://localhost:8080/api/photos",{
                    method: "PUT",
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwtData
                    },
                    body: JSON.stringify({
                        picture,
                        gallery_id,
                        user_id,
                        title
                    })
                });
                const responseAdd_picture = await add_picture.json();
                if(!responseAdd_picture){
                    alert("Problème à l'upload de la photo");
                } 
                // else {
                //     const up_picture = await fetch("http://localhost:8080/api/upload",{
                //         method:"POST",
                //     })
                // }
                //on appelle ici pour allez dans le back charger l'image
            }
        }
       
    };

    return(
        <>
            <main className="findGallery">
                <form onSubmit={handleSubmitSearch} id="search">
                    <label>Gallerie</label>
                    <input className="findInput" type="text" name="gallery" />
                    <label>Date</label>
                    <input className="findInput" type="date" name="date" />
                    <button type="submit">Rechercher</button>
                </form>
                <a className="uplDirect" href="#upl"><i className="fa-sharp fa-solid fa-arrow-down"></i> Poster Une Image <i className="fa-sharp fa-solid fa-arrow-down"></i></a>
                <>
                {images.map((imageDisplay)=>{
                    return (
                        <div className="imageGallery">
                            <img key={imageDisplay.id} src={"/upload/"+imageDisplay.picture} alt="images"></img>
                            <p>{imageDisplay.title}</p>
                            <p>{imageDisplay.name}</p>
                        </div>
                        
                    );
                })}
                </>
                <form id="upl" className="imageGallery" onSubmit={handleSubmitPost}>
                    <label className="upImage">Poster Une Image</label>
                    <label className="upImage">Titre de l'image</label>
                    <input className="uploadTitre" type="text" name="titreImgUp" />
                    <label className="upImage">Gallerie</label>
                    <input className="uploadTitre" type="text" name="uploadGallery" />
                    <label className="upImage">Fichier</label>
                    <input className="uploadInput upImage" type="file" name="imageSubmit" />
                    <button className="upImage upImageBtn" type="submit">Poster</button>
                </form>
            </main>
        </>
    )

};

export default Gallery;
