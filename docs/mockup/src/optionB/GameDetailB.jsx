import { useParams, Link } from "react-router-dom";
import { useState } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
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

    const [suggestions, setSuggestions] = useState(() => {
        return JSON.parse(sessionStorage.getItem("abstractionSuggestionsB") || "[]");
    });
    const [suggestMode, setSuggestMode] = useState("existing");
    const [selectedAbstractionKey, setSelectedAbstractionKey] = useState("");
    const [newAbstractionName, setNewAbstractionName] = useState("");

    const game = games.find((g) => g.id === id);

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

    const customListsWithGame = Object.entries(lists)
        .filter(([listId, list]) => listId !== "default" && list.games[id])
        .map(([listId, list]) => ({
            listId,
            name: list.name,
            rating: list.games[id].rating,
        }));

    const mySuggestions = suggestions.filter((s) => s.gameId === id);

    function submitSuggestion() {
        let record;
        if (suggestMode === "existing") {
            if (!selectedAbstractionKey) return;
            record = {
                gameId: id,
                type: "existing",
                targetKey: selectedAbstractionKey,
                timestamp: Date.now(),
            };
        } else {
            if (!newAbstractionName.trim()) return;
            record = {
                gameId: id,
                type: "new",
                newName: newAbstractionName.trim(),
                timestamp: Date.now(),
            };
        }

        setSuggestions((prev) => {
            const next = [...prev, record];
            sessionStorage.setItem("abstractionSuggestionsB", JSON.stringify(next));
            return next;
        });

        setSelectedAbstractionKey("");
        setNewAbstractionName("");
    }

    function retractSuggestion(timestamp) {
        setSuggestions((prev) => {
            const next = prev.filter((s) => s.timestamp !== timestamp);
            sessionStorage.setItem("abstractionSuggestionsB", JSON.stringify(next));
            return next;
        });
    }

    const cover = game.steam ? steamCoverUrl(game.steam) : game.banner;

    return (
        <div className="gd-page">
            <Link className="gd-back" to="/OptionB">
                ← Back
            </Link>

            <div className="gd-hero">
                <div className="gd-banner-container">
                    {cover ? (
                        <img src={cover} alt={game.title} className="gd-banner" />
                    ) : (
                        <div className="gd-placeholder">
                            {game.title.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="gd-section">
                    <div className="gd-section-header">
                        <h2>Master Tracker</h2>
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
                            <option value="Plan to Play">Plan to Play</option>
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
            </div>

            <div className="gd-body">
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
                            View "{abstraction.name}" collection
                        </Link>
                    </div>
                )}

                {!abstraction && (
                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>Suggest a Collection</h2>
                        </div>

                        {mySuggestions.length > 0 && (
                            <div className="gd-custom-lists">
                                {mySuggestions.map((s) => (
                                    <div key={s.timestamp} className="gd-custom-list-item">
                                        <h4>
                                            {s.type === "existing"
                                                ? `Add to "${gameAbstractions[s.targetKey]?.name || s.targetKey}"`
                                                : `New collection: "${s.newName}"`}
                                        </h4>
                                        <button
                                            className="pt-remove-game-btn"
                                            onClick={() => retractSuggestion(s.timestamp)}
                                        >
                                            Undo
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="gd-field">
                            <label>Suggestion type</label>
                            <select
                                value={suggestMode}
                                onChange={(e) => setSuggestMode(e.target.value)}
                            >
                                <option value="existing">Add to an existing collection</option>
                                <option value="new">Suggest a brand new collection</option>
                            </select>
                        </div>

                        {suggestMode === "existing" ? (
                            <div className="gd-field">
                                <label>Collection</label>
                                <select
                                    value={selectedAbstractionKey}
                                    onChange={(e) => setSelectedAbstractionKey(e.target.value)}
                                >
                                    <option value="">Choose a collection...</option>
                                    {Object.entries(gameAbstractions).map(([key, abs]) => (
                                        <option key={key} value={key}>
                                            {abs.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="gd-field">
                                <label>New collection name</label>
                                <input
                                    type="text"
                                    value={newAbstractionName}
                                    onChange={(e) => setNewAbstractionName(e.target.value)}
                                    placeholder="e.g. Dark Souls"
                                />
                            </div>
                        )}

                        <button
                            className="gd-lists-link"
                            style={{ border: "none", cursor: "pointer" }}
                            onClick={submitSuggestion}
                        >
                            Submit suggestion
                        </button>
                    </div>
                )}

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
                        <h2>Manage</h2>
                        <p className="gd-section-description">
                            Organize this game in your lists
                        </p>
                    </div>
                    <Link to="/OptionB/tracker" className="gd-lists-link">
                        My Lists
                    </Link>
                </div>
            </div>
        </div>
    );
}