// import { useEffect , useState } from "react";
import { useNavigate } from "react-router";

function Signup() {

    // const [error, setError] = useState(null);


    const navigate = useNavigate();

    const handleSubmitSign = async (event)=>{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        const repassword = event.target.repassword.value;
        const name = event.target.name.value;
        const first_name = event.target.first_name.value;
        const birthdate = event.target.birthdate.value;
        const address = event.target.address.value;
        const postcode = event.target.postcode.value;
        const city = event.target.city.value;
        const tel = event.target.tel.value;
        let share_infos = event.target.share_infos.value;
        if(event.target.share_infos.value==="on"){
            share_infos=1;
        } else {
            share_infos=0;
        }
        
        console.log(email,password,repassword,name,first_name,birthdate,address,postcode,city,tel,share_infos);
        
        const responseSign = await fetch('http://localhost:8080/api/login/signup',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
                repassword,
                name,
                first_name,
                birthdate,
                address,
                postcode,
                city,
                tel,                
                share_infos                
            })
        })
        if(responseSign){
            console.log(responseSign);
        }
        navigate('/');
    }

    return(
        <>
            <main className="signup">
                <div className="signupContent">
                <form className="signupForm" onSubmit={handleSubmitSign}>
                    <label className="labelsign">Nom:</label>
                    <input className="inputsign" type="text" name="name" />
                    <label className="labelsign">Prénom:</label>
                    <input className="inputsign" type="text" name="first_name" />
                    <label className="labelsign">Date de naissance</label>
                    <div className="inputsignBD">
                        <input className="inputsignBD" type="date" name="birthdate" />
                    </div>
                    <label className="labelsign">Adresse:</label>
                    <textarea className="inputsign" cols="50" rows="3" type="text" name="address" />
                    <div className="signCity">
                        <div className="signupCP">
                            <label className="">Code Postal:</label>
                            <input className="inputCP" type="text" name="postcode" />
                        </div>
                        <div className="signupCP">
                            <label className="">Ville:</label>
                            <input className="inputCity" type="text" name="city" />
                        </div>
                    </div>
                    <label className="labelsign">Numéro de Téléphone:</label>
                    <div className="inputsignTelCont">
                    <input className="inputsignTel" type="text" name="tel" />
                    </div>
                    <div className="infoSign">
                        <label className="labelsign lsBox">Partage des informations personnelles:</label>
                        <input className="inputsignBox" type="checkbox" name="share_infos" />
                    </div>
                    <label className="labelsign">Email:</label>
                    <input className="inputsign" type="email" name="email" />
                    <label className="labelsign">Mot de passe:</label>
                    <input className="inputsign" type="password" name="password" />
                    <label className="labelsign">Confirmation Mot de passe:</label>
                    <input className="inputsign" type="password" name="repassword" />
                    <div className="signupBtnContent">
                        <button className="signupBtn inputsign">ENVOYER</button>
                    </div>
                </form>
                </div>
            </main>
        </>
    )
}

export default Signup;