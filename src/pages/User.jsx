import jwt_decode from "jwt-decode";
import {useNavigate} from 'react-router';
import {useState, useEffect} from "react";
import e from "cors";

function User() {

    const [role,setRole] = useState("admin");
    const [responseData,setResponseData]=useState([]);
    const [demand,setdemand] = useState("");
    const navigate = useNavigate();
    const jwtData = window.localStorage.getItem("jwt");
    const cbox = {
        "0":"off",
        "1":"on"
    };
    const chekbox = {
        "off": 0,
        "on": 1
    }
    

    // const roleData = "";

    // useEffect(()=>{
    //     (()=>{
    //         if (jwtData) {
                // const role=(jwt_decode(jwtData)).roles;
    //             console.log("role",role);
    //             setRole(role);
    //             console.log(role!=="admin",role!=="user");
    //             console.log(role !== "admin" && role !== "user");
    //             if(role !== "admin" && role !== "user"){
    //               alert("Pour accéder à cet espace vous devez être connecté");
    //               navigate("/");
    //             } 
    //         } else {
    //             alert("Allllerte Pour accéder à cet espace vous devez être connecté");
    //             navigate("/");
    //         }
    //     })()

    // },[navigate])

    const handleSubmitUser = async(event)=>{
        event.preventDefault();

        const demand = event.target.userDemand.value;
        setdemand(demand);
        console.log(demand);

        if(demand == "Modifier votre profil"){

            const email = (jwt_decode(jwtData)).email;
            console.log(jwtData);
            const response = await fetch('http://localhost:8080/api/users/user',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body: JSON.stringify({
                    email
            })

            })
            let responseData = await response.json();
            responseData.birthdate = (responseData.birthdate).slice(0,10);
            responseData.share_infos = cbox[responseData.share_infos]; 
            setResponseData(responseData);
            console.log("yes",responseData);
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
        const password = modify.passwordMod.value;
       
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
                share_infos,
                email: responseData.email,
                profil_picture: responseData.profil_picture,
                certif_med: responseData.certif_med,
                validity: responseData.validity,
                roles: responseData.roles,
                validity_certif_date: responseData.validity_certif_date,
                password
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
        console.log(name,first_name);
        let suppress = window.confirm("êtes vous sûr de vouloir supprimer "+name+" "+first_name);
        if(suppress){
            const responseSup = await fetch('http://localhost:8080/api/users/user/'+name,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                },
                body: JSON.stringify({
                    name,
                    first_name
                })
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

  

    return(
            <main className="userMain">
                <div className="userContent">
                    <form onSubmit={handleSubmitUser}>
                        <label className="userform" htmlFor="userdemand">Action sur profil</label>
                        <select className="userform" type="text" name="userDemand" id="userdemand">
                            <option value="Modifier votre profil">Modifier votre profil</option>
                            <option value="Rechercher un adhérent">Rechercher un adhérent</option>
                            {role=="admin" &&
                                <>
                                    <option value="______________________" disabled></option>
                                    <option value="Supprimer un adhérent">Supprimer un adhérent</option>
                                    <option value="Valider un adhérent">Valider un adhérent</option>
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
                        <label className="userInpForm" >Partage des informations personnelles</label>
                        <input className="userInpForm" type="checkbox" name="share_infosMod" defaultValue={responseData.share_infos} />
                        <input className="userInpForm" type="password" name="passwordMod" defaultValue="password" />
                        <button className="userInpForm uIFBtn" type="submit">ENVOYER</button>
                    </form>
                    }
                    {demand=="Supprimer un adhérent" &&
                    <form className="deleteForm" id="formulsup" onSubmit={handleSubmitDelete}>
                        <div className="userDelCont">
                        <label className="userDel">Nom:<input type="text" name="nameDel" /></label>
                        <label className="userDel">Prénom:<input type="text" name="first_nameDel" /></label>
                        <button className="userDel" type="submit">Supprimer</button>
                        </div>
                    </form>
                    }
                </div>
            </main>
    )
}

export default User;