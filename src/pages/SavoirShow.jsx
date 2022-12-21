import { useNavigate } from "react-router";
import Header from "../components/Header";
import Savoir from "./Savoir";
import Footer from "../components/Footer";

function SavoirShow() {

    const navigate = useNavigate();

    return(
        <>
            <Header />
            <Savoir />
            <Footer />
        </>
    )
};

export default SavoirShow;