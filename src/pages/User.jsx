import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router';
import {useState, useEffect} from "react";

function User() {

    const [role,setRole] = useState("");
    const [demand,setdemand] = useState("");
    const [responseData,setResponseData]=useState([]);
    const [validate, setValidate] = useState("");
    const [validateAdmin,setValidateAdmin] = useState([]);
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

        
    }
    const handleSubmitModify = async(event)=>{
        event.preventDefault();


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
        )
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
                })
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
                    })
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
            const rep = event.nativeEvent.submitter.defaultValue
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
            })
            setValidate(validRep[rep]);
        }
    }
    const handleSubmitValidAdmin = async(event)=>{
        event.preventDefault();

        const validElement ={
            "User":"user",
            "Admin":"admin"
        };

        const e = event.target;
        const name = e.nameVal.value;
        const first_name = e.first_nameVal.value;

        if(name && first_name){

            const validity = "";
            const rep = event.nativeEvent.submitter.defaultValue
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
  

    return(
            <main className="userMain">
                <div className="userContent">
                    <form onSubmit={handleSubmitUser}>
                        <label className="userform" htmlFor="userdemand">Action sur profil</label>
                        <select className="userform" type="text" name="userDemand" id="userdemand">
                            <option value="Modifier votre profil">Modifier votre profil</option>
                            <option value="Rechercher un adhérent">Rechercher un adhérent</option>
                            <option value="Trombinoscope">Trombinoscope</option>
                            {role=="admin" &&
                                <>
                                    <option value="______________________" disabled></option>
                                    <option value="Supprimer un adhérent">Supprimer un adhérent</option>
                                    <option value="Valider un adhérent">Valider un adhérent</option>
                                    <option value="Valider un admin">Valider un admin</option>
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
                </div>
            </main>
    )
}

export default User;