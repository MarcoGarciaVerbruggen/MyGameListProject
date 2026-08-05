import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

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

    function updateGame(id, changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [id]: {
                    ...(prev[id] || {}),
                    ...changes,
                },
            };

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

    return (
        <div className="gl-page">
            <Link className="gl-back" to="/">
                ← Back to menu
            </Link>

            <div style={{ marginTop: 20, marginBottom: 20 }}>
                <Link className="gl-back" to="/OptionA/tracker">
                    📋 My Personal List
                </Link>
            </div>

            <header className="gl-header">
                <h1>Top Games</h1>
                <p>Community rankings with your personal tracker</p>
            </header>

            <div className="gl-list">
                {rankedGames.map((game, index) => {
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

                            <div className="gl-tracker">
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