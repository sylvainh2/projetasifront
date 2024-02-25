const ParentComDisplay = ({data, reactSubmit, comClick, modifyClick, deleteClick,idConnected, roleConnected, validityConnected })=>{
    return(
        <>
        <p className="parentCom text" key={data.id_com}>{data.name} {data.first_name}</p>
        <div className="parent text">
            <p>{data.coms}</p>
        </div>
        <div className="comContenair">
            <p className="comReaction text" onClick={(event)=>reactSubmit(data,event)}>Réaction</p>
            <p className="comCommentaire text" onClick={(event)=>comClick(data,event)}>Répondre</p>
        </div>
        <div className="icone_coms">
            {console.log("recherche",idConnected===data.user_id,validityConnected==="1",roleConnected==="admin",data.user_id)}
            {(idConnected===data.user_id && validityConnected==="1") &&
            <>
            <i className="fa-solid fa-pen text" onClick={(event)=>modifyClick(data,event)}></i>
            </>
            }
            <span></span>
            {(roleConnected==="admin" || idConnected===data.user_id) &&
            <i className="fa-solid fa-trash text" onClick={(event)=>deleteClick(data,event)}></i>
            }
        </div>
    </>
    );
}
export default ParentComDisplay;