import { checkForRole } from "../checkForRole";
import PublisherProductList from "./PublisherProductList"

export function PublisherPortal() {
    return (
        <>
            {checkForRole("Publisher")}
            <h1>Publisher Portal</h1>
            <PublisherProductList/>
        </>
    )
}