import './Header.css';
import { Link } from 'react-router-dom';



function Header(){
    return(
        <header>
            <h1>TaskFlow</h1>
            <nav>
                <Link to = "/">Home</Link>
                <Link to = "/tasks"> Tasks </Link>
                <Link to = "/about"> About us</Link>
               
            </nav>
        </header>
    );
}

export default Header;