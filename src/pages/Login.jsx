import { useEffect , useState } from "react";
import { useNavigate } from "react-router";

function Login() {

    const [error, setError] = useState(null);
    const [loginModify, setLoginModify] = useState(false);
    const [authPassModify, setAuthPassModify] = useState(false);
    const [codeSend,setCodeSend] = useState(false);
    const [tempsDepasse, setTempsDepasse] = useState(false);
    const [noEmail, setNoEmail] = useState(false);
    let codeValidation = "";


    const navigate = useNavigate();
    useEffect(()=>{
        const connectData = window.localStorage.getItem("connect");
        if(connectData === "déconnexion"){
            window.localStorage.clear("connect");
            window.localStorage.clear("jwt");
            navigate('/');
        }
    });
    const handlePassModify = async()=>{
        setLoginModify(true);
    }

    const handleSubmitPass = (e)=>{
        const email = e.target.email.value;
        setAuthPassModify(true);
        console.log("passmodify",email);
    }

    const handlePassModifySend = async (event)=>{
        event.preventDefault();
    }

    const handleSubmitAuth = async (event)=>{
        event.preventDefault();
        const email = event.target.email.value;
        if(tempsDepasse)setTempsDepasse(false);
        // const postedCode = event.target.code.value;
        if(!loginModify){
            const password = event.target.password.value;
            const responseAuth = await fetch('http://localhost:8080/api/login',{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
    
            const tokenResponse = await responseAuth.json();
    
            if ("access_token" in tokenResponse) {
                window.localStorage.setItem("jwt",tokenResponse.access_token);
                window.localStorage.setItem("connect","déconnexion");
                navigate('/');
            } else {
                window.localStorage.setItem("connect","connexion");
                setError("Mauvais Email ou Password");
                error && (
                    alert(error)
                )
                event.target.email.value="";
                event.target.password.value="";
            }
        }else{
            setAuthPassModify(true);
        }
        if(loginModify & !codeSend){
            // on crée un code et on envoie
            let codeTemp = (Math.floor(Math.random()*999999)).toString();
            const codeZero = "000000";
            codeValidation = codeZero.substr(0,6-(codeTemp.length))+codeTemp;
            console.log("code:",codeValidation);
            event.preventDefault();
            let email= event.target.email.value;
            let message = codeValidation;
            let sujet = "code valable 3min";
            // appel fetch pour voir l'existence de l'adresse mail et valider la suite (à créer)
            const response = await fetch('http://localhost:8080/api/signup/'+email,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },

            })
            const responseId = await response.json();
            if(!responseId.id){
                setNoEmail(true);
            }else{
                setNoEmail(false);
            // reste à créer les conditions suivant l'appel fetch
            if (email && message && sujet){
                //traitement envoi email//
                // const emailSender = await fetch("http://localhost:8080/api/send-emailcode",{
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify({
                //         email,
                //         sujet,
                //         message
                //     })
                // })
            setCodeSend(true);
            // document.querySelector(".loginForm").reset();
            setTimeout(()=>{
                codeValidation = "";
                setCodeSend(false);
                // setTimeout(()=>{
                    setAuthPassModify(false);
                    setTempsDepasse(true);
                    // document.querySelector(".codeSended").value="";
                // },300)
            },180000);
            }
            }
        }

    }

    const handleCancel = (e)=>{
        const ev = e.target;
        if(ev.innerHTML==="Annuler"){
            navigate('/');
        }
    }

    return(
        <>
            <main className="login">
                <form className="loginForm" onSubmit={handleSubmitAuth}>
                    <label className="inputLog">email:</label>
                    <input className="inputLog" type="email" name="email" required/>
                    {tempsDepasse &&
                    <p className="inputLog">Temps dépassé, appuyez sur Envoyer pour recevoir un nouveau code</p>
                    }
                    {noEmail &&
                    <p className="inputLog">Email incorrect/inconnu</p>
                    }
                    {(authPassModify && !noEmail) &&
                    <>
                        <label className="inputLog">mot de passe:</label>
                        <input className="inputLog" type="password" name="password" required/>
                        <label className="inputLog">confirmation mot de passe:</label>
                        <input className="inputLog" type="password" name="repassword" required/>
                        <label className="inputLog">code d'identification reçu par mail</label>
                        <input className="inputLog codeSended" type="text" name="code" required maxLength="6"/>
                    </>}
                    {loginModify &&
                        <div className="loginBtnBox loginBtn">
                            <button className="">Envoyer</button>
                            <button className="" onClick={handleCancel}>Annuler</button>
                        </div>}
                    {!loginModify &&
                    <>
                    <label className="inputLog">password:</label>
                    <input className="inputLog" type="password" name="password" required/>
                    <div className="loginBtnBox loginBtn">
                        <button className="">Connexion</button>
                        <button className="" onClick={handleCancel}>Annuler</button>
                    </div>
                    <button className="passModifyBtn red" onClick={handlePassModify}>Mot de passe perdu/oublié</button>
                    </>
                    }                    
                </form>
            </main>
        </>
    )
}

export default Login;