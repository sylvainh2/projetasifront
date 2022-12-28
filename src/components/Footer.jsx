import { Link } from "react-router-dom";

function Footer(){
    return (
        <>
            <footer className="container-fluid">
                <nav className="row col-md-12">
                    <ul>
                    <li><a href="#"><img src="/img/facebook.png" alt="facebook"/></a></li>
                        <div className="foot">
                        <li><a href="#">contact</a> </li>
                        <li><Link to="/cg" >conditions générales</Link> </li>
                        <li><a href="#">partenaires</a> </li>
                        </div>
                    <li><a href="#"><img className="logo" src="/img/ASI-logo-01b.png" alt="logo"/> </a> </li>
                    </ul>
                </nav>
            </footer>
        </>
    );
}

export default Footer;