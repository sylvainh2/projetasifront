import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router';
import {useState, useEffect} from "react";
import imageCompression from 'browser-image-compression';
import CertifMed from '../components/CertifMed';
import ProfilPic from '../components/ProfilPic';
import GestProfil from "../components/GestProfil";
import AdhSearch from "../components/AdhSearch";
import Trombi from "../components/Trombi";
import DataMod from "../components/DataMod";
import ProfilAction from "../components/ProfilAction";

function User() {
    // we declare all the variables use in the react part
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
    // we look if we have the rights to be here and do the functions
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
    // we go to choice which function we do on the user profile
    const handleSubmitUser = async(event)=>{
        event.preventDefault();
        // we declare array variable of profile picture of all users
        setTrombiImg([]);
        // we declare variable of profile picture of one user
        setProfilPicture("");
        // we declare variables of check choice of picture's user or medical certif
        setCheck(false);
        setCheckC(false);
        // we look what is the choiced function
        const demand = event.target.value;
        setdemand(demand);
        console.log("demand",demand);

        if(demand == "Modifier vos données"){
            //we take the id and do fetch call with req.params.id to retrieve data about user
            let response = await getOneUser();
            // we transform utc date to cet date 
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
            // we take all users datas by fetch call
            let responseT = await getAllUsers();
            // we retrieve users datas in array except one which is a ghost user (for a futur soft delete)
            // and we display their pictures
            const responseDataS = await responseT.json();
            console.log("trombi0",responseDataS,responseDataS.length);
            let trombArray = responseDataS;
            let index=responseDataS.findIndex(data=>(data.id==0));
            console.log("trombi1",trombArray);
            let trombData = trombArray.splice(index,1);
            console.log("trombi",trombArray);
            setTrombiD(trombArray);
        }
        if(demand == "Gestion des profils"){
            setTrombiImg([]);
            // // we take all users datas by fetch call to manage validation user/admin and erasure
            let responseG = await getAllUsers();
            // we retrieve users datas in array except one whish is a ghost user (for a futur soft delete)
            // and we display it
            const responseDataS = await responseG.json();
            console.log("gestion0",responseDataS);
            let gestArray = responseDataS.slice();
            let index=gestArray.findIndex(data=>(data.id==0));
            console.log("gestion1",gestArray);
            let trombData = gestArray.splice(index,1);
            console.log("gestion",gestArray);
            setGest(gestArray);
        }
        if(demand == "Ajouter certificat médical"){
            setCertPicture("");
            // // we take the id user by his jwt
            let responseC = await getOneUser();
            let responseData = await responseC.json();
            console.log('oldcertif',responseData.certif_med);
            // we try to display the old saved medical certif (doesn't work, maybe must have useEffect or ...)
            setCertPicture("http://localhost:8080/certifs/"+responseData.certif_med);
        }
        if(demand == "Modifier photo de profil"){
            setProfilPicture ("");
            // // we take the id user by his jwt
            let responseP = await getOneUser();
            let responseData = await responseP.json();
            console.log('oldpict',responseData.profil_picture);
            // we try to display the old saved medical certif (doesn't work, maybe must have useEffect or ...)
            setProfilPicture("http://localhost:8080/profiles/"+responseData.profil_picture);
        }
    }
    async function getOneUser() {
         // we take the id user by his jwt
         let id = (jwt_decode(jwtData)).id;
         console.log("le jwt",jwtData);
         //we take user data by fetch call
         const responseP = await fetch('http://localhost:8080/api/users/'+id,{
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": "Bearer "+jwtData
             }
         });

         return responseP;
    }
    async function getAllUsers() {
         // we take all users datas by fetch call to manage validation user/admin and erasure
         const responseG = await fetch('http://localhost:8080/api/users/',{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        });
        // we retrieve users datas in array except one whish is a ghost user (for a futur soft delete)
        // and we display it
        return responseG;
    }
    const handleSubmitModify = async(event)=>{
        event.preventDefault();
        // we retrieve saved datas and new entries
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
        // we patch datas by fetch call
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
        // we reset the form datas
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
        event.target.files[0].type=="application/pdf"? setImageCert(false):setImageCert(true);
        setCheckC(false);
        setCertPicture(objectUrl);
    }
    const handleSubmitProfilPic = async(event)=>{
        event.preventDefault();
        const pictureTemp = event.target.profilePic.files[0].name;
        console.log('nom de fichier:',pictureTemp);
        if(pictureTemp){
            const response = await getOneUser();
            let responseData = await response.json();
            const oldName = responseData.profil_picture;

            const MIME_TYPES = {
                'image/jpg': 'jpg',
                'image/jpeg': 'jpg',
                'image/png': 'png'
            }
            let pictureTps = pictureTemp.split(' ').join('_');
            const extension = MIME_TYPES[event.target.profilePic.files[0].type];
            // we cut the extension
            const pictureTp = pictureTps.split('.');
            pictureTps = pictureTp[0];
            // first we add date/time to the picture name to make it unique and the extension
            const picture = Date.now()+pictureTps+"."+extension;
            console.log(event.target.profilePic.files[0]);
            const imageFile = event.target.profilePic.files[0];
            //if it needs we compress image file
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
                // the filename is put in the body by formData format
                body.append('file', compressedFile,picture);
                console.log(body);
                // we save the profile picture by a fetch call
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
            const response = await getOneUser();

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
        console.log("gestprofile",gest);
        console.log(gesPName,gesPFName,gestionProf);
        let gestArray=gest.slice();
        const index=gestArray.findIndex(data=>(data.name==gesPName && data.first_name==gesPFName));
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
                    <ProfilAction handleSubmitUser={handleSubmitUser} role={role}/>
                    {demand=="Modifier vos données" &&
                        <DataMod handleSubmitModify={handleSubmitModify} responseData={responseData}/>
                    }
                    {demand=="Trombinoscope" &&
                        <Trombi trombiD={trombiD} serverBack={serverBack}/>
                    }
                    {demand=="Rechercher un adhérent" &&
                        <AdhSearch trombiImg={trombiImg} handleSubmitSearch={handleSubmitSearch} serverBack={serverBack}/>
                    }
                    {demand=="Modifier photo de profil" &&
                        <ProfilPic check={check} handleSubmitProfilPic={handleSubmitProfilPic} picPreview={picPreview} profilPicture={profilPicture}/>   
                    }
                    {demand=="Ajouter certificat médical" &&
                        <CertifMed imageCert={imageCert} checkC={checkC} handleSubmitCertifPic={handleSubmitCertifPic} certPreview={certPreview} certPicture={certPicture}/>   
                    }
                    {(demand=="Gestion des profils" && gest.length!=0) &&
                        <GestProfil gest={gest} gestProfile={gestProfile} />
                    }
                </div>
            </main>
    )
}

export default User;