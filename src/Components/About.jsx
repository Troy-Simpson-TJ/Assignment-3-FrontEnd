import troy from "../assets/troysimpson.jpg"

function About() {
    return (
        <div className="page about">
            <h2>Troy Simpson</h2>
            <img src={troy} alt="Troy Simpson" className="profile-pic" />
            <p></p>
            <p></p>
            <p></p>
            <a href="/softwareresume.pdf" target="_blank" rel="noopener noreferrer">
                Click to view my Resume
            </a>
        </div>
    );
}

export default About;