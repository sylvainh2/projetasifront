import { useRef } from "react";

const ModaleInscription = ({modaleInscript,imageCert,certPicture,gestModaleMedicale,dataModale})=>{
    const dialogInscript = useRef(null);
    const dialogI = dialogInscript.current;
    if ((modaleInscript>0)) {
        dialogI?.showModal(); // 👈 usage propre à l'élément <dialog>
    } else {
        dialogI?.close(); // 👈 usage propre à l'élément <dialog>
    }
    return(
        <>
            <dialog ref={dialogInscript} className="modale">
                <button onClick={(event)=>gestModaleMedicale(event,dataModale)}>Je valide le certificat</button>
                <span></span>
                <button onClick={(event)=>gestModaleMedicale(event,dataModale)}>Je ne valide pas</button>
            <div className="prevCont">
                {imageCert?
                    <img className="previewC" src={certPicture} />:
                    <iframe className="previewC" src={certPicture} />
                }
            </div>
            </dialog>
        </>
    )
}

export default ModaleInscription;