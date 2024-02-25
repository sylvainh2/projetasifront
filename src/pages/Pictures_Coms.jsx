import {useState, useEffect} from "react";
import jwtDecode from "jwt-decode";
import ParentComDisplay from "../components/ParentComDisplay";
import ChildComDisplay from "../components/ChildComDisplay";

const PicturesComs = ()=>{

    const serverBack = "http://localhost:8080";
    const objectJSON = window.localStorage.getItem("parent");
    const object = objectJSON && JSON.parse(objectJSON);
    const jwtData = window.localStorage.getItem("jwt");
    let responseCom = false;
    let oldTarget= null;
    let idParentContainer=null;
    let modify=false;
    let idModify=null;
    let reaction=[];
    let oldChar=[];
    let oldIndex=null;
    let oldModifyTarget=null;
    let oldReaction=null;
    let index=null;
    // if(jwtData){
        const jwt = jwtDecode(jwtData);
        console.log("jwt",jwt)
    // }
    const [comsData,setComsData] = useState ([]);
    const idConnected=jwt.id;
    const roleConnected=jwt.roles;
    const validityConnected=jwt.validity;
    // const [reactionDisp,setReactionDisp] = useState ("Réaction");

    async function getAllComs(){
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
    }

    useEffect(()=>{
        (async() => {
            await getAllComs();
    })()
    },[])

    const handleComSubmit = async(event)=>{
        event.preventDefault();
        console.log(event.target.commentaire.value);
        if(event.target.commentaire.value.length>0){
            let id_parent = null;
            if(responseCom){
                id_parent = idParentContainer
            } else {
                id_parent = null;
    
            }
            const user_id = jwt.id;
            const coms = event.target.commentaire.value;
            const news_id = null;
            const event_id = null;
            const photo_id = object.object.id_pic
            console.log("responseCom",responseCom,modify)
            if(modify===false){
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
                idParentContainer=null;
                console.log("status:",response.status)
                if(response.status<400){
                    event.target.commentaire.value="";
                    const responseData = await response.json();
                    await getAllComs();
                }
                if(responseCom && oldTarget){
                    oldTarget.style.backgroundColor="rgb(68, 144, 231)";
                    document.querySelector('.inputCom').setAttribute("placeholder","laissez votre commentaire");
                    responseCom=false;
                    oldTarget=null;
                }
            }
            if(modify===true){
                const response = await fetch(serverBack+"/api/coms/"+idModify,{
                    method: "PATCH",
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
                idParentContainer=null;
                console.log("status:",response.status)
                if(response.status<400){
                    event.target.commentaire.value="";
                    document.querySelector('.inputCom').setAttribute("placeholder","laissez votre commentaire");
                    oldTarget=null;
                    modify=false;
                    const responseData = await response.json();
                    await getAllComs();
                }
            }
        }
    }
    const comClick = (data,event)=>{
        event.preventDefault();
        console.log("evenement",event);
        //on met à zero le système de modification du commentaire et de reaction
        if(index>=0){
            console.log("modify ok")
            if(oldReaction && oldChar[index]!=="comReaction text"){
                oldReaction.innerHTML="Réaction "+'<i class="'+reaction[index]+'"></i>';
                oldChar[index] = reaction[index];
                // oldIndex=null;
            }
        }
        if(modify){
            document.querySelector('.inputCom').value="";
            document.querySelector('.inputCom').setAttribute("placeholder","laisser votre commentaire");
            oldModifyTarget.style.color="grey";
            idModify=null;
        }
        if(responseCom && oldTarget===event.target){
            responseCom=false;
            document.querySelector('.inputCom').setAttribute("placeholder","laissez votre commentaire");
            oldTarget.style.backgroundColor="rgb(68, 144, 231)";
            oldTarget=null;
            idParentContainer=null;
        } else if(!responseCom && !oldTarget){
            responseCom=true;
            document.querySelector('.inputCom').setAttribute("placeholder","Réponse au commentaire");
            event.target.style.backgroundColor="red";
            oldTarget = event.target;
            idParentContainer=data.id_com;
        }
        if(responseCom && oldTarget!==event.target){
            oldTarget.style.backgroundColor="rgb(68, 144, 231)";
            event.target.style.backgroundColor="red";
            oldTarget=event.target;
            idParentContainer=data.id_com;
        }
        console.log("id_com",idParentContainer);
    }
    const modifyClick = async(data,event)=>{
        event.preventDefault();
        console.log("modify",oldReaction,index,oldChar[index],reaction)
        if(index>=0){
            console.log("modify ok")
            if(oldReaction && oldChar[index]!=="comReaction text"){
                oldReaction.innerHTML="Réaction "+'<i class="'+reaction[index]+'"></i>';
                oldChar[index] = reaction[index];
                // oldIndex=null;
            }
        }
        console.log("mod clic",oldModifyTarget,modify)
        console.log("mod clac",(oldModifyTarget!==event.target))
        // remise à zero reponse et mise en place de modification
        console.log("oldtarget",oldTarget)
        if(responseCom && oldTarget){
            oldTarget.style.backgroundColor="rgb(68, 144, 231)";
            responseCom=false;
            oldTarget=null;
        }
        if(oldModifyTarget!==event.target && modify && oldModifyTarget){
            oldModifyTarget.style.color="grey";
            event.target.style.color="red";
            oldModifyTarget=event.target;
            modify=!modify;
        }
        console.log(event.target,data.id_com,data);
        modify=!modify;
        if(modify){
            document.querySelector('.inputCom').value=data.coms;
            document.querySelector('.inputCom').setAttribute("placeholder","modifier votre commentaire");
            event.target.style.color="red";
            idModify=data.id_com;
            oldModifyTarget=event.target;
        } else {
            document.querySelector('.inputCom').value="";
            document.querySelector('.inputCom').setAttribute("placeholder","laisser votre commentaire");
            event.target.style.color="grey";
            idModify=null;
        }
    }
    // const reactOver = (event)=>{
    //     // event.preventDefault();
    //     // console.log(event.target);
    //     reaction=event.target;
    //     reactionHtml = reaction.innerHTML;
    //     event.target.innerHTML='<i class="fa-solid fa-thumbs-up iconeR"></i><i class="fa-solid fa-heart iconeRR"></i><i class="fa-solid fa-face-grin-tears iconeR"></i><i class="fa-solid fa-face-surprise iconeR"></i><i class="fa-solid fa-face-sad-tear iconeR"></i><i class="fa-sharp fa-solid fa-face-angry iconeR"></i>';
    // }
    // const reactOut = (event)=>{
    //     // event.preventDefault();
    //     // console.log(event.target);
    //     reaction.innerHTML=reactionHtml;
    // }
    const reactSubmit = (data,event)=>{
        event.preventDefault();
        const reactions = {
            "fa-solid fa-thumbs-up iconeR":"pouce",
            "fa-solid fa-heart iconeRR":"coeur",
            "fa-solid fa-face-grin-tears iconeR":"rire",
            "fa-solid fa-face-surprise iconeR":"surprise",
            "fa-solid fa-face-sad-tear iconeR":"pleurs",
            "fa-sharp fa-solid fa-face-angry iconeR":"colère"
        }
        // console.log(event.target.className);
        // console.log(data);
        const reactionChar = event.target.className;
        //on remet à zero le système de réponse au commentaire
        // console.log("oldtargetcomp",responseCom && oldTarget);
        // console.log("oldtarget",oldTarget);
        if(responseCom && oldTarget){
            oldTarget.style.backgroundColor="rgb(68, 144, 231)";
            document.querySelector('.inputCom').value="";
            document.querySelector('.inputCom').setAttribute("placeholder","laisser votre commentaire");
            responseCom=false;
            oldTarget=null;
        }
        if(modify){
            document.querySelector('.inputCom').value="";
            document.querySelector('.inputCom').setAttribute("placeholder","laisser votre commentaire");
            oldModifyTarget.style.color="grey";
            idModify=null;
        }
        // console.log(reactionChar);
        index = comsData.findIndex((el)=>el.id_com===data.id_com);
        console.log("old",oldIndex,"index",index);
        console.log("reactionOld",reaction[oldIndex]);
        if(oldReaction && oldChar[oldIndex]!=="comReaction text" && oldIndex!=index){
            console.log("on remet l'ancien")
            oldReaction.innerHTML="Réaction "+'<i class="'+reaction[oldIndex]+'"></i>';
            oldChar[oldIndex] = reaction[oldIndex];
            oldIndex=index;
        }
        if(!oldIndex || oldIndex==index){
            oldReaction = event.target;
            if(!(oldChar[index]) && (!oldIndex)){
                console.log("pas de old"); 
                event.target.innerHTML='Réaction <i class="fa-solid fa-thumbs-up iconeR"></i><i class="fa-solid fa-heart iconeRR"></i><i class="fa-solid fa-face-grin-tears iconeR"></i><i class="fa-solid fa-face-surprise iconeR"></i><i class="fa-solid fa-face-sad-tear iconeR"></i><i class="fa-sharp fa-solid fa-face-angry iconeR"></i>';
                oldChar[index] = "all";
                oldIndex = index;
            } else if(oldChar[index]==="all" && reactionChar==="comReaction text"){
                if(!reaction[index]){
                    console.log("on remet en pas de old");
                    event.target.innerHTML="Réaction";
                    oldChar[index] = null;
                    // oldIndex = null;
                }else if(reaction[index]){
                    console.log("on reaffiche la reaction");
                    event.target.innerHTML="Réaction "+'<i class="'+reaction[index]+'"></i>';
                    oldChar[index] = reaction[index];
                    // oldIndex=null;
                }
            } else if(oldChar[index] === "all" && reactionChar!=="comReaction text" && oldChar[index]!==reactionChar){
                //on ecrira la reaction en BDD et à l'ecran
                console.log("on ecrit le reaction",event.target);
                event.target.parentNode.innerHTML="Réaction "+'<i class="'+reactionChar+'"></i>';
                oldChar[index]=reactionChar;
                // oldIndex = null;
                reaction[index]=reactionChar;
            } else if(oldChar[index]!=="all" && reactionChar==="comReaction text"){
                console.log("on modifie la reaction");
                event.target.innerHTML='Réaction <i class="fa-solid fa-thumbs-up iconeR"></i><i class="fa-solid fa-heart iconeRR"></i><i class="fa-solid fa-face-grin-tears iconeR"></i><i class="fa-solid fa-face-surprise iconeR"></i><i class="fa-solid fa-face-sad-tear iconeR"></i><i class="fa-sharp fa-solid fa-face-angry iconeR"></i>';
                oldChar[index]="all";
                oldIndex = index;
            } else if(oldChar[index]!=="all" && oldChar[index]===reactionChar){
                // on affiche toutes les reactions possibles à l'endroit cliqué et on dévalide les 
                // anciennes reactions à l'endroit cliqué précédement.
                console.log("on annule la reaction");
                event.target.parentNode.innerHTML="Réaction";
                oldChar[index] = null;
                // oldIndex = null;
                reaction[index]=null;
            }
        }
    }
    const deleteClick = async(data,event)=>{
        event.preventDefault();
        console.log(event.target,data.id_com,data);
        // il faudra ici effacer les commentaires enfants puis le commentaire parent
        // pour des raisons de praticité et d'économie de requêtes on fera ça en back
        let supComChild = window.confirm("êtes vous sûr de vouloir supprimer ce commentaire et ses réponses?");
        if(supComChild){
            const response = await fetch(serverBack+"/api/coms/?com="+data.id_com+"&picture="+data.photo_id+"&react="+data.reaction_id,{
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })
            if(response.status<400){
                await getAllComs();
            }
        }
    }
    const deleteChildClick = async(data,event)=>{
        event.preventDefault();
        console.log(event.target,data.id_com,data);
        let supComChild = window.confirm("êtes vous sûr de vouloir supprimer ce commentaire?");
        if(supComChild){
            const response = await fetch(serverBack+"/api/coms/?com="+data.id_com+"&picture=null&react="+data.reaction_id,{
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+jwtData
                }
            })
            if(response.status<400){
                await getAllComs();
            }
        }
    }
    return(
        <main className="pictComs">
            <form className="pComs" onSubmit={handleComSubmit}>
                <input type="text" name="commentaire" className="inputCom" placeholder="laissez votre commentaire" autoFocus ></input>
                <button type="submit">envoyer</button>
            </form>
            <img className="imgComs" src={serverBack +"/uploads/"+ object.object.picture} alt={object.object.picture} height="150px" width="300px"/>
            {console.log("comsData",comsData,comsData.length)}
            {comsData.length>0 && comsData.map((data)=>{
                return(
                    <>
                        {data.id_parent===null &&
                            <ParentComDisplay data={data} reactSubmit={reactSubmit} comClick={comClick} modifyClick={modifyClick} deleteClick={deleteClick} idConnected={idConnected} roleConnected={roleConnected} validityConnected={validityConnected} />
                        //     <>
                        //     <p className="parentCom text" key={data.id_com}>{data.name} {data.first_name}</p>
                        //     <div className="parent text">
                        //         <p>{data.coms}</p>
                        //     </div>
                        //     <div className="comContenair">
                        //         <p className="comReaction text" onClick={(event)=>reactSubmit(data,event)}>Réaction</p>
                        //         <p className="comCommentaire text" onClick={(event)=>comClick(data,event)}>Répondre</p>
                        //     </div>
                        //     <div className="icone_coms">
                        //         {console.log("recherche",idConnected===data.user_id,validityConnected==="1",roleConnected==="admin",data.user_id)}
                        //         {(idConnected===data.user_id && validityConnected==="1") &&
                        //         <>
                        //         <i className="fa-solid fa-pen text" onClick={(event)=>modifyClick(data,event)}></i>
                        //         </>
                        //         }
                        //         <span></span>
                        //         {(roleConnected==="admin" || idConnected===data.user_id) &&
                        //         <i className="fa-solid fa-trash text" onClick={(event)=>deleteClick(data,event)}></i>
                        //         }
                        //     </div>
                        // </>
                        }
                        {data.id_parent!==null &&
                            <ChildComDisplay data={data} reactSubmit={reactSubmit} modifyClick={modifyClick} deleteChildClick={deleteChildClick} idConnected={idConnected} roleConnected={roleConnected} validityConnected={validityConnected} />
                        //     <>
                        //     <p className="parentCom text tabul" key={data.id_com}>{data.name} {data.first_name}</p>
                        //     <div className="parent text tabul">
                        //         <p>{data.coms}</p>
                        //     </div>
                        //     <div className="comContenairChild">
                        //         <p className="comReaction text" onClick={(event)=>reactSubmit(data,event)}>Réaction</p>
                        //         <div>
                        //         {idConnected===data.user_id && validityConnected==="1"?
                        //             <i className="fa-solid fa-pen text" onClick={(event)=>modifyClick(data,event)}></i>:
                        //             null
                        //         }
                        //         <span></span>
                        //         {roleConnected==="admin" || idConnected===data.user_id?
                        //         <i className="fa-solid fa-trash text" onClick={(event)=>deleteChildClick(data,event)}></i>:
                        //         null
                        //         }
                        //         </div>
                        //     </div>
                        // </>
                        }
                    </>
                )

            })}
        </main>
    )
}

export default PicturesComs;