import { Link } from 'react-router-dom'

export default function Home(){
    return(
        <section className="home container">
            <h1>Welcome to My Portfolio</h1>
            <p className="mission">Mission: Turning ideas into polished web experiences.</p>
            <div className="home-buttons">
                <Link className="btn" to="/about">About Me</Link>
            </div>
        </section>
    )
}