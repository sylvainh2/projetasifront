const ChildComDisplay = ({data, reactSubmit, modifyClick, deleteChildClick,idConnected, roleConnected, validityConnected})=>{
    return(
        <>
            <p className="parentCom text tabul" key={data.id_com}>{data.name} {data.first_name}</p>
            <div className="parent text tabul">
                <p>{data.coms}</p>
            </div>
            <div className="comContenairChild">
                <p className="comReaction text" onClick={(event)=>reactSubmit(data,event)}>Réaction</p>
                <div>
                {idConnected===data.user_id && validityConnected==="1"?
                    <i className="fa-solid fa-pen text" onClick={(event)=>modifyClick(data,event)}></i>:
                    null
                }
                <span></span>
                {roleConnected==="admin" || idConnected===data.user_id?
                <i className="fa-solid fa-trash text" onClick={(event)=>deleteChildClick(data,event)}></i>:
                null
                }
                </div>
            </div>
        </>
    )
}
export default ChildComDisplay;