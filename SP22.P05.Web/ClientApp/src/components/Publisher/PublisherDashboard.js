import { checkForRole } from "../checkForRole";
import PublisherProductList from "./PublisherProductList"

export function PublisherDashboard() {
    return (
        <>
            {checkForRole("Publisher")}
            <h1>Publisher Dashboard</h1>
            <PublisherProductList/>
        </>
    )
}