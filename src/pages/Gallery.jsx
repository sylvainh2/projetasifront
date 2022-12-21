import { useEffect, useState } from "react";
// import jwt_decode from "jwt-decode";

// const fileUpload = require('express-fileupload');

function Gallery () {

    const [images, setImages] = useState([]);
    const jwtData = window.localStorage.getItem('jwt');


    useEffect(() => {
        (async() => {
            const responseImage = await fetch('http://localhost:8080/api/photos',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeWx2YWluY3JvdXppZXJAZnJlZS5mciIsInJvbGVzIjoiYWRtaW4iLCJpYXQiOjE2NzE2NTgzMjAsImV4cCI6NDc5NTg2MDcyMH0.ec31wTwwn_XdtzlzFhXHTc8Og4lOZd7H03G8VGBhpxs"
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
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeWx2YWluY3JvdXppZXJAZnJlZS5mciIsInJvbGVzIjoiYWRtaW4iLCJpYXQiOjE2NzE2NTgzMjAsImV4cCI6NDc5NTg2MDcyMH0.ec31wTwwn_XdtzlzFhXHTc8Og4lOZd7H03G8VGBhpxs"
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
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeWx2YWluY3JvdXppZXJAZnJlZS5mciIsInJvbGVzIjoiYWRtaW4iLCJpYXQiOjE2NzE2NTgzMjAsImV4cCI6NDc5NTg2MDcyMH0.ec31wTwwn_XdtzlzFhXHTc8Og4lOZd7H03G8VGBhpxs"
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
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeWx2YWluY3JvdXppZXJAZnJlZS5mciIsInJvbGVzIjoiYWRtaW4iLCJpYXQiOjE2NzE2NTgzMjAsImV4cCI6NDc5NTg2MDcyMH0.ec31wTwwn_XdtzlzFhXHTc8Og4lOZd7H03G8VGBhpxs"
                }
            })

            const responseGalleryDateData = await responseGalleryDate.json();
            console.log(responseGalleryDateData);
        };
    };

    const handleSubmitPost = async(event)=> {
        event.preventDefault();
        // const title = event.target.titreImgUp.value;
        // const gallery = event.target.uploadGallery.value;
        // const picture = event.target.imageSubmit.value;
        
        // const gallery_id= await fetch("http://localhost:8080/api/photos/galleryupload/"+gallery,{
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": "Bearer "+jwtData
        //     },
        //     body: JSON.stringify({
        //         gallery
        //     })
        // })

// console.log(title,gallery,picture); 

        // if(!gallery_id){
        //     const create_gallery = await fetch("https//localhost:8080/api/photos/galleryupload/"+gallery,{
        //         method: "PUT",
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": "Bearer "+jwtData
        //         },
        //         body: JSON.stringify({
        //             gallery
        //         })
        //     })
        //     if(!create_gallery){
        //         alert("Problème lors de la création de la gallerie");
        //     } else {
        //         const gallery_id = create_gallery.id;
        //         const user_id = (jwt_decode(jwtData)).id;
        //         const push_picture = await fetch("http://localhost:8080/api/photos/photoupload",{
        //             method: "PUT",
        //             headers:{
        //                 "Content-Type": "application/json",
        //                 "Authorization": "Bearer "+jwtData
        //             },
        //             body: JSON.stringify({
        //                 picture,
        //                 gallery_id,
        //                 user_id,
        //                 title
        //             })
        //         })
        //     }
        // }
        // et on contine les autres conditions

        // app.use(fileUpload());

        // app.post('/upload', function(req, res) {
        // let sampleFile;
        // let uploadPath;

        // if (!req.files || Object.keys(req.files).length === 0) {
        //     return res.status(400).send('No files were uploaded.');
        // }

        // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        // sampleFile = req.files.sampleFile;
        // uploadPath = __dirname + '/somewhere/on/your/server/' + sampleFile.name;

        // // Use the mv() method to place the file somewhere on your server
        // sampleFile.mv(uploadPath, function(err) {
        //     if (err)
        //     return res.status(500).send(err);

        //     res.send('File uploaded!');
        // });
        // });
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
