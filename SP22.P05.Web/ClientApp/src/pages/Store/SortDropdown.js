import { Dropdown, DropdownButton } from "react-bootstrap";
export default function SortDropdown({handleSelect, sortOrder}) {
    function mapSortDropdownName() {
        switch (sortOrder) {
            case "most-popular":
                return "Most Popular";
            case "name":
                return "Name";
            case "highest-price":
                return "Highest Price";
            case "lowest-price":
                return "Lowest Price";
            case "most-recent":
                return "Most Recent";
            default:
                return "Most Popular";
        }
    }
    return (
        <DropdownButton id="dropdown-basic-button" title={"Sort by: " + mapSortDropdownName()} onSelect={handleSelect} style={{ float: "right" }}>
            <Dropdown.Item eventKey="most-popular">Most Popular</Dropdown.Item>
            <Dropdown.Item eventKey="name">Name</Dropdown.Item>
            <Dropdown.Item eventKey="highest-price">Highest Price</Dropdown.Item>
            <Dropdown.Item eventKey="lowest-price">Lowest Price</Dropdown.Item>
            <Dropdown.Item eventKey="most-recent">Most Recent</Dropdown.Item>
        </DropdownButton >
    )
}