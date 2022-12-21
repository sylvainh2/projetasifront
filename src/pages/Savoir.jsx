import { Link } from "react-router-dom";

function Savoir() {


    return(

        <>
            <div className="savoirMainContent">
                <h2 className="savoirTitre">A propos</h2>
                <div className="savoirContent">
                    <p>Voici maintenant un peu plus de 30 ans que naissait le club de course pédestre de Saint jean d'illac, créé par une poignée de passionnés de course à pied.</p>

                    <p>Aujourd'hui le club compte désormais une centaine d'adhérents toujours enjoués et passionnés par ce sport.</p>

                    <p>Pour répondre aux besoins du plus grand nombre, le club propose plusieurs entraînements par semaine dispensés sur 2 horaires.</p>
                    <p>Le départ est donné du premier parking de la plaine des sports de saint jean d'illac, les mardis et jeudis soirs ainsi que les samedis matins:
                    </p>
                    <ul className="SavoirList">
                        <li>Mardi & jeudi séances à 18h00 et 19h20. (10/12 kms)</li>
                        <li>Samedi à 8h30: groupes "tortues" (10 km/h max) et "sortie longue" (15 / 20 kms).</li>
                        <li>Samedi à 9h00: séance traditionnelle. (10/12 kms)</li>
                    </ul>
                    <p>Les entraînements durent en général entre 1h et 1h15 pour les sorties traditionnelles et entre 1h30 et 2h00 pour les sorties longues.</p>

                    <p>Le club est ouvert à tout le monde, les prérequis sont de pouvoir courir 40 min minimum.</p>

                    <p>Lors des préparations de certaines courses, des entraînements spécifiques peuvent être proposés, parfois en dehors de Saint Jean d'illac, sur Martignas, le bassin, rive droite, voire même dans le pays basque.</p>

                    <p>Alors à vos basquettes, et venez nous rejoindre!!!</p>
                </div>
                <div className="savoirBtnContent"><Link to={"/"} className="savoirBtn">Retour</Link></div>
            </div>
        </>
    )
}

export default Savoir;