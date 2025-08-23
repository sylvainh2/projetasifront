import { Link } from "react-router-dom";

function Part() {
    return(
        <>
            <div className="partCont">
                <h2 className="partTitle">L'ASI course pédestre remercie ses généreux partenaires</h2>
                <p className="partId">M. Philippe Verdier, et la société Diro-Atlantique</p>
                <img className="partImg" src="/img/logo-diro.png" alt="diro" />
                {/* <p className="partId">M. Christophe Huard, et le groupe Volkswagen</p> */}
                {/* <img className="partImg" src="/img/volkswagen.webp" alt="vw" /> */}
            </div>
        </>
    )
}

export default Part;