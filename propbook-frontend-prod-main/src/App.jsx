import { useEffect, useState } from "react";
import PropBookPage from "./pages/propBook";
import PublicPropertyPage from "./components/PublicPropertyPage";

function getRouteFromHash() {
    const hash = window.location.hash || "";
    const match = hash.match(/^#\/property\/([^/?]+)/);
    if (match) {
        return { type: "public-property", propertyId: decodeURIComponent(match[1]) };
    }
    return { type: "app" };
}

function App() {
    const [route, setRoute] = useState(getRouteFromHash());

    useEffect(() => {
        const syncRoute = () => setRoute(getRouteFromHash());
        window.addEventListener("hashchange", syncRoute);
        return () => window.removeEventListener("hashchange", syncRoute);
    }, []);

    if (route.type === "public-property") {
        return (
            <PublicPropertyPage
                propertyId={route.propertyId}
                onBack={() => {
                    window.location.hash = "";
                }}
            />
        );
    }

    return <PropBookPage />;
}

export default App;
