import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

function Gallery () {

    const [images, setImages] = useState([]);
    const [menuDeroul, setMenuDeroul] = useState([]);
    const [serverBack, setServerBack] = useState("http://localhost:8080");
    const [offTab, setOffTab] = useState([]);
    // si on veut utiliser directement les données pour afficher l'image après l'upload
    // on utilisera la ligne suivante: 
    const [uploaded,setUploaded] = useState(false);
    
    
    const jwtData = window.localStorage.getItem('jwt');
    const [role, setRole] = useState(jwt_decode(jwtData).roles);

    
    
    useEffect(() => {
        (async() => {
            const responseImage = await fetch('http://localhost:8080/api/photos',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })
            const imagesD = await responseImage.json();
            let longPic=(Object.values(imagesD[1]))[0];
            setImages(imagesD[0]);
            md();
        })(menuDeroul)
    }, [])
    const md = async()=>{
        const menuData = await fetch('http://localhost:8080/api/menu',{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        })
        const menuDrl = await menuData.json();
        console.log("mdrl",menuDrl[0]);
        setMenuDeroul(menuDrl[0]);
    }
   
    // console.log(menuDeroul);
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
                    if(responseGalleryData.message){
                        alert("Pas de photo dans cette galerie");
                    } else {
                        console.log(responseGalleryData);
                        setImages(responseGalleryData);
                    }
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
                    if(responseDateData.message){
                        alert("Pas de photo à cette date");
                    } else {
                        setImages(responseDateData);                        
                    }
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
                    if(responseGalleryDateData.message){
                        alert("Pas de photo dans cette galerie et/ou à cette date");
                    } else {
                        setImages(responseGalleryDateData);
                    }
                };
                if(!gallery && !date){
                    const responseImage = await fetch('http://localhost:8080/api/photos',{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer "+jwtData
                        }
                    })
            
                    const imagesD = await responseImage.json();
                    setImages(imagesD);
                }
    };

    const handleSubmitPost = async(event)=> {
        event.preventDefault();
        const title = event.target.titreImgUp.value;
        const name = event.target.uploadGallery.value;
        const pictureTemp = event.target.imageSubmit.files[0].name;
        const MIME_TYPES = {
            'image/jpg': 'jpg',
            'image/jpeg': 'jpg',
            'image/png': 'png'
        }        
        
        if(name=="" || pictureTemp==""){
            alert('veuillez remplir le champs gallerie et charger un fichier SVP');
            return;
        }
        let pictureTps = pictureTemp.split(' ').join('_');
        console.log("ici",event.target.imageSubmit.files[0].type);
        const extension = MIME_TYPES[event.target.imageSubmit.files[0].type];
       
        // on enlève l'extension qui sera traitée par la suite
        const pictureTp = pictureTps.split('.');
        pictureTps = pictureTp[0];
        // on rajoute un time devant le nom pour le rendre quasi unique et l'extension
        const picture = Date.now()+pictureTps+"."+extension;
    
        console.log(title,name,picture); 

        const upload = async()=> {
            let body = new FormData();
            console.log(event.target.imageSubmit.files[0]);
            // on passe dans le body le nom du fichier modifié sous la form formData
            body.append('file', event.target.imageSubmit.files[0],picture);
            console.log(body);
            const up_picture = await fetch("http://localhost:8080/api/upload",{
            method:"POST",
            headers:{
                "Authorization":"Bearer "+jwtData
            },
            body: body
            });

            const responseUpPicture = await up_picture.json();
            if(!responseUpPicture){
                alert("Problème à l'enregistrement de l'image");
                return;
            }
                // alert("Photo enregistrée");
                event.target.titreImgUp.value="";
                event.target.uploadGallery.value="";
                event.target.imageSubmit.value="";
                return;
    
        }
        
        // on fait un appel fetch en GET pour voir si la galerie existe 
        const galleryId= await fetch("http://localhost:8080/api/galleryupload/"+name,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        });
        console.log("galleryId",galleryId);
        const responseGallery = await galleryId.json(); 
        console.log(galleryId.status,responseGallery);
        if(!galleryId || galleryId.length==0 || galleryId.status==404){
            // si la galerie n'existe pas on la crée avec un appel fetch en PUT
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
                //une fois la galerie créée on crée les données liées à l'immage dans la BDD
                // avec un appel fetch en méthode PUT.
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
                // et on upload l'image
                upload(picture);
                setImages(responseAdd_picture[0]);
            }
        } else {
            // si la galerie existe, on enregistre directement les données liées à l'image dans la BDD
            // grace à un appel fetch en méthode PUT  
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
                // et on upload
                upload(picture);
                setImages(responseAdd_picture[0]);
        }
       
    };
    const handleClic = async (event) =>{
        function imgTD(data) {
            return data.picture==imgToDelete;
        }
        console.log(event);
        const imgToDelete = (event.target.parentNode.previousElementSibling.currentSrc).replace("http://localhost:8080/uploads/","");
        console.log(images);
        const imgTDId = images[images.findIndex(imgTD)].id_pic;
        const subBtn = event.target.innerHTML;
        if(subBtn=="supprimer"){
            let supPhoto = window.confirm("êtes vous sûr de vouloir supprimer cette photo");
            if(supPhoto){
                const delPhoto = await fetch('http://localhost:8080/api/photos/'+imgTDId,{
                    method: "DELETE",
                    headers: {"Content-Type": "application/json",
                            "Authorization": "Bearer "+jwtData
            }});
            if(delPhoto){
                const delPhotoD = await delPhoto.json();
                console.log("resultat",delPhotoD);
                // alert("photo supprimée");
                setImages(delPhotoD[0]);
            }
        }};
        console.log(images,imgToDelete);
        console.log(imgTDId);
    }
    
    return(
        <>
            <main className="findGallery">
                {/* <Arrowmove offtab={offtab} /> */}
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
                <div className="uplDirectContent">
                    <a className="uplDirect" href="#upl"><i className="fa-sharp fa-solid fa-arrow-down"></i> Poster Une Image <i className="fa-sharp fa-solid fa-arrow-down"></i></a>
                </div>
                <div onClick={handleClic}>
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
                                    <button>commenter</button>
                                    {role=="admin" && 
                                        <button>supprimer</button>
                                    }
                                </div>           
                            
                        </div>
                        
                    );
                })}
                </div>
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
            </main>
        </>
    )

};

export default Gallery;
