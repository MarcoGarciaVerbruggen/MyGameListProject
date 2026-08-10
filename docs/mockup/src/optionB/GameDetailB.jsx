import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import { games } from "/resources/gameData.js";
import { getAbstractionForGame } from "../utils/abstractionHelpers.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameDetail.css";

export default function GameDetailB() {
    const { id } = useParams();

    const [tracker, setTracker] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameTrackerB") || "{}");
    });

    const [lists, setLists] = useState(() => {
        return JSON.parse(
            sessionStorage.getItem("gameListsB") ||
            '{"default": {"name": "Master Tracker", "games": {}}}'
        );
    });

    const game = games.find((g) => g.id === id);

    // If this individual game belongs to a compilation/abstraction, we still
    // let it be tracked on its own (trackKey = its own id), but surface a
    // link over to the concept page so the user can rate the collection too.
    const abstraction = getAbstractionForGame(id);

    if (!game) {
        return (
            <div className="gd-page">
                <Link className="gd-back" to="/OptionB">
                    ← Back
                </Link>
                <p>Game not found</p>
            </div>
        );
    }

    const myData = tracker[id] || {};

    function updateTracker(changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [id]: {
                    ...(prev[id] || {}),
                    ...changes,
                },
            };

            if (changes.score !== undefined && changes.score === null) {
                delete next[id];
            } else if (
                changes.score !== undefined &&
                changes.score !== null &&
                !next[id].status
            ) {
                next[id].status = "Plan to Play";
            }

            sessionStorage.setItem("gameTrackerB", JSON.stringify(next));
            return next;
        });
    }

    // Get custom lists where this game appears
    const customListsWithGame = Object.entries(lists)
        .filter(([listId, list]) => listId !== "default" && list.games[id])
        .map(([listId, list]) => ({
            listId,
            name: list.name,
            rating: list.games[id].rating,
        }));

    const cover = game.steam ? steamCoverUrl(game.steam) : game.banner;

    return (
        <div className="gd-page">
            <Link className="gd-back" to="/OptionB">
                ← Back
            </Link>

            <div className="gd-card">
                <div className="gd-banner-container">
                    {cover ? (
                        <img src={cover} alt={game.title} className="gd-banner" />
                    ) : (
                        <div className="gd-placeholder">
                            {game.title.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="gd-info">
                    <div className="gd-header">
                        <h1>{game.title}</h1>
                        <p className="gd-platform">{game.platform}</p>
                        {game.release && (
                            <p className="gd-release">
                                Released: {new Date(game.release).toLocaleDateString()}
                            </p>
                        )}
                    </div>

                    {abstraction && (
                        <div className="gd-section">
                            <p className="gd-action-text">
                                Part of the "{abstraction.name}" collection
                            </p>
                            <Link
                                to={`/OptionB/abstraction/${abstraction.key}`}
                                className="gd-lists-link"
                            >
                                🗂️ View "{abstraction.name}" collection
                            </Link>
                        </div>
                    )}

                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>🎯 Master Tracker</h2>
                            <p className="gd-section-description">
                                Your main rating for this game
                            </p>
                        </div>

                        <div className="gd-field">
                            <label>Status</label>
                            <select
                                value={myData.status || ""}
                                onChange={(e) =>
                                    updateTracker({
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="">Not in List</option>
                                <option value="WishList">WishList</option>
                                <option value="Plan to Play">
                                    Plan to Play
                                </option>
                                <option value="Backlog">Backlog</option>
                                <option value="Playing">Playing</option>
                                <option value="Hiatus">Hiatus</option>
                                <option value="Dropped">Dropped</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="gd-field">
                            <label>Rating</label>
                            <div className="gd-score">
                                <button
                                    className={!myData.score ? "active" : ""}
                                    onClick={() =>
                                        updateTracker({ score: null })
                                    }
                                >
                                    -
                                </button>
                                {Array.from({ length: 10 }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={
                                            myData.score === i + 1 ? "active" : ""
                                        }
                                        onClick={() =>
                                            updateTracker({
                                                score: i + 1,
                                            })
                                        }
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {customListsWithGame.length > 0 && (
                        <div className="gd-section">
                            <div className="gd-section-header">
                                <h2>📚 In Your Lists</h2>
                                <p className="gd-section-description">
                                    This game appears in these custom lists
                                </p>
                            </div>

                            <div className="gd-custom-lists">
                                {customListsWithGame.map((list) => (
                                    <div
                                        key={list.listId}
                                        className="gd-custom-list-item"
                                    >
                                        <h4>{list.name}</h4>
                                        <div className="gd-list-rating-badge">
                                            ⭐ {list.rating}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>⚙️ Manage</h2>
                            <p className="gd-section-description">
                                Organize this game in your lists
                            </p>
                        </div>

                        <p className="gd-action-text">
                            Go to "My Lists" to add this game to custom lists
                        </p>
                        <Link to="/OptionB/tracker" className="gd-lists-link">
                            📋 Go to My Lists
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}