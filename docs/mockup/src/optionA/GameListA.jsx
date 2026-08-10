import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import { games } from "/resources/gameData.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameList.css";

export default function GameListA() {
    const communityScores = useMemo(() => {
        const saved = sessionStorage.getItem("communityScores");

        if (saved) return JSON.parse(saved);

        const scores = {};

        games.forEach((game) => {
            scores[game.id] = +(8 + Math.random() * 2).toFixed(2);
        });

        sessionStorage.setItem(
            "communityScores",
            JSON.stringify(scores)
        );

        return scores;
    }, []);

    const [tracker, setTracker] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameTracker") || "{}");
    });

    const [searchQuery, setSearchQuery] = useState("");

    // Sync tracker changes to Master Tracker in gameLists
    useEffect(() => {
        const lists = JSON.parse(sessionStorage.getItem("gameLists") || '{"default": {"name": "Master Tracker", "games": {}}}');
        
        // Update Master Tracker games to match tracker ratings
        lists.default.games = {};
        Object.entries(tracker).forEach(([gameId, data]) => {
            if (data.score) {
                lists.default.games[gameId] = { rating: data.score };
            }
        });

        sessionStorage.setItem("gameLists", JSON.stringify(lists));
    }, [tracker]);

    function updateGame(id, changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [id]: {
                    ...(prev[id] || {}),
                    ...changes,
                },
            };

            // Remove from tracker if score is cleared
            if (changes.score !== undefined && changes.score === null) {
                delete next[id];
            } else if (changes.score !== undefined && changes.score !== null && !next[id].status) {
                // Auto-set status when adding a score
                next[id].status = "Plan to Play";
            }

            sessionStorage.setItem(
                "gameTracker",
                JSON.stringify(next)
            );

            return next;
        });
    }

    const rankedGames = useMemo(() => {
        return [...games].sort(
            (a, b) => communityScores[b.id] - communityScores[a.id]
        );
    }, [communityScores]);

    const filteredGames = useMemo(() => {
        if (!searchQuery.trim()) return rankedGames;
        
        const query = searchQuery.toLowerCase();
        return rankedGames.filter(
            (game) =>
                game.title.toLowerCase().includes(query) ||
                game.platform.toLowerCase().includes(query)
        );
    }, [rankedGames, searchQuery]);

    return (
        <div className="gl-page">
            <div className="gl-nav-header">
                <Link className="gl-back" to="/">
                    ← Back to menu
                </Link>
                <Link className="gl-personal-list" to="/OptionA/tracker">
                    📋 My Lists
                </Link>
            </div>

            <header className="gl-header">
                <h1>Top Games</h1>
                <p>Community rankings with your personal tracker</p>
            </header>

            <div className="gl-search-container">
                <input
                    type="text"
                    className="gl-search-input"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="gl-list">
                {filteredGames.map((game, index) => {
                    const cover = game.steam
                        ? steamCoverUrl(game.steam)
                        : game.banner;

                    const myGame = tracker[game.id] || {};

                    return (
                        <div key={game.id} className="gl-row">
                            <Link
                                to={`/OptionA/game/${game.id}`}
                                className="gl-row-main"
                            >
                                <div className="gl-rank">#{index + 1}</div>

                                {cover ? (
                                    <img
                                        src={cover}
                                        alt={game.title}
                                        className="gl-cover-img"
                                    />
                                ) : (
                                    <div className="gl-cover">
                                        {game.title.charAt(0)}
                                    </div>
                                )}

                                <div className="gl-info">
                                    <h2>{game.title}</h2>
                                    <p className="gl-platform">
                                        {game.platform}
                                    </p>
                                </div>

                                <div className="gl-community">
                                    <span className="gl-community-label">
                                        Score
                                    </span>
                                    <span className="gl-community-score">
                                        {communityScores[game.id].toFixed(2)}
                                    </span>
                                </div>
                            </Link>

                            <div className="gl-tracker" onClick={(e) => e.stopPropagation()}>
                                <select
                                    value={myGame.status || ""}
                                    onChange={(e) =>
                                        updateGame(game.id, {
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option value="">Not in List</option>
                                    <option value="WishList">WishList</option>
                                    <option value="Plan to Play">Plan to Play</option>
                                    <option value="Backlog">Backlog</option>
                                    <option value="Playing">Playing</option>
                                    <option value="Hiatus">Hiatus</option>
                                    <option value="Dropped">Dropped</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <select
                                    value={myGame.score ?? ""}
                                    onChange={(e) =>
                                        updateGame(game.id, {
                                            score: e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        })
                                    }
                                >
                                    <option value="">No Score</option>

                                    {Array.from({ length: 10 }, (_, i) => (
                                        <option
                                            key={i + 1}
                                            value={i + 1}
                                        >
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}