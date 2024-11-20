const Result = ({resultDisp, resultGest, courseForm, handleSubmitCourse, handleCourseTrash, cinq, dix, semi, marathon})=>{
    function format(dateForm) {
        let options = {day:'numeric',month:'numeric', year:'numeric'};
        return new Date(dateForm).toLocaleDateString([],options);
    }
    return(
        <>
            <section className="courseCont csMarg">
                <div>
                    <div>5km : {cinq.temps}</div>
                    <div>10km: {dix.temps}</div>
                </div>
                <div className="courseButCont">
                    {/* <div className="courseButton">Records</div> */}
                    {/* <div className="courseButton">Courses</div> */}
                    <button onClick={resultGest} className="courseButton">Enregistrer Course</button>
                </div>
                <div>
                    <div>semi: {semi.temps}</div>
                    <div>marathon: {marathon.temps}</div>
                </div>
            </section>
            <section className="courseCont ccMarg">
            {courseForm==="Enregistrer Course" &&
                <form className="resultForm" onSubmit={handleSubmitCourse}>
                    <label>Date</label>
                    <input type="date" name="date"></input>
                    <label>Course</label>
                    <input type="text" name="course"></input>
                    <label>Temps</label>
                    <input type="time" name="temps" step="1"></input>
                    <label>Distance</label>
                    <input type="number" name="distance" step="0.001"></input>
                    <button type="submit">Entrer</button>
                </form>
            }
            </section>
            <section className="sectionCourse">
                <article className="runArray rTitle">
                    <p className="runColumn grad">Date</p>
                    <p className="runColumn grad">Course</p>
                    <p className="runColumn grad">Temps</p>
                    <p className="runColumn grad">Distance (kms)</p>
                </article>
                {resultDisp.map((data)=>{
                    return(
                    <article className="runArray" key={data.id_runs}>
                        <p className="runColumn">{format(data.datecourse)}</p>
                        <p className="runColumn">{data.name}</p>
                        {((data.temps===cinq.temps) || (data.temps===dix.temps) || (data.temps===semi.temps) || (data.temps===marathon.temps))?
                        <p className="runColumn red">{data.temps}</p>:
                        <p className="runColumn">{data.temps}</p>
                    }
                        <p className="runColumn relatif">{data.distance+" Km(s)"}
                        <button onClick={(event)=>handleCourseTrash(data, event)} className="runTrashColumn absolut"><i className="fa-solid fa-trash"></i></button></p>
                    </article>
                    )})
                }
            </section>
        </>
    )
}
export default Result;