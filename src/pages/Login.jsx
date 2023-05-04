import { useEffect , useState } from "react";
import { useNavigate } from "react-router";

function Login() {

    const [error, setError] = useState(null);


    const navigate = useNavigate();
    useEffect(()=>{
        const connectData = window.localStorage.getItem("connect");
        if(connectData === "déconnexion"){
            window.localStorage.clear("connect");
            window.localStorage.clear("jwt");
            navigate('/');
        }
    });
    const handleSubmitAuth = async (event)=>{
        event.preventDefault();
        const email = event.target.email.value;
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

    }

    return(
        <>
            <main className="login">
                <form className="loginForm" onSubmit={handleSubmitAuth}>
                    <label className="inputLog">email:</label>
                    <input className="inputLog" type="text" name="email" />
                    <label className="inputLog">password:</label>
                    <input className="inputLog" type="password" name="password" />
                    <button className="loginBtn inputLog">Connexion</button>
                </form>
                
            </main>
        </>
    )
}

export default Login;