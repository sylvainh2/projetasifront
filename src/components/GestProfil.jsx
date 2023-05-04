const GestProfil = ({gest, gestProfile})=>{
    return(
        <>
            <div className="profileCont">
                {gest.map((profile)=>{
                    return(
                        <div className="profileGest" key={profile.id} onClick={gestProfile}>
                            <div className="profCont">
                                <p>{profile.name}</p>
                            {/* </div> */}
                            {/* <div className="profCont"> */}
                                <p>{profile.first_name}</p>
                            </div>
                            <div className="profContVal">
                                {profile.validity==0?
                                <button className="profVal" type="button" name="invalide">invalidé</button>:
                                <button className="profInv" type="button" name="valide">validé</button>
                                }
                            </div>
                            <div className="profContVal">
                                {profile.roles==="admin"?
                                <button className="profAdm" type="button" name="admin">{profile.roles}</button>:
                                <button className="profUse" type="button" name="user">{profile.roles}</button>
                                }
                            </div>
                            <div className="profCont-cpi">
                                <div className="cpi"><i class="fa-sharp fa-solid fa-file-medical"></i></div>
                                {/* <div className="cpi"><i class="fa-solid fa-euro-sign"></i></div> */}
                                <div className="cpi"><i class="fa-solid fa-file-contract"></i></div>
                            </div>
                            <div className="profCont-trash">
                                <button type="button" name="trash"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
export default GestProfil;