import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router';
import {useState, useEffect} from "react";

function User() {

    const [role,setRole] = useState("");
    const [demand,setdemand] = useState("");
    const [responseData,setResponseData]=useState([]);
    const [validate, setValidate] = useState("");
    const [validateAdmin,setValidateAdmin] = useState([]);
    const [serverBack,setServerBack] = useState("http://localhost:8080");
    const [trombiD,setTrombiD] = useState([]);
    const [trombiImg,setTrombiImg] = useState([]);
    const [profilPicture,setProfilPicture] = useState("");
    const [profilFile,setProfilFile] = useState("");
    const [check,setCheck] = useState(false);
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

        setValidate("");
        setValidateAdmin("");
        setTrombiImg([]);
        setProfilPicture("");
        setCheck(false);
        const demand = event.target.userDemand.value;
        setdemand(demand);
        console.log(demand);

        if(demand == "Modifier votre profil"){
            
            const id = (jwt_decode(jwtData)).id;
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
            // let allUsers = responseDataS.sort( function compare(a,b){
            //     if(a.name<b.name)
            //         return -1
            //     if(a.name>b.name)
            //         return 1
            //     return 0
            // });
            // setTrombiD(allUsers);
            setTrombiD(responseDataS);
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
    const handleSubmitDelete = async(event) =>{
        event.preventDefault();
        setTrombiImg([]);
        const e = event.target;
        const name = e.nameDel.value;
        const first_name = e.first_nameDel.value;
        
        if(name && first_name){

            let suppress = window.confirm("êtes vous sûr de vouloir supprimer "+name+" "+first_name);
            if(suppress){
                const responseSup = await fetch('http://localhost:8080/api/users/user/'+name+"&"+first_name,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwtData
                    }
                });
                const responseSupData = await responseSup.json();
                console.log(responseSupData.id);
                if(responseSupData){
                    const id = responseSupData.id;

                    const responseDel = await fetch('http://localhost:8080/api/users/user/'+id,{
                        method: "DELETE",
                        headers:  {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer "+jwtData
                        }
                    });
                    alert("Adhérent supprimé");
                    e.nameDel.value="";
                    e.first_nameDel.value="";
                } else {
                    alert("Adhérent inconnu!!");
                }
            }
        }
    }
    const handleSubmitValidA = async(event)=>{
        event.preventDefault();
        setTrombiImg([]);
        const validElement ={
            "Valider":"1",
            "Invalider":"0"
        };

        const validRep ={
            "Valider":"validé",
            "Invalider":"invalidé"
        };

        const e = event.target;
        const name = e.nameVal.value;
        const first_name = e.first_nameVal.value;

        if(name && first_name){

            const roles = "";
            const rep = event.nativeEvent.submitter.defaultValue;
            const validity = validElement[rep];
            console.log(event.nativeEvent.submitter.defaultValue, validity, roles);
            const responseVal = await fetch('http://localhost:8080/api/users/user',{
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body:JSON.stringify({
                    name,
                    first_name,
                    validity,
                    roles
                })
            });
            setValidate(validRep[rep]);
        }
    }
    const handleSubmitValidAdmin = async(event)=>{
        event.preventDefault();
        setTrombiImg([]);
        const validElement ={
            "User":"user",
            "Admin":"admin"
        };

        const e = event.target;
        const name = e.nameVal.value;
        const first_name = e.first_nameVal.value;

        if(name && first_name){

            const validity = "";
            const rep = event.nativeEvent.submitter.defaultValue;
            const roles = validElement[rep];
            console.log(event.nativeEvent.submitter.defaultValue, validity, roles);
            const responseVal = await fetch('http://localhost:8080/api/users/user',{
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body:JSON.stringify({
                    name,
                    first_name,
                    validity,
                    roles
                })
            })
            setValidateAdmin(validElement[rep]);
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
            let body = new FormData();
            console.log(event.target.profilePic.files[0]);
            // on passe dans le body le nom du fichier modifié sous la form formData
            body.append('file', event.target.profilePic.files[0],picture);
            // ici on mettra la partie se chargeant du nom et de l'extension du fichier
            // ainsi que la partie s'occupant de compresser l'image (browser-image-compression sur npm)
            console.log("jwt",jwtData);
            console.log("body",body);
            const responseProPic = await fetch('http://localhost:8080/api/fileup/propic/',{
                method: "POST",
                headers: {
                    "Authorization": "Bearer "+jwtData
                },
                body: body
            });
            const responseProPicDel = await fetch(serverBack+'/api/fileup/propic/',{
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
        }
    }
console.log(trombiImg);  

    return(
            <main className="userMain">
                <div className="userContent">
                    <form onSubmit={handleSubmitUser}>
                        <label className="userform" htmlFor="userdemand">Action sur profil</label>
                        <select className="userform" type="text" name="userDemand" id="userdemand">
                            <option className="opForm" value="Modifier votre profil">Modifier votre profil</option>
                            <option className="opForm" value="Modifier photo de profil">Modifier photo de profil</option>
                            <option className="opForm" value="Ajouter certificat médical">Ajouter certificat médical</option>
                            <option className="opForm" value="Rechercher un adhérent">Rechercher un adhérent</option>
                            <option className="opForm" value="Trombinoscope">Trombinoscope</option>
                            {role=="admin" &&
                                <>
                                    <option className="opForm" value="______________________" disabled></option>
                                    <option className="opForm" value="Supprimer un adhérent">Supprimer un adhérent</option>
                                    <option className="opForm" value="Valider un adhérent">Valider un adhérent</option>
                                    <option className="opForm" value="Valider un admin">Valider un admin</option>
                                </>
                            }
                        </select>
                        <button className="userform" type="submit">Ok</button>
                    </form>
                    {demand=="Modifier votre profil" &&
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
                    {demand=="Supprimer un adhérent" &&
                    <form className="deleteForm" id="formulsup" onSubmit={handleSubmitDelete}>
                        <div className="userDelCont">
                        <label className="userDel">Nom:<input className="userDelLab" type="text" name="nameDel" /></label>
                        <label className="userDel">Prénom:<input type="text" name="first_nameDel" /></label>
                        <button className="userDel" type="submit">Supprimer</button>
                        </div>
                    </form>
                    }
                    {demand=="Valider un adhérent" &&
                    <form className="validForm" id="formulval" onSubmit={handleSubmitValidA}>
                        <div className="userDelCont">
                        <label className="userDel">Nom:<input className="userDelLab" type="text" name="nameVal" /></label>
                        <label className="userDel">Prénom:<input type="text" name="first_nameVal" /></label>
                        <div>
                            <input className="userVal" type="submit" value="Valider" />
                            <input className="userVal" type="submit" value="Invalider" />
                        </div>
                        </div>
                        <h2 className="userValidate">{validate}</h2>
                    </form>
                    }
                    {demand=="Valider un admin" &&
                    <form className="validForm" id="formulval" onSubmit={handleSubmitValidAdmin}>
                        <div className="userDelCont">
                        <label className="userDel">Nom:<input className="userDelLab" type="text" name="nameVal" /></label>
                        <label className="userDel">Prénom:<input type="text" name="first_nameVal" /></label>
                        <div>
                            <input className="userVal" type="submit" value="Admin" />
                            <input className="userVal" type="submit" value="User" />
                        </div>
                        </div>
                        <h2 className="userValidate">{validateAdmin}</h2>
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
                </div>
            </main>
    )
}

export default User;