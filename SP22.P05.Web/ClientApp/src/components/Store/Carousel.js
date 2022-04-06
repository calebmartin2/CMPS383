import { Carousel } from "react-bootstrap";
export function ProductCarousel({ pictures }) {
    return (
        <Carousel>
            {pictures.map((picture) =>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src={picture}
                        alt="First slide"
                    />
                </Carousel.Item>
            )}
        </Carousel >
    )

}