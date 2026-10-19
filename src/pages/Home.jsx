import { Link } from 'react-router-dom';
import { ListChecks, Target, ChartNoAxesCombined } from 'lucide-react';
import './Home.css';

function Home() {
  return (
    <main className="home-page">
      <section className="hero">
        <p className="hero-label">
          YOUR PRODUCTIVITY, REIMAGINED
        </p>

        <h1>
          Make every day <span>count.</span>
        </h1>

        <p className="hero-description">
          Plan your work. Focus on your priorities.
          Get things done.
        </p>

        <Link to="/tasks" className="hero-button">
          Start managing tasks
        </Link>
      </section>
      
      <section className="features">
        <div className="feature-card">
          <ListChecks size={32} /> 
          <h2>Organize Tasks</h2>
          <p>Keep your daily tasks organized in one simple place.</p>
        </div>

        <div className="feature-card">
          <Target size={32} /> 
          <h2>Stay Focused</h2>
          <p>Focus on your priorities and make steady progress.</p>
        </div>

        <div className="feature-card">
          <ChartNoAxesCombined size={32} />  
          <h2>Track Progress</h2>
          <p>Celebrate completed tasks and keep moving forward.</p>
        </div>
      </section>

    </main>
  );
}

export default Home;
