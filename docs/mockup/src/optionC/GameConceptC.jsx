import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
import { getDisplayGameForAbstraction } from "../utils/abstractionHelpers.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameDetail.css";

export default function GameConceptC() {
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

    const abstraction = gameAbstractions[id];
    const displayGame = abstraction ? getDisplayGameForAbstraction(games, id) : null;

    // The individual games that make up this collection
    const memberGames = useMemo(() => {
        if (!abstraction) return [];
        return abstraction.gameIds
            .map((gameId) => games.find((g) => g.id === gameId))
            .filter(Boolean);
    }, [abstraction]);

    if (!abstraction || !displayGame) {
        return (
            <div className="gd-page">
                <Link className="gd-back" to="/OptionB">
                    ← Back
                </Link>
                <p>Collection not found</p>
            </div>
        );
    }

    // Generic updater - works for both the concept's own tracker key (the
    // abstraction id) and each individual member game's tracker key (its
    // own game id), so every one of them can be rated independently.
    function updateEntry(trackKey, changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [trackKey]: {
                    ...(prev[trackKey] || {}),
                    ...changes,
                },
            };

            if (changes.score !== undefined && changes.score === null) {
                delete next[trackKey];
            } else if (
                changes.score !== undefined &&
                changes.score !== null &&
                !next[trackKey].status
            ) {
                next[trackKey].status = "Plan to Play";
            }

            sessionStorage.setItem("gameTrackerB", JSON.stringify(next));
            return next;
        });
    }

    const myData = tracker[id] || {};

    // Custom lists where the concept itself appears
    const customListsWithConcept = Object.entries(lists)
        .filter(([listId, list]) => listId !== "default" && list.games[id])
        .map(([listId, list]) => ({
            listId,
            name: list.name,
            rating: list.games[id].rating,
        }));

    const cover = displayGame.steam
        ? steamCoverUrl(displayGame.steam)
        : displayGame.banner;

    return (
        <div className="gd-page">
            <Link className="gd-back" to="/OptionB">
                ← Back
            </Link>

            <div className="gd-card">
                <div className="gd-banner-container">
                    {cover ? (
                        <img src={cover} alt={abstraction.name} className="gd-banner" />
                    ) : (
                        <div className="gd-placeholder">
                            {abstraction.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="gd-info">
                    <div className="gd-header">
                        <h1>{abstraction.name}</h1>
                        <p className="gd-platform">
                            {memberGames.length} games in this collection
                        </p>
                    </div>

                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>🎯 Master Tracker</h2>
                            <p className="gd-section-description">
                                Your overall rating for the collection as a whole
                            </p>
                        </div>

                        <div className="gd-field">
                            <label>Status</label>
                            <select
                                value={myData.status || ""}
                                onChange={(e) =>
                                    updateEntry(id, {
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
                                        updateEntry(id, { score: null })
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
                                            updateEntry(id, {
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

                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>🎮 Games in this Collection</h2>
                            <p className="gd-section-description">
                                Each entry can be tracked and rated on its own
                            </p>
                        </div>

                        <div className="gd-custom-lists">
                            {memberGames.map((game) => {
                                const gameData = tracker[game.id] || {};
                                const gameCover = game.steam
                                    ? steamCoverUrl(game.steam)
                                    : game.banner;

                                return (
                                    <div
                                        key={game.id}
                                        className="gd-custom-list-item"
                                    >
                                        <Link
                                            to={`/OptionB/game/${game.id}`}
                                            className="pt-list-game-row-link"
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                {gameCover ? (
                                                    <img
                                                        src={gameCover}
                                                        alt={game.title}
                                                        style={{ width: "48px", height: "auto", borderRadius: "4px" }}
                                                    />
                                                ) : (
                                                    <div className="gd-placeholder" style={{ width: "48px", height: "48px" }}>
                                                        {game.title.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4>{game.title}</h4>
                                                    <p className="gd-platform">{game.platform}</p>
                                                </div>
                                            </div>
                                        </Link>

                                        <div
                                            className="gd-score"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <select
                                                value={gameData.status || ""}
                                                onChange={(e) =>
                                                    updateEntry(game.id, {
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
                                                value={gameData.score ?? ""}
                                                onChange={(e) =>
                                                    updateEntry(game.id, {
                                                        score: e.target.value
                                                            ? Number(e.target.value)
                                                            : null,
                                                    })
                                                }
                                            >
                                                <option value="">No Score</option>
                                                {Array.from({ length: 10 }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
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

                    {customListsWithConcept.length > 0 && (
                        <div className="gd-section">
                            <div className="gd-section-header">
                                <h2>📚 In Your Lists</h2>
                                <p className="gd-section-description">
                                    This collection appears in these custom lists
                                </p>
                            </div>

                            <div className="gd-custom-lists">
                                {customListsWithConcept.map((list) => (
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
                                Organize this collection in your lists
                            </p>
                        </div>

                        <p className="gd-action-text">
                            Go to "My Lists" to add this collection to custom lists
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