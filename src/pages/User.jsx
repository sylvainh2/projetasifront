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
import Result from "../components/Result";
import ModaleInscription from "../components/ModaleInscription";

function User() {
    // we declare all the variables use in the react part
    const [role,setRole] = useState("");
    const [demand,setdemand] = useState("");
    const [validityDisplay,setValidityDisplay] = useState(false);
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
    const [userList,setUserList] = useState([]);
    const [resultDisp,setResultDisp] = useState([]);
    const [courseForm,setCourseForm] = useState ("");
    const [cinq,setCinq] = useState ({});
    const [dix,setDix] = useState ({});
    const [semi,setSemi] = useState ({});
    const [marathon,setMarathon] = useState({});
    const [modale,setModale] = useState(false);
    const [dataModale,setDataModale] = useState ({});
    const [eventModale,setEventModale] = useState ({});
    const [modaleInscript,setModaleInscript] = useState(0);
    const [modaleInscriptText,setModaleInscriptText] = useState("");
    const navigate = useNavigate();
    const jwtData = window.localStorage.getItem("jwt");
    // let oldDemand = [];

    const cbox = {
        "0":"",
        "1":"checked"
    };
    const chekbox = {
        "off": "0",
        "on": "1",
        "checked":"1"
    }
    function format(dataD){
        const options = {day:'numeric',month:'numeric', year:'numeric'};
        return(new Date(dataD).toLocaleDateString([],options));
    }

    // we look if we have the rights to be here and do the functions
    useEffect(()=>{
        if (jwtData) {
            const roleD=(jwt_decode(jwtData)).roles;
            const validityD=(jwt_decode(jwtData)).validity;
            console.log(roleD,validityD);
            console.log(roleD!=="admin" && (roleD !== "user" && validityD!="1"));
            console.log(roleD!=="admin");
            setRole(roleD);
            if(roleD !== "admin" && (roleD !== "user" && validityD!="1")){
            // if(roleD !== "admin" && roleD !== "user"){
            
                window.alert("Pour accéder à cet espace vous devez être connecté et autorisé");
                // window.alert("Pour accéder à cet espace vous devez être connecté");
                retourAccueil();
            } else if((roleD === "user" && validityD==="1") || roleD === "admin"){
                setValidityDisplay(true);
            }
        } else {
            window.alert("Pour accéder à cet espace vous devez être connecté et autorisé");
            // window.alert("Pour accéder à cet espace vous devez être connecté");

            retourAccueil();
        }
    },[])

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
        const demand = event.target.textContent;
        setdemand(demand);
        console.log("demand",demand);

        if(demand === "Modifier vos données"){
            //we take the id and do fetch call with req.params.id to retrieve data about user
            let response = await getOneUser();
            // we transform utc date to cet date 
            let responseData = await response.json();
            const dateUTC = new Date(responseData.birthdate);
            const offsetCET = -(new Date().getTimezoneOffset())/60;
            const dateCET = new Date(dateUTC.getTime() + offsetCET * 60 * 60 * 1000);
            const dateTz= (JSON.stringify(dateCET));
            responseData.birthdate = (dateTz).slice(1,11);
            responseData.share_infos = cbox[responseData.share_infos]; 
            setResponseData(responseData);
        }
        if(demand === "Trombinoscope"){
            setTrombiImg([]);
            // we take all users datas by fetch call
            let responseT = await getAllUsers();
            // we retrieve users datas in array except one which is a ghost user (for a futur soft delete)
            // and we display their pictures
            const responseDataS = await responseT.json();
            let trombArray = responseDataS;
            // let index=responseDataS.findIndex(data=>(data.id==0));
            // let trombData = trombArray.splice(index,1);
            setTrombiD(trombArray);
        }
        if(demand === "Gestion des profils"){
            setTrombiImg([]);
            // we take all users datas by fetch call to manage validation user/admin and erasure
            let responseG = await getAllUsers();
            // we retrieve users datas in array except one whish is a ghost user (for a futur soft delete)
            // and we display it
            const responseDataS = await responseG.json();
            let gestArray = responseDataS.slice();
            setGest(gestArray);
        }
        if(demand === "Ajouter certificat médical"){
            setCertPicture("");
            //  we take the id user by his jwt
            let responseC = await getOneUser();
            let responseData = await responseC.json();
            // we try to display the old saved medical certif
            setCertPicture("http://localhost:8080/certifs/"+responseData.certif_med);
        }
        if(demand === "Ajouter dossier inscription"){
            console.log("je passe par ici");
            setCertPicture("");
            //  we take the id user by his jwt
            let responseC = await getOneUser();
            let responseData = await responseC.json();
            // we try to display the old saved inscription
            setCertPicture("http://localhost:8080/inscript/"+responseData.inscript_certif);
        }
        if(demand === "Modifier photo de profil"){
            setProfilPicture ("");
            // // we take the id user by his jwt
            let responseP = await getOneUser();
            let responseData = await responseP.json();
            // we try to display the old saved medical certif
            setProfilPicture("http://localhost:8080/profiles/"+responseData.profil_picture);
        }
        if(demand === "Rechercher un adhérent"){
            // we take all users datas by fetch call
            let responseAdh = await getAllUsers();
            let responseData = await responseAdh.json();
            setUserList(responseData);
            
        }
        if(demand === "Mes résultats"){
            setCourseForm("");
            // we take all runs datas of the id user by fetch call
            let responseResult = await getAllRuns();
            console.log(responseResult);
            if(responseResult.status<400){
                let responseData = await responseResult.json();
                setResultDisp(responseData);
                bestDisplay(responseData);
            }
        }
    }
    async function getOneUser() {
         // we take the id user by his jwt
         let id = (jwt_decode(jwtData)).id;
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
    async function getOneUserId(id) {
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
        // we retrieve users datas in array except one which is a ghost user (for a futur soft delete)
        // and we display it
        return responseG;
    }
    async function getAllRuns() {
        let id = (jwt_decode(jwtData)).id;
        const responseC = await fetch('http://localhost:8080/api/users/user/run/'+id,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            }
        })
        return responseC;
    }
    function bestDisplay(bestData){
        setCinq(bestRuns(5,bestData));
        setDix(bestRuns(10,bestData));
        setSemi(bestRuns(21.1,bestData));
        setMarathon(bestRuns(42.195,bestData));
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
            // oldDemand.value = "--------Votre Choix--------";
            alert("Profil Modifié");
            setdemand("");
            setResponseData([]);
        }
    }
    const handleSubmitSearch = async(event)=>{
        event.preventDefault();
        const e = event.target;
        const name = (e.nameSearch.value).split(" ")[0];
        const first_name = (e.nameSearch.value).split(" ")[1];
        const trombiImgSearch = userList.find(data=>(data.name===name && data.first_name===first_name));
        if(trombiImgSearch){
            setTrombiImg(trombiImgSearch);
        }
    }
    const picPreview = async(event)=>{
        event.preventDefault();
        const objectUrl = URL.createObjectURL(event.target.files[0]);
        setProfilFile(event.target.files[0].name);
        setCheck(false);
        setProfilPicture(objectUrl);
    }
    const certPreview = async(event)=>{
        event.preventDefault();
        const objectUrl = URL.createObjectURL(event.target.files[0]);
        setCertFile(event.target.files[0].name);
        event.target.files[0].type==="application/pdf"? setImageCert(false):setImageCert(true);
        setCheckC(false);
        setCertPicture(objectUrl);
    }
    const handleSubmitProfilPic = async(event)=>{
        event.preventDefault();
        const pictureTemp = event.target.profilePic.files[0].name;
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
                console.log(event.target.certifPic.files[0]);
                // the filename is put in the body by formData format
                body.append('file', compressedFile,picture);
                // we save the profile picture by a fetch call
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
        async function Change (body, oldNameC){
            // ici on mettra la partie se chargeant du nom et de l'extension du fichier
            // ainsi que la partie s'occupant de compresser l'image (browser-image-compression sur npm)
            if (demand === "Ajouter certificat médical"){
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
            }
            if (demand === "Ajouter dossier inscription"){
                const responseCertPic = await fetch(serverBack+'/api/inscript/',{
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer "+jwtData
                    },
                    body: body
                });
                const responseCertPicDel = await fetch(serverBack+'/api/inscript/',{
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwtData
                    },
                    body:JSON.stringify({
                        oldNameC
                    })
                });
            }
            return
        }
        if(certifTemp){
            const response = await getOneUser();

            let responseData = await response.json();
            console.log("ici la demande",demand);
            let oldNameC = "";
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if(demand==="Ajouter certificat médical"){
                oldNameC = responseData.certif_med;
            }
            if(demand==="Ajouter dossier inscription"){
                oldNameC = responseData.inscript_certif;

            }
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
            setCheckC(true);
            } catch (error) {
                console.log(error);
            }
        }
    }
    const gestProfile = async(profileData,event)=>{
        event.preventDefault();
        setTrombiImg([]);
        const validElement ={
            "valide":"0",
            "invalide":"1",
            "user":"admin",
            "admin":"user"
        };
        let gestionProf = event.target.name || event.target.parentElement.name;
        const gesPName = profileData.name.toLowerCase();
        const gesPFName = profileData.first_name.toLowerCase();
        let gestArray=gest.slice();
        const index=gestArray.findIndex(data=>(data.name==gesPName && data.first_name==gesPFName));
        const userTDid = profileData.id;
        if((gestionProf!="trash" && gestionProf!="medical" && gestionProf!="inscription" && gestionProf!="paiement")&& gestionProf.length!=0){
            if(jwt_decode(jwtData).id != userTDid){
                if(gestionProf==="valide" || gestionProf==="invalide"){
                    gestArray[index].validity=validElement[gestionProf];
                    if(gestionProf==="valide"){
                        gestArray[index].roles="user";
                    }
                }
                if(gestionProf==="user" || gestionProf==="admin"){
                    gestArray[index].roles=validElement[gestionProf];
                    if(gestionProf==="user"){
                        gestArray[index].validity="1";
                    }
                }
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
        if(gestionProf==="trash"){
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
                let trombData = gestArray.splice(index,1);
                setGest(gestArray);
            } else {
                alert('Vous ne pouvez pas supprimer votre propre compte, passez par un administrateur');
            }
        }
        if(gestionProf==="medical"){
            // On affiche le certificat médical
            let responseC = await getOneUserId(userTDid);
            let responseData = await responseC.json();
            setCertPicture("http://localhost:8080/certifs/"+responseData.certif_med);
            setImageCert(false);
            setDataModale(responseData);
            setModaleInscriptText("Je valide le certificat");
            // we try to display the old saved medical certif
            setModaleInscript(1);
            // On demande la validation du certificat médical
            // On met à jour la BDD et on colorise en fonction l'icone médical
        }
        if(gestionProf==="inscription"){
            // On affiche le dossier d'inscription
            let responseC = await getOneUserId(userTDid);
            let responseData = await responseC.json();
            setCertPicture("http://localhost:8080/inscript/"+responseData.inscript_certif);
            setImageCert(false);
            setDataModale(responseData);
            setModaleInscriptText("Je valide le dossier");
            // we try to display the old saved medical certif
            setModaleInscript(1);
            // On demande la validation du dossier d'inscription
            // On met à jour la BDD et on colorise en fonction l'icone dossier d'inscription
        }
        if(gestionProf==="paiement"){
            // On fait la validation/devalidation du paiement
            let responseC = await getOneUserId(userTDid);
            let responseData = await responseC.json();
            let inscription = JSON.parse(responseData.inscription);
            if(!inscription){
                inscription = {med:false,ins:false,pay:false};
            }
            inscription.pay = !inscription.pay;
            // On met à jour la BDD et on colorise en fonction l'icone paiement
            const response = await fetch(serverBack+'/api/users/user/inscription/'+responseData.id,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+jwtData
                },
                body:JSON.stringify({
                    inscription:inscription
                })
            })
            let dataAff = await getAllUsers();
            let dataAffDisp = await dataAff.json();
            setGest(dataAffDisp);
        }
    }
    const resultGest = (event)=>{
        event.preventDefault();
        if(courseForm===event.target.textContent){
            setCourseForm("");
        } else {
            setCourseForm(event.target.textContent);
        }
    }
    const gestModaleMedicale = async (event,responseData)=>{
        event.preventDefault();
        let inscription = JSON.parse(responseData.inscription);
        let modaleResponse = event.target.textContent;
        if(modaleResponse==="Je ne valide pas"){
            //on renseigne l'objet inscription ici
            if(!inscription){
                inscription = {med:false,ins:false,pay:false};
            } else {
                    if(modaleInscriptText==="Je valide le certificat"){
                        inscription.med = false;
                    }
                    if(modaleInscriptText==="Je valide le dossier"){
                        inscription.ins = false;
                    }
            }
            const response = await fetch(serverBack+'/api/users/user/inscription/'+responseData.id,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+jwtData
                },
                body:JSON.stringify({
                    inscription:inscription
                })
            })
        }
        if(modaleResponse==="Je valide le certificat" || modaleResponse==="Je valide le dossier"){
            //on renseigne l'objet inscription ici
            if(modaleResponse==="Je valide le certificat"){
                if(!inscription){
                    inscription = {med:true,ins:false,pay:false};
                } else {
                    inscription.med = true;
                }
            }
            if(modaleResponse==="Je valide le dossier"){
                if(!inscription){
                    inscription = {med:false,ins:true,pay:false};
                } else {
                    inscription.ins = true;
                }
            }
            const response = await fetch(serverBack+'/api/users/user/inscription/'+responseData.id,{
                method: "PATCH",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+jwtData
                },
                body:JSON.stringify({
                    inscription:inscription
                })
            })
        }
        setModaleInscript(0);
        let dataAff = await getAllUsers();
        let dataAffDisp = await dataAff.json();
        setGest(dataAffDisp);
    }
    const handleSubmitCourse = async(event)=>{
        event.preventDefault();
        const e = event.target;
        const date = e.date.value;
        const course = e.course.value;
        const temps = e.temps.value;
        const distance = parseInt(e.distance.value);
        const id=(jwt_decode(jwtData)).id;

        if(date && course && temps && distance){
            const response = await fetch(serverBack+'/api/users/user/run',{
                method : "PUT",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body:JSON.stringify({
                    name:course,
                    user_id:id,
                    temps:temps,
                    datecourse:date,
                    distance:distance
                })
            })
            let responseResult = await getAllRuns();
            let responseData = await responseResult.json();
            setResultDisp(responseData);
            bestDisplay(responseData);
            document.querySelector(".resultForm").reset();
            setCourseForm("");

        }

    }
    const handleCourseTrash = async(data,event)=>{
        event.preventDefault();
        if(!modale){
            setDataModale(data);
            setEventModale(event);
            setModale(true);
        } else {
            if(event.target.innerText==="Annuler"){
                setModale(false);
            }
            if(event.target.innerText==="Oui"){
                    const resonse = await fetch(serverBack+"/api/users/user/run/"+dataModale.id_runs,{
                        method : "DELETE",
                        headers: {
                            "Content-Type":"application/json",
                            "Authorization": "Bearer "+jwtData                
                        }
                    });
                    let responseResult = await getAllRuns();
                    let responseData = await responseResult.json();
                    setModale(false);
                    setResultDisp(responseData);
                    bestDisplay(responseData);

            }
        }
    }
    function bestRuns (distance,fichier){
        let distanceArray = [];
        let best = {};
        fichier.map((data)=>{
            if(data.distance === distance){
                distanceArray.push(data);
            }
        })
        distanceArray.map((data)=>{
            if(data.temps<best.temps || !(best.temps)){best=data};
        })
        return (best);
    }

    return(
            <main className="userMain">
                <div className="userContent">
                    <ProfilAction handleSubmitUser={handleSubmitUser} role={role} validityDisplay={validityDisplay}/>
                    <ModaleInscription modaleInscript={modaleInscript} imageCert={imageCert} certPicture={certPicture} gestModaleMedicale={gestModaleMedicale} dataModale={dataModale} modaleInscriptText={modaleInscriptText}/>
                    {demand==="Modifier vos données" &&
                        <DataMod handleSubmitModify={handleSubmitModify} responseData={responseData}/>
                    }
                    {demand==="Trombinoscope" &&
                        <Trombi trombiD={trombiD} serverBack={serverBack}/>
                    }
                    {demand==="Rechercher un adhérent" &&
                        <AdhSearch trombiImg={trombiImg} userList={userList} handleSubmitSearch={handleSubmitSearch} serverBack={serverBack}/>
                    }
                    {demand==="Modifier photo de profil" &&
                        <ProfilPic check={check} handleSubmitProfilPic={handleSubmitProfilPic} picPreview={picPreview} profilPicture={profilPicture}/>   
                    }
                    {(demand==="Ajouter certificat médical" || demand==="Ajouter dossier inscription") &&
                        <CertifMed imageCert={imageCert} checkC={checkC} handleSubmitCertifPic={handleSubmitCertifPic} certPreview={certPreview} certPicture={certPicture} demand={demand}/>   
                    }
                    {(demand==="Gestion des profils" && gest.length!==0) &&
                        <GestProfil gest={gest} gestProfile={gestProfile}/>
                    }
                    {demand==="Mes résultats" &&
                        <Result resultDisp={resultDisp} resultGest={resultGest} courseForm={courseForm} handleSubmitCourse={handleSubmitCourse} handleCourseTrash={handleCourseTrash} cinq={cinq} dix={dix} semi={semi} marathon={marathon} modale={modale} dataModale={dataModale}/>
                    }
                </div>
            </main>
    )
}

export default User;