const ProfilAction = ({handleSubmitUser, role})=>{
    return(
        <>
            {/* <form onChange={handleSubmitUser}>
                <label className="userform" htmlFor="userdemand">Action sur profil</label>
                <select className="userform" type="text" name="userDemand" id="userdemand">
                    <option className="opForm" value="">--------Votre Choix--------</option>
                    <option className="opForm" value="Modifier vos données">Modifier vos données</option>
                    <option className="opForm" value="Modifier photo de profil">Modifier photo de profil</option>
                    <option className="opForm" value="Ajouter certificat médical">Ajouter certificat médical</option>
                    <option className="opForm" value="Rechercher un adhérent">Rechercher un adhérent</option>
                    <option className="opForm" value="Trombinoscope">Trombinoscope</option>
                    {role=="admin" &&
                        <>
                            <option className="opForm" value="______________________" disabled></option>
                            <option className="opForm" value="Gestion des profils">Gestion des profils</option>
                        </>
                    }
                </select>
                <button className="userform" type="submit">Ok</button>
            </form> */}
            <div className="userformContainer">
                <button className="userButton" onClick={handleSubmitUser}>Modifier vos données</button>
                <button className="userButton" onClick={handleSubmitUser}>Modifier photo de profil</button>
                <button className="userButton" onClick={handleSubmitUser}>Ajouter certificat médical</button>
                <button className="userButton" onClick={handleSubmitUser}>Rechercher un adhérent</button>
                <button className="userButton" onClick={handleSubmitUser}>Trombinoscope</button>
                {role=="admin" &&
                <>
                    <button className="adminformContainer userButton" onClick={handleSubmitUser}>Gestion des profils</button>
                </>}
            </div>
        </>
    )
}
export default ProfilAction;