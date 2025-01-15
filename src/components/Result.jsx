import {useRef} from "react";
const Result = ({resultDisp, resultGest, courseForm, handleSubmitCourse, handleCourseTrash, cinq, dix, semi, marathon, modale, dataModale})=>{
    const dialogRef = useRef(null)
    const dialog = dialogRef.current;
    if ((modale===true)) {
        dialog?.showModal(); // 👈 usage propre à l'élément <dialog>
    } else {
        dialog?.close(); // 👈 usage propre à l'élément <dialog>
    }
    function format(dateForm) {
        let options = {day:'numeric',month:'numeric', year:'numeric'};
        return new Date(dateForm).toLocaleDateString([],options);
    }
    return(
        <>
            <section className="courseCont csMarg blue">
                <div className="comic bold blue padDG bordG">
                    <div>5km : {cinq.temps}</div>
                    <div>10km: {dix.temps}</div>
                </div>
                <div className="courseButCont">
                    {/* <div className="courseButton">Records</div> */}
                    {/* <div className="courseButton">Courses</div> */}
                    <button onClick={resultGest} className="courseButton">Enregistrer Course</button>
                </div>
                <div className="comic bold blue padDG bordG">
                    <div>semi: {semi.temps}</div>
                    <div>marathon: {marathon.temps}</div>
                </div>
            </section>
            <>
            {courseForm==="Enregistrer Course" &&
            <section className="courseCont ccMarg blue">
                <form className="resultForm" onSubmit={handleSubmitCourse}>
                    <label>Date</label>
                    <input type="date" name="date"></input>
                    <label>Course</label>
                    <input type="text" name="course"></input>
                    <label>Temps</label>
                    <input type="time" name="temps" step="1"></input>
                    <label>Distance</label>
                    <input type="search" name="distance" step="0.001" list="distanceList" placeholder="click / double click"></input>
                    <datalist id="distanceList">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="21.1">21.1 (semi)</option>
                        <option value="42.195">42.195 (marathon)</option>
                    </datalist>
                    <button type="submit">Entrer</button>
                </form>
            </section>
            }
            </>
            <section className="sectionCourse ccMarg">
                <dialog ref={dialogRef}>
                    <p>Etes vous sûr de vouloir effacer cette course</p>
                    <button onClick={(event)=>handleCourseTrash(dataModale,event)}>Oui</button><span></span>
                    <button onClick={(event)=>handleCourseTrash(dataModale,event)}>Annuler</button>
                </dialog>               
                <article className="runArray rTitle">
                    <p className="runColumn grad">Date</p>
                    <p className="runColumn grad">Course</p>
                    <p className="runColumn grad">Temps</p>
                    <p className="runColumn grad">Distance (kms)</p>
                </article>
                {resultDisp.map((data)=>{
                    return(
                    <article className="runArray" key={data.id_runs}>
                        <p className="runColumn grey">{format(data.datecourse)}</p>
                        <p className="runColumn grey">{data.name}</p>
                        {((data.temps===cinq.temps) || (data.temps===dix.temps) || (data.temps===semi.temps) || (data.temps===marathon.temps))?
                        <p className="runColumn red">{data.temps}</p>:
                        <p className="runColumn grey">{data.temps}</p>
                    }
                        <p className="runColumn relatif grey">{data.distance+" Km(s)"}
                        <button onClick={(event)=>handleCourseTrash(data, event)} className="runTrashColumn absolut"><i className="fa-solid fa-trash"></i></button></p>
                    </article>
                    )})
                }
            </section>
        </>
    )
}
export default Result;