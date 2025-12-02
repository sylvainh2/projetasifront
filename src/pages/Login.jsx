import { useEffect , useState, useMemo } from "react";
import { useNavigate } from "react-router";

function Login() {

    const [error, setError] = useState(null);
    const [loginModify, setLoginModify] = useState(false);
    const [authPassModify, setAuthPassModify] = useState(false);
    const [codeSend,setCodeSend] = useState(false);
    const [tempsDepasse, setTempsDepasse] = useState(false);
    const [noEmail, setNoEmail] = useState(false);
    let timerValidCode;
    console.log("reset variables");
    
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

    const cancelValid = ()=>{
        setCodeSend(false);
        setLoginModify(true);
        setAuthPassModify(false);
        timerValidCode = window.localStorage.getItem("timerV");
        clearTimeout(timerValidCode);
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
        if(loginModify && codeSend){
            //gestion de la mise en bdd du nouveau mot de passe si code valide
            timerValidCode = window.localStorage.getItem("timerV");
            const response = await fetch(`http://localhost:8080/api/signup/${email}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const responseId = await response.json();

            //on remet à zero le timer de validatioon de code
            clearTimeout(timerValidCode);
            //on compare le code de depart et celui entré
            const password = event.target.password.value;
            const repassword = event.target.repassword.value;
            const codeValid = event.target.code.value;
            if(password !== repassword){
                alert("mot de passe et validation de mot de passe différents");
                event.target.password.value="";
                event.target.repassword.value="";
                cancelValid();
            } else {
            //si le code est ok, on met en bdd le nouveau mot de passe
                const responseCode = await fetch("http://localhost:8080/api/code",{
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        password,
                        codeValid,
                        id:responseId.id
                    })
                })
                if(responseCode){
                    if(responseCode.status>=400){
                        const erreur = await responseCode.json();
                        if((erreur.message)==undefined){
                            alert(erreur[0].message);
                            cancelValid();
                        } else {
                            alert(erreur.message);
                            cancelValid();
                        }
                    } else {
                    const responseSignData = await responseCode.json();
                    alert("nouveau MOT DE PASSE enregistré");
                    // on obtient ici le token... à voir si on peut en avoir besoin par la suite
                    // mais vu qu'il faut que le compte soit validé par un admin pour etre actif...
                    // mais sait-on jamais si une nouvelle fonctionnalité n'ayant pas besoin de validation est implantée...
                    navigate('/');
                    }
                }
            }
        }
        if(loginModify & !codeSend){
            // event.preventDefault();
            let email = event.target.email.value;
            let message = true;
            let sujet = "code valable 3min";
            // appel fetch pour voir l'existence de l'adresse mail et valider la suite (à créer)
            const response = await fetch(`http://localhost:8080/api/signup/${email}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const responseId = await response.json();
            if(!responseId.id){
                setNoEmail(true);
            }else{
                const responseCode = await fetch('http://localhost:8080/api/code',{
                    method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message,
                    id: responseId.id
                })
            })
                setNoEmail(false);
            // reste à créer les conditions suivant l'appel fetch
            if (email && message && sujet){
                //traitement envoi email//
                const emailSender = await fetch("http://localhost:8080/api/emailcode",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        sujet,
                        id: responseId.id
                    })
                })
            setCodeSend(true);

            timerValidCode =(setTimeout(async()=>{
                const responseCode = await fetch('http://localhost:8080/api/code',{
                    method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message:false,
                    id: responseId.id
                })
            })
                setCodeSend(false);
                setAuthPassModify(false);
                setTempsDepasse(true);
            },180000));
            window.localStorage.setItem("timerV",timerValidCode);
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
                    <button className="passModifyBtn red" onClick={handlePassModify}>Mot de passe perdu/oublié/à changer</button>
                    </>
                    }                    
                </form>
            </main>
        </>
    )
}

export default Login;