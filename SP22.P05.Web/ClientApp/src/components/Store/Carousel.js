import { Carousel } from "react-bootstrap";
export function ProductCarousel() {
    return (
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://images.unsplash.com/photo-1580757468214-c73f7062a5cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item >
                        <img

                            className="d-block w-100"
                            src="https://images.unsplash.com/photo-1558637845-c8b7ead71a3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8MTYlM0E5fGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                            alt="Second slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item >
                        <img
                            className="d-block w-100"
                            src="https://images.unsplash.com/photo-1495443396064-16fd983acb6a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fDE2JTNBOXxlbnwwfHwwfHw%3D&w=1000&q=80"
                            alt="Third slide"
                        />
                    </Carousel.Item>
                </Carousel>
    )
}