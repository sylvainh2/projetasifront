// import { useEffect , useState } from "react";
import { useNavigate } from "react-router";

function Rec() {

    // const [error, setError] = useState(null);


    const navigate = useNavigate();

    const handleSubmitSign2 = async (event)=>{
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
        console.log('partage:',event.target.share_infos.value);
        if(event.target.share_infos.value==="on"){
            share_infos=1;
        } else {
            share_infos=0;
        }
        
        // console.log(email,password,repassword,name,first_name,birthdate,address,postcode,city,tel,share_infos);
        
        const responseSign = await fetch('http://localhost:8080/api/signup',{
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
            if(responseSign.status>=400){
                const erreur = await responseSign.json();
                if((erreur.message)==undefined){
                    alert(erreur[0].message);
                } else {
                    alert(erreur.message);
                }
            } else {
            const responseSignData = await responseSign.json();
            alert("nouveau profil créé");
            // on obtient ici le token... à voir si on peut en avoir besoin par la suite
            // mais vu qu'il faut que le compte soit validé par un admin pour etre actif...
            // mais sait-on jamais si une nouvelle fonctionnalité n'ayant pas besoin de validation est implantée...
            navigate('/');
        }}
    }

    return(
        <>
            <main className="signup">
                <div className="signupContent">
                <form onSubmit={handleSubmitSign2}>
                    <label className="labelRecord">Nom:</label>
                    <input className="inputsign" type="text" name="name" />
                    <label className="labelRecord">Prénom:</label>
                    <input className="inputsign" type="text" name="first_name" />
                    <label className="labelRecord">Date de naissance</label>
                    <div className="lineRecord">
                        <input type="date" name="birthdate" />
                    </div>
                    <label className="labelRecord">Adresse:</label>
                    <textarea className="inputsign textA" cols="50" rows="3" type="text" name="address" />
                    <div className="signCity">
                        <div className="recordCp">
                            <label className="signupCity">Code Postal:</label>
                            <input className="recordCpContainer lineRecord" type="text" name="postcode" />
                        </div>
                        <div className="recordCp">
                            <label className="signupCity">Ville:</label>
                            <input type="text" name="city" />
                        </div>
                    </div>
                    <label className="labelRecord">Numéro de Téléphone:</label>
                    <div className="lineRecord">
                    <input type="text" name="tel" />
                    </div>
                    <div className="infoSign lineRecord">
                        <label className="labelRecord lsBox">Partage des informations personnelles:</label>
                        <input type="checkbox" name="share_infos" defaultValue="off" />
                    </div>
                    <label className="labelRecord">Email:</label>
                    <input className="inputsign" type="email" name="email" />
                    <label className="labelRecord">Mot de passe:</label>
                    <input className="inputsign" type="password" name="password" />
                    <label className="labelRecord">Confirmation Mot de passe:</label>
                    <input className="inputsign" type="password" name="repassword" />
                    <div className="signupBtnContent">
                        <button className="inputsign">ENVOYER</button>
                    </div>
                </form>
                </div>
            </main>
        </>
    )
}

export default Rec;