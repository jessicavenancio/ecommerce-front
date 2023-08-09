import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer"
import { Outlet } from "react-router-dom";

export function Root() {
    return (
        <>
            
            <Header />
            
            <main>
            <Outlet />            
            </main>
            <Footer />
        </>
    )
}