const GestProfil = ({gest, gestProfile})=>{
    return(
        <>
            <div className="profileCont">
                {gest.map((profile)=>{
                    return(
                        <div className="profileGest" key={profile.id}>
                            <div className="profCont">
                                <p className="namelist">{profile.name}</p>
                                <p className="namelist">{profile.first_name}</p>
                            </div>
                            <div className="profContVal">
                                {profile.validity==0?
                                <button onClick={(event)=>gestProfile(profile,event)} className="profVal" type="button" name="invalide">invalidé</button>:
                                <button onClick={(event)=>gestProfile(profile,event)} className="profInv" type="button" name="valide">validé</button>
                                }
                            </div>
                            <div className="profContVal">
                                {profile.roles==="admin"?
                                <button onClick={(event)=>gestProfile(profile,event)} className="profAdm" type="button" name="admin">{profile.roles}</button>:
                                <button onClick={(event)=>gestProfile(profile,event)} className="profUse" type="button" name="user">{profile.roles}</button>
                                }
                            </div>
                            <div className="profCont-cpi">
                                {(profile.inscription && JSON.parse(profile.inscription).med) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi medical greenbg" type="button" name="medical"><i className="fa-sharp fa-solid fa-file-medical"></i></button>
                                }
                                {(profile.inscription && !(JSON.parse(profile.inscription).med)) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi medical whitebg" type="button" name="medical"><i className="fa-sharp fa-solid fa-file-medical"></i></button>
                                }
                                {(!(profile.inscription) || profile.inscription.length===0) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi medical whitebg" type="button" name="medical"><i className="fa-sharp fa-solid fa-file-medical"></i></button>
                                }
                                {(profile.inscription && JSON.parse(profile.inscription).ins) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi inscription greenbg" type="button" name="inscription"><i className="fa-solid fa-file-contract"></i></button>
                                }
                                {(profile.inscription && !(JSON.parse(profile.inscription).ins)) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi inscription whitebg" type="button" name="inscription"><i className="fa-solid fa-file-contract"></i></button>
                                }
                                {(!(profile.inscription) || profile.inscription.length===0) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi inscription whitebg" type="button" name="inscription"><i className="fa-solid fa-file-contract"></i></button>
                                }
                                {(profile.inscription && JSON.parse(profile.inscription).pay) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi paiement greenbg" type="button" name="paiement"><i className="fa-solid fa-euro-sign"></i></button>
                                }
                                {(profile.inscription && !(JSON.parse(profile.inscription).pay)) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi paiement whitebg" type="button" name="paiement"><i className="fa-solid fa-euro-sign"></i></button>
                                }
                                {(!(profile.inscription) || profile.inscription.length===0) &&
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpi paiement whitebg" type="button" name="paiement"><i className="fa-solid fa-euro-sign"></i></button>
                                }
                            </div>
                            <div className="profCont-trash">
                                <button onClick={(event)=>gestProfile(profile,event)} className="cpitrash" type="button" name="trash"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
export default GestProfil;