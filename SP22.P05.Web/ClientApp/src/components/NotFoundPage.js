const NotFoundPage = () => {
    document.title = "404 Not Found"
    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h3>404 page not found</h3>
                <p>We are sorry but the page you are looking for does not exist.</p>
            </div>
        </>
    );
};

export default NotFoundPage;