import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router';
import {useState, useEffect} from "react";
import imageCompression from 'browser-image-compression';

function User() {

    const [role,setRole] = useState("");
    const [demand,setdemand] = useState("");
    const [responseData,setResponseData]=useState([]);
    const [serverBack,setServerBack] = useState("http://localhost:8080");
    const [trombiD,setTrombiD] = useState([]);
    const [trombiImg,setTrombiImg] = useState([]);
    const [profilPicture,setProfilPicture] = useState("");
    const [profilFile,setProfilFile] = useState("");
    const [certPicture,setCertPicture] = useState("");
    const [certFile,setCertFile] = useState("");
    const [check,setCheck] = useState(false);
    const [checkC,setCheckC] = useState(false);
    const [gest,setGest] = useState([]);
    const [imageCert,setImageCert] = useState(false);
    const navigate = useNavigate();
    const jwtData = window.localStorage.getItem("jwt");

    const cbox = {
        "0":"",
        "1":"checked"
    };
    const chekbox = {
        "off": "0",
        "on": "1",
        "checked":"1"
    }

    useEffect(()=>{
            if (jwtData) {
                const roleD=(jwt_decode(jwtData)).roles;
                const validityD=(jwt_decode(jwtData)).validity;
                // console.log("role",roleD);
                setRole(roleD);
                // console.log(role!=="admin",role!=="user");
                // console.log(role !== "admin" && role !== "user");
                if(roleD !== "admin" && roleD !== "user"){
                  window.alert("Pour accéder à cet espace vous devez être connecté");
                  retourAccueil();
                } 
            } else {
                window.alert("Pour accéder à cet espace vous devez être connecté");
                retourAccueil();
            }
        },[jwtData])
    function retourAccueil() {
        navigate('/');
    }
    const handleSubmitUser = async(event)=>{
        event.preventDefault();
        setTrombiImg([]);
        setProfilPicture("");
        setCheck(false);
        setCheckC(false);
        const demand = event.target.userDemand.value;
        setdemand(demand);
        console.log("demand",demand);

        if(demand == "Modifier vos données"){
            
            let id = (jwt_decode(jwtData)).id;
            console.log(jwtData);
            const response = await fetch('http://localhost:8080/api/users/'+id,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            });

            let responseData = await response.json();
            const dateUTC = new Date(responseData.birthdate);
            const offsetCET = -(new Date().getTimezoneOffset())/60;
            console.log(offsetCET);
            const dateCET = new Date(dateUTC.getTime() + offsetCET * 60 * 60 * 1000);
            const dateTz= (JSON.stringify(dateCET));
            responseData.birthdate = (dateTz).slice(1,11);
            responseData.share_infos = cbox[responseData.share_infos]; 
            setResponseData(responseData);
        }
        if(demand == "Trombinoscope"){
            setTrombiImg([]);
            const responseT = await fetch('http://localhost:8080/api/users/',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            });
            const responseDataS = await responseT.json();
            let trombArray = responseDataS;
            let index=responseDataS.findIndex(data=>(data.id==13));
            let trombData = trombArray.splice(index,1);
            setTrombiD(trombArray);
        }
        if(demand == "Gestion des profils"){
            setTrombiImg([]);
            const responseG = await fetch('http://localhost:8080/api/users/',{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            });
            const responseDataS = await responseG.json();
            let gestArray = await responseDataS;
            let index=responseDataS.findIndex(data=>(data.id==13));
            let trombData = gestArray.splice(index,1);
            console.log("gestion",gestArray);
            setGest(gestArray);
        }
        if(demand == "Ajouter certificat médical"){
            setCertPicture("");
            let id = (jwt_decode(jwtData)).id;
            console.log("le jwt",jwtData);
            const responseC = await fetch('http://localhost:8080/api/users/'+id,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            });

            let responseData = await responseC.json();
            console.log('oldcertif',responseData.certif_med);
            setCertPicture(responseData.certif_med);
        }
        
    }
    const handleSubmitModify = async(event)=>{
        event.preventDefault();

        setTrombiImg([]);
        const modify = event.target;
        const name = modify.nameMod.value || responseData.name;
        const first_name = modify.first_nameMod.value || responseData.first_name;
        const birthdate = modify.birthdateMod.value || responseData.birthdate;
        const address = modify.addressMod.value || responseData.address;
        const postcode = modify.postcodeMod.value || responseData.postcode;
        const city = modify.cityMod.value || responseData.city;
        const tel = modify.telMod.value || responseData.tel;
        const share_infos = chekbox[modify.share_infosMod.value];
       
        const responseMod = await fetch('http://localhost:8080/api/users/user/'+responseData.id,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            },
            body: JSON.stringify({
                name,
                first_name,
                birthdate,
                address,
                postcode,
                city,
                tel,
                share_infos
            })
            }
        );
        const responseModData = await responseMod.json();
        if(responseModData){
            document.getElementById("formulaire").reset();
            alert("Profil Modifié");
            setdemand("");
            setResponseData([]);
        }
    }
    const handleSubmitSearch = async(event)=>{
        event.preventDefault();
        const e = event.target;
        const name = e.nameSearch.value;
        const first_name = e.first_nameSearch.value;

        if(name && first_name){
            const responseSearch = await fetch('http://localhost:8080/api/users/user/'+name+"&"+first_name,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
            }});
            if (responseSearch){
                const responseSearchData = await responseSearch.json();
                console.log(responseSearchData);
                setTrombiImg(responseSearchData);
            }
        }
    }
    const picPreview = async(event)=>{
        event.preventDefault();
        console.log(event.target.files[0].name);
        const objectUrl = URL.createObjectURL(event.target.files[0]);
        setProfilFile(event.target.files[0].name);
        setCheck(false);
        setProfilPicture(objectUrl);
    }
    const certPreview = async(event)=>{
        event.preventDefault();
        console.log("funcprev",event.target.files[0].name);
        const objectUrl = URL.createObjectURL(event.target.files[0]);
        setCertFile(event.target.files[0].name);
        setCheckC(false);
        setCertPicture(objectUrl);
    }
    const handleSubmitProfilPic = async(event)=>{
        event.preventDefault();
        const pictureTemp = event.target.profilePic.files[0].name;
        if(pictureTemp){
            const id = (jwt_decode(jwtData)).id;
            const response = await fetch('http://localhost:8080/api/users/'+id,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            });

            let responseData = await response.json();
            const oldName = responseData.profil_picture;

            const MIME_TYPES = {
                'image/jpg': 'jpg',
                'image/jpeg': 'jpg',
                'image/png': 'png'
            }
            let pictureTps = pictureTemp.split(' ').join('_');
            const extension = MIME_TYPES[event.target.profilePic.files[0].type];
            // on enlève l'extension qui sera traitée par la suite
            const pictureTp = pictureTps.split('.');
            pictureTps = pictureTp[0];
            // on rajoute un time devant le nom pour le rendre quasi unique et l'extension
            const picture = Date.now()+pictureTps+"."+extension;
            console.log(event.target.profilePic.files[0]);
            const imageFile = event.target.profilePic.files[0];
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1080,
                useWebWorker: true
            }
            try {
                const compressedFile = await imageCompression(imageFile, options);
                console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
            
                let body = new FormData();
                console.log(event.target.profilePic.files[0]);
                // on passe dans le body le nom du fichier modifié sous la form formData
                body.append('file', compressedFile,picture);
                console.log(body);
            // ici on mettra la partie se chargeant du nom et de l'extension du fichier
            // ainsi que la partie s'occupant de compresser l'image (browser-image-compression sur npm)
            console.log("jwt",jwtData);
            console.log("body",body);
            const responseProPic = await fetch('http://localhost:8080/api/profile/',{
                method: "POST",
                headers: {
                    "Authorization": "Bearer "+jwtData
                },
                body: body
            });
            const responseProPicDel = await fetch(serverBack+'/api/profile/',{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body:JSON.stringify({
                    oldName
                })
            });
            setCheck(true);
            } catch (error) {
                console.log(error);
            }
        }
    }
    console.log(trombiImg); 
    const handleSubmitCertifPic = async(event)=>{
        event.preventDefault();
        const certifTemp = event.target.certifPic.files[0].name;
        console.log('certifTemp',certifTemp);
        async function Change (body, oldNameC){
            console.log(body);
            // ici on mettra la partie se chargeant du nom et de l'extension du fichier
            // ainsi que la partie s'occupant de compresser l'image (browser-image-compression sur npm)
            console.log("jwt",jwtData);
            console.log("body",body);
            const responseCertPic = await fetch(serverBack+'/api/certif/',{
                method: "POST",
                headers: {
                    "Authorization": "Bearer "+jwtData
                },
                body: body
            });
            const responseCertPicDel = await fetch(serverBack+'/api/certif/',{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body:JSON.stringify({
                    oldNameC
                })
            });
            return
        }
        if(certifTemp){
            const id = (jwt_decode(jwtData)).id;
            const response = await fetch('http://localhost:8080/api/users/'+id,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            });

            let responseData = await response.json();
            const oldNameC = responseData.certif_med;
            const MIME_TYPES = {
                'image/jpg': 'jpg',
                'image/jpeg': 'jpg',
                'image/png': 'png',
                'application/pdf': 'pdf'
            }
            let certifTps = certifTemp.split(' ').join('_');
            const extension = MIME_TYPES[event.target.certifPic.files[0].type];
            // on enlève l'extension qui sera traitée par la suite
            const certifTp = certifTps.split('.');
            certifTps = certifTp[0];
            // on rajoute un time devant le nom pour le rendre quasi unique et l'extension
            const picture = Date.now()+certifTps+"."+extension;
            console.log("nom de fichier",event.target.certifPic.files[0]);
            const imageFile = event.target.certifPic.files[0];
            const options = {
                maxSizeMB: 2,
                maxWidthOrHeight: 1080,
                useWebWorker: true
            }
            try {
                if(extension=='jpg' || extension=='png'){
                    const compressedFile = await imageCompression(imageFile, options);
                    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                    let body = new FormData();
                    console.log(event.target.certifPic.files[0]);
                    // on passe dans le body le nom du fichier modifié sous la form formData
                    body.append('file', compressedFile,picture);
                    Change(body,oldNameC);
                    setImageCert(true);
                } else {
                    let body = new FormData();
                    console.log(event.target.certifPic.files[0]);
                    // on passe dans le body le nom du fichier modifié sous la form formData
                    body.append('file', imageFile,picture);
                    Change(body,oldNameC);
                    setImageCert(false);
                }
            console.log('checkc');    
            setCheckC(true);
            } catch (error) {
                console.log(error);
            }
        }
    }
    const gestProfile = async(event)=>{
        event.preventDefault();
        setTrombiImg([]);
        const validElement ={
            "valide":"0",
            "invalide":"1",
            "user":"admin",
            "admin":"user"
        };
        let gestionProf = event.target.name;
        let gestionProfName = event.target.parentNode.parentNode.outerText;
        if(!gestionProf){
            gestionProf = event.target.parentElement.name;
            gestionProfName = event.target.parentNode.parentNode.parentNode.outerText;
        }
        const GPName= gestionProfName.split('\n\n');
        const gesPName = GPName[0].toLowerCase();
        const gesPFName = GPName[1].toLowerCase();
        console.log(gest);
        console.log(gesPName,gesPFName,gestionProf);
        let gestArray=gest;
        const index=gest.findIndex(data=>(data.name==gesPName && data.first_name==gesPFName));
        const userTDid = gest[index].id;
        console.log("id",userTDid);
        if(gestionProf!="trash" && gestionProf.length!=0){
            if(jwt_decode(jwtData).id != userTDid){
                if(gestionProf=="valide" || gestionProf=="invalide"){
                    gestArray[index].validity=validElement[gestionProf];
                    if(gestionProf=="valide"){
                        gestArray[index].roles="user";
                    }
                }
                if(gestionProf=="user" || gestionProf=="admin"){
                    gestArray[index].roles=validElement[gestionProf];
                    if(gestionProf=="user"){
                        gestArray[index].validity="1";
                    }
                }
                console.log(index,gestArray[index].validity,gestArray[index].roles);
                console.log(userTDid,gesPName,gesPFName,)
                const responseVal = await fetch('http://localhost:8080/api/users/user',{
                    method: "PATCH",
                    headers: {
                        "Content-Type":"application/json",
                        "Authorization": "Bearer "+jwtData
                    },
                    body:JSON.stringify({
                        id:userTDid,
                        name:gesPName,
                        first_name:gesPFName,
                        validity:gestArray[index].validity,
                        roles:gestArray[index].roles
                    })
                })
                setGest(gestArray);
            } else {
                alert('Vous ne pouvez pas modifier les status de votre propre compte, passez par un administrateur');
            }
        }
        if(gestionProf=="trash"){
            if(jwt_decode(jwtData).id != userTDid){
                let suppress = window.confirm("êtes vous sûr de vouloir supprimer "+gesPName+" "+gesPFName);
                if(suppress){
                    const responsePicid = await fetch('http://localhost:8080/api/picture/'+userTDid,{
                        method: "PATCH",
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization": "Bearer "+jwtData
                        }
                    });
                    
                    const responseDel = await fetch('http://localhost:8080/api/users/user/'+userTDid,{
                        method: "DELETE",
                        headers:  {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer "+jwtData
                        }
                    });
                }
                let index=gest.findIndex(data=>(data.id==userTDid));
                console.log("avant",gestArray);
                let trombData = gestArray.splice(index,1);
                console.log('delete',gestArray);
                setGest(gestArray);
            } else {
                alert('Vous ne pouvez pas supprimer votre propre compte, passez par un administrateur');
            }
        }
    }

    return(
            <main className="userMain">
                <div className="userContent">
                    <form onSubmit={handleSubmitUser}>
                        <label className="userform" htmlFor="userdemand">Action sur profil</label>
                        <select className="userform" type="text" name="userDemand" id="userdemand">
                            <option className="opForm" value="Modifier vos données">Modifier vos données</option>
                            <option className="opForm" value="Modifier photo de profil">Modifier photo de profil</option>
                            <option className="opForm" value="Ajouter certificat médical">Ajouter certificat médical</option>
                            <option className="opForm" value="Rechercher un adhérent">Rechercher un adhérent</option>
                            <option className="opForm" value="Trombinoscope">Trombinoscope</option>
                            {role=="admin" &&
                                <>
                                    <option className="opForm" value="______________________" disabled></option>
                                    <option className="opForm" value="Gestion des profils">Gestion des profils</option>
                                </>
                            }
                        </select>
                        <button className="userform" type="submit">Ok</button>
                    </form>
                    {demand=="Modifier vos données" &&
                    <form className="modifyForm" id="formulaire" onSubmit={handleSubmitModify}>
                        <input className="userInpForm" type="text" name="nameMod" defaultValue={responseData.name} />
                        <input className="userInpForm" type="text" name="first_nameMod" defaultValue={responseData.first_name} />
                        <input className="userInpForm" type="date" name="birthdateMod" defaultValue={responseData.birthdate} />
                        <textarea className="userInpForm textA" cols="50" rows="3" type="text" name="addressMod" defaultValue={responseData.address} />
                        <input className="userInpForm" type="text" name="postcodeMod" defaultValue={responseData.postcode} />
                        <input className="userInpForm" type="text" name="cityMod" defaultValue={responseData.city} />
                        <input className="userInpForm" type="text" name="telMod" defaultValue={responseData.tel} />
                        <label className="userInpForm userShareInf" >Partage des informations personnelles</label>
                        <input className="userInpForm" type="checkbox" name="share_infosMod" defaultChecked={responseData.share_infos} />
                        <label className="userInpForm">Password</label>
                        <input type="password" name="passwordMod" defaultValue="" />
                        <button className="userInpForm uIFBtn" type="submit">ENVOYER</button>
                    </form>
                    }
                    {demand=="Trombinoscope" &&
                    <div className="trombi">
                    {trombiD.map((oneUser)=>{
                        return(
                            <div className="trombiImg" key={oneUser.id}>
                                <img className="trombiPic" src={serverBack+"/profiles/"+oneUser.profil_picture}/>
                                <p>{oneUser.name}</p>
                                <p>{oneUser.first_name}</p>
                            </div>
                        )
                    })}
                    </div>}
                    {demand=="Rechercher un adhérent" &&
                    <>
                        <form className="searchForm" id="formulsearch" onSubmit={handleSubmitSearch}>
                            <div className="userDelCont">
                            <label className="userDel">Nom:<input className="userDelLab" type="text" name="nameSearch" /></label>
                            <label className="userDel">Prénom:<input type="text" name="first_nameSearch" /></label>
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
                    }
                    {demand=="Modifier photo de profil" &&
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
                    }
                    {demand=="Ajouter certificat médical" &&
                    <>
                        <form className="profilForm" onSubmit={handleSubmitCertifPic}>
                            <label>Certificat médical<input type="file" name="certifPic" accept="application/pdf, image/jpg, image/jpeg" onChange={certPreview}/></label>
                            <button className="userDel" type="submit">Choisir</button>
                        </form>
                        <div className="prevCont">
                         {imageCert?
                        <img className="previewC" src={certPicture} />:
                        <iframe className="previewC" src={certPicture} />
                         }   
                        {checkC==true &&
                            <i className="fa-solid fa-check fa-3x profilCheck"></i>} 
                            </div>
                    </>    
                    }
                    {(demand=="Gestion des profils" && gest.length!=0) &&
                    <div className="profileCont">
                        {gest.map((profile)=>{
                            return(
                                <div className="profileGest" key={profile.id} onClick={gestProfile}>
                                    <div className="profCont">
                                        <p>{profile.name}</p>
                                    </div>
                                    <div className="profCont">
                                        <p>{profile.first_name}</p>
                                    </div>
                                    <div className="profContVal">
                                        {profile.validity==0?
                                        <button className="profVal" type="button" name="invalide">invalidé</button>:
                                        <button className="profInv" type="button" name="valide">validé</button>
                                        }
                                    </div>
                                    <div className="profContVal">
                                        {profile.roles=="admin"?
                                        <button className="profAdm" type="button" name="admin">{profile.roles}</button>:
                                        <button className="profUse" type="button" name="user">{profile.roles}</button>
                                        }
                                    </div>
                                    <div className="profCont">
                                        <button type="button" name="trash"><i className="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            </main>
    )
}

export default User;