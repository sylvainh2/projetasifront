import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Arrowmove from '../components/Arrowmove';
import imageCompression from 'browser-image-compression';
import PostPicture from "../components/PostPicture";
import GalleryDisplay from "../components/GalleryDisplay";
import GallerySearch from "../components/GallerySearch";

function Gallery () {
    
    const jwtData = window.localStorage.getItem('jwt');
    const [images, setImages] = useState([]);
    const [menuDeroul, setMenuDeroul] = useState([]);
    const [serverBack, setServerBack] = useState("http://localhost:8080");
    const [role, setRole] = useState(jwt_decode(jwtData).roles);
    const [nombrePhotosTotales,setNombrePhotosTotales] = useState(0);
    const [page,setPage] = useState(0);
    const [gallerySt,setGallery] = useState("");
    const [dateSt,setDate] = useState("");
    const [hasMore,setHasMore] = useState(true);
    useEffect(()=>{
        document.querySelector('.arrow_top').hidden=true;
    },[]);
    useEffect(()=>{
        setPage(0);
        setHasMore(true);
        window.scrollTo(0,550);
    },[gallerySt]);

    useEffect(()=>{
        if(page!=0){
            scrollPictureLoad(page);
        }
    },[page])
    
    useEffect(()=>{
        window.addEventListener('scroll',onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    },[images])
    function onScroll(){
        if(window.scrollY>500){
            document.querySelector('.arrow_top').hidden=false;
        }else{
            document.querySelector('.arrow_top').hidden=true;
        }
        let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
        if((windowRelativeBottom<(document.documentElement.clientHeight+700)) && (hasMore==true) && (images.length!=0)){
            setPage(page+1);
        }
    }
    function pushToTop() {
        window.scrollTo(0,0);
    }
    
    async function scrollPictureLoad(){

        const response = await fetch (`${serverBack}/api/photos/?gallery=${gallerySt}&date=${dateSt}&page=${page}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        })
        const imagesData = await response.json();
        setNombrePhotosTotales((Object.values(imagesData[1]))[0]);
        if(page==Math.floor((Object.values(imagesData[1]))[0]/10)){
            setHasMore(false);
        }
        if(page!=0){setImages([...images,...imagesData[0]]);}
        else{
            setImages(imagesData[0]);
        }
    }
    
    useEffect(() => {
        (async() => {
            const responseImage = await fetch(`${serverBack}/api/photos/?page=0`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })
            const imagesD = await responseImage.json();
            const ob=(Object.values(imagesD[1]))[0];
            if(Math.floor(ob/10)==0){
                setHasMore(false);
            }
            setImages(imagesD[0]);
            menuDeroulant();
            pushToTop();
        })(menuDeroul)
    }, [])
    const menuDeroulant = async()=>{
        const menuData = await fetch(serverBack+'/api/menu',{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        })
        const menuDrl = await menuData.json();
        setMenuDeroul(menuDrl[0]);
    }
    const handleSubmitSearch = async (event)=>{
        event.preventDefault();
                const gallery=(event.target.gallery.value);
                const date=(event.target.date.value);
                const pageSbm=0;
                // if(gallery==""){gallery=false};
                // if(date==""){date=false};

            
                // if(gallery && !date){
                // const responseGallery = await fetch(serverBack+"/api/photos/gallery/"+gallery, {
                //         method: "GET",
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": "Bearer "+jwtData
                //         }
                //     })

                //     const responseGalleryData = await responseGallery.json();
                //     if(responseGalleryData.message){
                //         alert("Pas de photo dans cette galerie");
                //     } else {
                //         console.log(responseGalleryData);
                //         setImages(responseGalleryData);
                //     }
                // };
                // if(!gallery && date){
                //     const responseDate = await fetch(serverBack+"/api/photos/"+date, {
                //         method: "GET",
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": "Bearer "+jwtData
                //         }
                //     })

                //     const responseDateData = await responseDate.json();
                //     console.log(responseDateData);
                //     if(responseDateData.message){
                //         alert("Pas de photo à cette date");
                //     } else {
                //         setImages(responseDateData);                        
                //     }
                // };
                // if(gallery != "" && date !=""){
                //     const responseGalleryDate = await fetch(serverBack+"/api/photos/gallery&date/"+gallery+"&"+date, {
                //         method: "GET",
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": "Bearer "+jwtData
                //         }
                //     })

                //     const responseGalleryDateData = await responseGalleryDate.json();
                //     console.log(responseGalleryDateData);
                //     if(responseGalleryDateData.message){
                //         alert("Pas de photo dans cette galerie et/ou à cette date");
                //     } else {
                //         setImages(responseGalleryDateData);
                //     }
                // };
                // if(!gallery && !date){
                //     const responseImage = await fetch(serverBack+'/api/photos',{
                //         method: "GET",
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": "Bearer "+jwtData
                //         }
                //     })
            
                //     const imagesD = await responseImage.json();
                //     setImages(imagesD[0]);

                // }
                // setImages([]);
                let imagesData=[];
                const response = await fetch (`${serverBack}/api/photos/?gallery=${gallery}&date=${date}&page=${pageSbm}`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwtData
                    }
                })
                if(response.length==0 || response.status>=400){
                    imagesData =[[],{"count(id_pic)": 0}];
                }else{
                    imagesData = await response.json();                  
                }
                if(Math.floor(((Object.values(imagesData[1]))[0])/10)==0){
                    setHasMore(false);
                }
                setNombrePhotosTotales((Object.values(imagesData[1]))[0]);
                setGallery(gallery);
                setDate(date);
                setPage(0);
                if((Object.values(imagesData[1]))[0]>10){
                    setHasMore(true);
                }else{
                    setHasMore(false);
                }
                setImages(imagesData[0]);
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
            const imageFile = event.target.imageSubmit.files[0];
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1080,
                useWebWorker: true
            }
            try {
                const compressedFile = await imageCompression(imageFile, options);
                console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            
                let body = new FormData();
                console.log(event.target.imageSubmit.files[0]);
                // on passe dans le body le nom du fichier modifié sous la form formData
                body.append('file', compressedFile,picture);
                console.log(body);
                const up_picture = await fetch(serverBack+"/api/upload",{
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
                    event.target.titreImgUp.value="";
                    event.target.uploadGallery.value="";
                    event.target.imageSubmit.value="";
                    return;
            } catch (error) {
                console.log(error);
              }
        }
        
        // on fait un appel fetch en GET pour voir si la galerie existe 
        const galleryId= await fetch(serverBack+"/api/galleryupload/"+name,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        });
        const responseGallery = await galleryId.json(); 
        if(!galleryId || galleryId.length==0 || galleryId.status==404){
            // si la galerie n'existe pas on la crée avec un appel fetch en PUT
            const createGallery = await fetch(serverBack+"/api/galleryupload/"+name,{
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
            if(!responseCreateGallery || responseCreateGallery.length===0){
                alert("Problème lors de la création de la gallerie");
            } else {
                //une fois la galerie créée on crée les données liées à l'immage dans la BDD
                // avec un appel fetch en méthode PUT.
                const gallery_id = responseCreateGallery.id_gall;
                const user_id = (jwt_decode(jwtData)).id;
                const add_picture = await fetch(`${serverBack}/api/photos/?page=${page}`,{
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
                const up = await upload(picture);
                setImages(responseAdd_picture[0]);
                window.scrollTo(0,550);
            }
        } else {
            // si la galerie existe, on enregistre directement les données liées à l'image dans la BDD
            // grace à un appel fetch en méthode PUT  
            const gallery_id = responseGallery.id_gall;
            const user_id = (jwt_decode(jwtData)).id;
            const add_picture = await fetch(`${serverBack}/api/photos/?page=${page}`,{
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
                const up= await upload(picture);
                setImages(responseAdd_picture[0]);
                window.scrollTo(0,550);
        }
       
    };
    const handleClic = async (picDel) =>{
        const imgTDId = picDel.id_pic;
        let supPhoto = window.confirm("êtes vous sûr de vouloir supprimer cette photo");
        if(supPhoto){
            const delPhoto = await fetch(`${serverBack}/api/photos/${imgTDId}?page=${page}`,{
                method: "DELETE",
                headers: {"Content-Type": "application/json",
                        "Authorization": "Bearer "+jwtData
            }});
            if(delPhoto){
                const delPhotoD = await delPhoto.json();
                setImages(delPhotoD[0]);
                window.scrollTo(0,550);
            }
        }
    }
    const handleClicCom = async (picDel)=>{
        console.log('commentaire');
        console.log(picDel);
    }
    return(
        <>
            <main className="findGallery">
                <Arrowmove pushToTop={pushToTop}/>
                <div className="searchPostCont">
                    <GallerySearch handleSubmitSearch={handleSubmitSearch} menuDeroul={menuDeroul}/>
                    <PostPicture handleSubmitPost={handleSubmitPost}/>
                </div>
                <GalleryDisplay handleClic={handleClic} handleClicCom={handleClicCom} images={images} serverBack={serverBack} role={role}/>
            </main>
        </>
    )

};

export default Gallery;
