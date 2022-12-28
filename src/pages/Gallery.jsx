import { useEffect, useState, useRef } from "react";
import jwt_decode from "jwt-decode";
import { upload } from "@testing-library/user-event/dist/upload";


function Gallery () {

    const [images, setImages] = useState([]);

    // si oon veut utiliser directement les données pour afficher l'image après l'upload
    // on utilisera les 3 lignes suivantes: 
    // const [upLoadGallery,setUpLoadGallery] = useState("");
    const [isUploaded,setIsUploaded] = useState(false);
    const [serverData,setServerData] = useState({});

    // const formRef = useRef(null);

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
        const pictureTemp = event.target.imageSubmit.value;        
        
        if(name=="" || pictureTemp==""){
            alert('veuillez remplir le champs gallerie et charger un fichier SVP');
            return;
        }
        
        const pictureTrunc = pictureTemp.slice(12,pictureTemp.length);
        // const picture = Date.now()+pictureTrunc;
        const picture = pictureTrunc;
        console.log(title,name,picture); 

        const upload = async()=> {
            const up_picture = await fetch("http://localhost:8081/upload",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+jwtData
            },
            body: JSON.stringify({
                picture
            })
            
        });
        const responseUpPicture = await up_picture.json();
        if(!responseUpPicture){
            alert("Problème à l'enregistrement de l'image");
            return;
        }
            alert("Photo enregistrée");
            event.target.titreImgUp.value="";
            event.target.uploadGallery.value="";
            event.target.imageSubmit.value="";
            return;
        }
        

        const galleryId= await fetch("http://localhost:8080/api/galleryupload/"+name,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        });
        console.log("galleryId",galleryId);
        const responseGallery = await galleryId.json(); 

        if(!galleryId || galleryId.length==0 || galleryId.status==404){
    
            const createGallery = await fetch("http://localhost:8080/api/galleryupload/"+name,{
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body: JSON.stringify({
                    name
                })
            });
            const responseCreateGallery = await createGallery.json();
            console.log(responseCreateGallery,createGallery);
            if(!responseCreateGallery || responseCreateGallery.length===0){
                alert("Problème lors de la création de la gallerie");
            } else {
                const gallery_id = responseCreateGallery.id_gall;
                const user_id = (jwt_decode(jwtData)).id;
                console.log(picture,gallery_id,user_id,title);
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
                upload();
            }
        } else {
            const gallery_id = responseGallery.id_gall;
            const user_id = (jwt_decode(jwtData)).id;
            console.log(picture,gallery_id,user_id,title);
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
                upload();
        }
                    // 

                    //upload photo
                    // if(!formRef){
                    //     return;
                    // }
                    // console.log(formRef,formRef.current.action);
                    // const responseUpload = fetch(formRef.current.action,{
                    //     method:"POST",
                    //     body: new FormData(formRef.current)
                    // })
                    // console.log(responseUpload);
                    // const json = await responseUpload.json();
                    // setServerData (json);
                    // setIsUploaded (true);
        
       
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
                <div className="uplDirectContent">
                <a className="uplDirect" href="#upl"><i className="fa-sharp fa-solid fa-arrow-down"></i> Poster Une Image <i className="fa-sharp fa-solid fa-arrow-down"></i></a>
                </div>
                <>
                {images.map((imageDisplay)=>{
                    return (
                        <div key={imageDisplay.id} className="imageGallery">
                            <img src={"/uploads/"+imageDisplay.picture} alt="images"></img>
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
