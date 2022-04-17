import { Carousel } from "react-bootstrap";
export function ProductCarousel({ pictures }) {
    return (
        pictures.length !== 0 && <Carousel>
            {pictures.map((picture) =>
                <Carousel.Item key={picture}>
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