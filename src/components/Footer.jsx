import { Link } from "react-router-dom";

function Footer(){
    return (
        <>
            <footer className="container-fluid">
                <nav className="row col-md-12">
                    <ul className="footerul">
                        <li className="footerli"><a className="footera" href="#"><img src="/img/facebook.png" alt="facebook"/></a></li>
                        <div className="foot">
                            <li className="footerli"><a className="footera" href="#">contact</a> </li>
                            <li className="footerli"><Link to="/cg" className="footera">conditions générales</Link> </li>
                            <li className="footerli"><Link to="/partenaires" className="footera">partenaires</Link> </li>
                        </div>
                        <li className="footerli"><a className="footera" href="#"><img className="logo" src="/img/ASI-logo-01b.png" alt="logo"/> </a> </li>
                    </ul>
                </nav> 
            </footer>
        </>
    );
}

export default Footer;