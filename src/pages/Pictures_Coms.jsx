import {useState, useEffect} from "react";
import jwtDecode from "jwt-decode";

const PicturesComs = ()=>{

    const serverBack = "http://localhost:8080";
    const objectJSON = window.localStorage.getItem("parent");
    const object = objectJSON && JSON.parse(objectJSON);
    const jwtData = window.localStorage.getItem("jwt");
    let responseCom = false;
    let oldTarget= null;
    // if(jwtData){
        const jwt = jwtDecode(jwtData);
    // }
    const [comsData,setComsData] = useState ([]);

    useEffect(()=>{
        (async() => {
        let coms = [];
        let allComs = [];
        const parentComs = await fetch(serverBack+"/api/coms/?picture="+object.object.id_pic,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
        }});
        if(parentComs.status<400){
            coms = await parentComs.json();
            coms.map(async(data)=>{
                const childComs = await fetch(serverBack+"/api/coms/?picture="+object.object.id_pic+"&parent="+data.id_com,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+jwtData
                }});
                if(childComs.status<400){
                    const childDatas = await childComs.json();
                    // const comsArray= coms.concat(childDatas);
                    allComs= allComs.concat([data],childDatas);
                    console.log("tous les sous coms",allComs);
                    setComsData(allComs);
                } else {
                    allComs=allComs.concat([data]);
                    console.log("juste les coms",allComs);
                    setComsData(allComs);
                }
            })
        }
    })()
    },[])
    useEffect(()=>{

    },[comsData])

    const handleComSubmit = async(event)=>{
        event.preventDefault();
        console.log(event.target.commentaire.value);
        const id_parent = null;
        const user_id = jwt.id;
        const coms = event.target.commentaire.value;
        const news_id = null;
        const event_id = null;
        const photo_id = object.object.id_pic

        const response = await fetch(serverBack+"/api/coms",{
            method: "PUT",
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+jwtData
            },
            body: JSON.stringify({
                id_parent,
                user_id,
                coms,
                news_id,
                event_id,
                photo_id
            })
        });
        console.log("status:",response.status)
        if(response.status<400){
            const responseData = response.json();
            setComsData(responseData)
        }
    }
    const comClick = (data,event)=>{
        event.preventDefault();
        console.log("evenement",event);
        if(responseCom && oldTarget===event.target){
            responseCom=false;
            document.querySelector('.inputCom').setAttribute("placeholder","laissez votre commentaire");
            oldTarget.style.backgroundColor="blue";
            oldTarget=null;
        } else if(!responseCom && !oldTarget){
            responseCom=true;
            document.querySelector('.inputCom').setAttribute("placeholder","Réponse au commentaire");
            event.target.style.backgroundColor="red";
            oldTarget = event.target;
        }
        if(responseCom && oldTarget!==event.target){
            oldTarget.style.backgroundColor="blue";
            event.target.style.backgroundColor="red";
            oldTarget=event.target;
        }
        
    }
    return(
        <main className="pictComs">
            <form className="pComs" onSubmit={handleComSubmit}>
                <input type="text" name="commentaire" className="inputCom" placeholder="laissez votre commentaire" ></input>
                <button type="submit">envoyer</button>
            </form>
            <img className="imgComs" src={serverBack +"/uploads/"+ object.object.picture} alt={object.object.picture} height="150px" width="300px"/>
            {console.log("comsData",comsData,comsData.length)}
            {comsData.length>0 && comsData.map((data)=>{
                return(
                    <>
                        <div  key={data.id_com} className="parent text">
                            <p>{data.coms}</p>
                        </div>
                        <div className="comContenair">
                            <p className="comReaction text">Réaction</p>
                            <p className="comCommentaire text" onClick={(event)=>comClick(data,event)}>Répondre</p>
                        </div>
                    </>
                )

            })}
        </main>
    )
}

export default PicturesComs;