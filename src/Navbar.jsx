import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="navbar bg-slate-200 p-3 mb-2">
            <div className="navbar-start">
            </div>
            <div className="navbar-center">
                <Link to="/" className="btn btn-ghost normal-case font-extrabold text-xl sm:text-3xl">Financial Event Risk Analysis Tool</Link>
                <Link to="/sec-risk-filings" className="btn btn-ghost normal-case font-extrabold text-xl sm:text-3xl">SEC Risk Filings</Link>
                <Link to="/KnowledgeGraph" className="btn btn-ghost normal-case font-extrabold text-xl sm:text-3xl">Knowledge Graph</Link>
            </div>
            <div className="navbar-end">
            </div>
      </div>
    );
}

export default Navbar;