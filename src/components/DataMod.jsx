const DataMod = ({handleSubmitModify, responseData})=>{
    return(
        <>
            <form className="modifyForm" id="formulaire" onSubmit={handleSubmitModify}>
                <input className="userInpForm" type="text" name="nameMod" defaultValue={responseData.name} />
                <input className="userInpForm" type="text" name="first_nameMod" defaultValue={responseData.first_name} />
                <input className="userInpForm" type="date" name="birthdateMod" defaultValue={responseData.birthdate} />
                <textarea className="userInpForm textA" cols="50" rows="3" type="text" name="addressMod" defaultValue={responseData.address} />
                <input className="userInpForm" type="text" name="postcodeMod" defaultValue={responseData.postcode} />
                <input className="userInpForm" type="text" name="cityMod" defaultValue={responseData.city} />
                <input className="userInpForm" type="text" name="telMod" defaultValue={responseData.tel} />
                <label className="userInpForm userShareInf" >Partage des informations personnelles</label>
                <input className="userInpForm" type="checkbox" name="share_infosMod" defaultChecked={responseData.share_infos} />
                {/* <label className="userInpForm">Password</label> */}
                {/* <input type="password" name="passwordMod" defaultValue="" /> */}
                <button className="userInpForm uIFBtn" type="submit">ENVOYER</button>
            </form>
        </>
    )
}
export default DataMod;