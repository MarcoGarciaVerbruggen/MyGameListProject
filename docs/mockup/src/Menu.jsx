import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Menu.css";
import GameListA from "./optionA/GameListA.jsx";
import GameDetailA from "./optionA/GameDetailA.jsx";
import PersonalTrackerA from "./optionA/PersonalTrackerA.jsx";
import GameListB from "./optionB/GameListB.jsx";
import GameDetailB from "./optionB/GameDetailB.jsx";
import GameConceptB from "./optionB/GameConceptB.jsx";
import PersonalTrackerB from "./optionB/PersonalTrackerB.jsx";
import OptionC from "./optionC/OptionC.jsx";

const options = [
    { key: "a", label: "Option A", href: "/OptionA" },
    { key: "b", label: "Option B", href: "/OptionB" },
    { key: "c", label: "Option C", href: "/OptionC" },
];

const FEEDBACK_URL = "https://docs.google.com/document/d/your-doc-id/edit";

function MenuHome() {
    return (
        <div className="menu-page">
            <div className="menu-glow" aria-hidden="true" />

            <header className="menu-header">
                <p className="menu-eyebrow">My Game List</p>
                <h1 className="menu-welcome">Welcome back</h1>
                <p className="menu-subtitle">Pick where you want to go</p>
            </header>

            <nav className="menu-grid">
                {options.map((opt) => (
                    <a key={opt.key} className="menu-card" href={opt.href}>
                        <span className="menu-card-letter">{opt.key.toUpperCase()}</span>
                        <span className="menu-card-label">{opt.label}</span>
                    </a>
                ))}
            </nav>

            <a
                className="feedback-widget"
                href={FEEDBACK_URL}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className="feedback-dot" />
                Leave feedback
            </a>
        </div>
    );
}

export default function Menu() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MenuHome />} />

                <Route path="/OptionA" element={<GameListA />} />
                <Route path="/OptionA/game/:id" element={<GameDetailA />} />
                <Route path="/OptionA/tracker" element={<PersonalTrackerA />} />

                <Route path="/OptionB" element={<GameListB />} />
                <Route path="/OptionB/game/:id" element={<GameDetailB />} />
                <Route path="/OptionB/abstraction/:id" element={<GameConceptB />} />
                <Route path="/OptionB/tracker" element={<PersonalTrackerB />} />

                <Route path="/OptionC" element={<OptionC />} />
            </Routes>
        </BrowserRouter>
    );
}