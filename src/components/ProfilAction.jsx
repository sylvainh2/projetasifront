const ProfilAction = ({handleSubmitUser, role, validityDisplay})=>{
    return(
        <>
            <div className="userformContainer">
                <button className="userButton" onClick={handleSubmitUser}>Modifier vos données</button>
                <button className="userButton" onClick={handleSubmitUser}>Modifier photo de profil</button>
                <button className="userButton" onClick={handleSubmitUser}>Ajouter certificat médical</button>
                <button className="userButton" onClick={handleSubmitUser}>Ajouter dossier inscription</button>
                <button className="userButton" onClick={handleSubmitUser}>Mes résultats</button>
                {validityDisplay &&
                <>
                    <button className="userButton" onClick={handleSubmitUser}>Rechercher un adhérent</button>
                    <button className="userButton" onClick={handleSubmitUser}>Trombinoscope</button>
                </>
                }
                {role=="admin" &&
                <>
                    <button className="adminformContainer userButton" onClick={handleSubmitUser}>Gestion des profils</button>
                </>}
            </div>
        </>
    )
}
export default ProfilAction;