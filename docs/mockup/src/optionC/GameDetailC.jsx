import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameDetail.css";

export default function GameDetailC() {
    const { id } = useParams();

    const [tracker, setTracker] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameTrackerC") || "{}");
    });

    const abstraction = gameAbstractions[id];
    const isGroup = !!abstraction;

    const versions = useMemo(() => {
        if (!isGroup) return [];
        return abstraction.gameIds
            .map((gid) => games.find((g) => g.id === gid))
            .filter(Boolean);
    }, [abstraction, isGroup]);

    const primaryGame = isGroup
        ? games.find((g) => g.id === abstraction.displayId)
        : games.find((g) => g.id === id);

    // The version the user has picked for this franchise, persisted so it
    // shows up everywhere - the list, this page, and the tracker - not
    // just while you're looking at this page.
    const [activeVersionId, setActiveVersionId] = useState(() => {
        if (!isGroup) return id;
        const saved = JSON.parse(sessionStorage.getItem("selectedVersionsC") || "{}");
        return saved[id] || abstraction.displayId;
    });

    const activeGame = isGroup
        ? versions.find((v) => v.id === activeVersionId) || primaryGame
        : primaryGame;

    function selectVersion(versionId) {
        setActiveVersionId(versionId);
        const saved = JSON.parse(sessionStorage.getItem("selectedVersionsC") || "{}");
        saved[id] = versionId;
        sessionStorage.setItem("selectedVersionsC", JSON.stringify(saved));
    }

    // Votes to remove a specific version from this franchise, with a
    // reason. Storage only - does not actually remove anything.
    const [removalVotes, setRemovalVotes] = useState(() => {
        return JSON.parse(sessionStorage.getItem("conceptRemovalVotesC") || "{}");
    });
    const [openVoteFormFor, setOpenVoteFormFor] = useState(null);
    const [voteDrafts, setVoteDrafts] = useState({});

    function submitVote(gameId) {
        const reason = (voteDrafts[gameId] || "").trim();
        if (!reason) return;

        const voteKey = `${id}:${gameId}`;
        setRemovalVotes((prev) => {
            const next = { ...prev, [voteKey]: { reason, timestamp: Date.now() } };
            sessionStorage.setItem("conceptRemovalVotesC", JSON.stringify(next));
            return next;
        });

        setOpenVoteFormFor(null);
        setVoteDrafts((prev) => ({ ...prev, [gameId]: "" }));
    }

    function retractVote(gameId) {
        const voteKey = `${id}:${gameId}`;
        setRemovalVotes((prev) => {
            const next = { ...prev };
            delete next[voteKey];
            sessionStorage.setItem("conceptRemovalVotesC", JSON.stringify(next));
            return next;
        });
    }

    // Suggestions to group a standalone game into a collection - storage
    // only, never actually changes gameAbstractions.
    const [suggestions, setSuggestions] = useState(() => {
        return JSON.parse(sessionStorage.getItem("abstractionSuggestionsC") || "[]");
    });
    const [suggestMode, setSuggestMode] = useState("existing");
    const [selectedAbstractionKey, setSelectedAbstractionKey] = useState("");
    const [newAbstractionName, setNewAbstractionName] = useState("");

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
            sessionStorage.setItem("abstractionSuggestionsC", JSON.stringify(next));
            return next;
        });

        setSelectedAbstractionKey("");
        setNewAbstractionName("");
    }

    function retractSuggestion(timestamp) {
        setSuggestions((prev) => {
            const next = prev.filter((s) => s.timestamp !== timestamp);
            sessionStorage.setItem("abstractionSuggestionsC", JSON.stringify(next));
            return next;
        });
    }

    if (!primaryGame) {
        return (
            <div className="gd-page">
                <Link className="gd-back" to="/OptionC">
                    ← Back
                </Link>
                <p>Game not found</p>
            </div>
        );
    }

    // One shared rating for the whole entry (the franchise, or the
    // standalone game) - it doesn't change when you switch versions.
    const trackKey = id;
    const myData = tracker[trackKey] || {};

    function updateTracker(changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [trackKey]: { ...(prev[trackKey] || {}), ...changes },
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

            sessionStorage.setItem("gameTrackerC", JSON.stringify(next));
            return next;
        });
    }

    const cover = activeGame.steam
        ? steamCoverUrl(activeGame.steam)
        : activeGame.banner;

    return (
        <div className="gd-page">
            <Link className="gd-back" to="/OptionC">
                ← Back
            </Link>

            <div className="gd-hero">
                <div className="gd-banner-container">
                    {cover ? (
                        <img src={cover} alt={activeGame.title} className="gd-banner" />
                    ) : (
                        <div className="gd-placeholder">
                            {activeGame.title.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="gd-section">
                    <div className="gd-section-header">
                        <h2>Master Tracker</h2>
                        <p className="gd-section-description">
                            {isGroup
                                ? "One rating for the whole entry, no matter which version you're viewing"
                                : "Your main rating for this game"}
                        </p>
                    </div>

                    <div className="gd-field">
                        <label>Status</label>
                        <select
                            value={myData.status || ""}
                            onChange={(e) => updateTracker({ status: e.target.value })}
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
                                onClick={() => updateTracker({ score: null })}
                            >
                                -
                            </button>
                            {Array.from({ length: 10 }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={myData.score === i + 1 ? "active" : ""}
                                    onClick={() => updateTracker({ score: i + 1 })}
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
                    <h1>{activeGame.title}</h1>
                    <p className="gd-platform">{activeGame.platform}</p>
                    {activeGame.release && (
                        <p className="gd-release">
                            Released: {new Date(activeGame.release).toLocaleDateString()}
                        </p>
                    )}
                    {isGroup && activeVersionId !== abstraction.displayId && (
                        <p className="gd-action-text">
                            This is your selected version — it's what shows up in the
                            list and your tracker too. The default primary entry is
                            "{primaryGame.title}".
                        </p>
                    )}
                </div>

                {isGroup && (
                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>Other Versions</h2>
                            <p className="gd-section-description">
                                Same rating applies to all of these — pick one to make it
                                your version for this franchise everywhere
                            </p>
                        </div>

                        <div className="gd-custom-lists">
                            {versions.map((version) => {
                                const isPrimary = version.id === abstraction.displayId;
                                const isActive = version.id === activeVersionId;
                                const voteKey = `${id}:${version.id}`;
                                const existingVote = removalVotes[voteKey];
                                const isVoteFormOpen = openVoteFormFor === version.id;

                                return (
                                    <div
                                        key={version.id}
                                        className="gd-custom-list-item"
                                        style={{
                                            flexDirection: "column",
                                            alignItems: "stretch",
                                            borderColor: isActive ? "#5865f2" : undefined,
                                        }}
                                    >
                                        <div
                                            onClick={() => selectVersion(version.id)}
                                            style={{
                                                cursor: "pointer",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <h4>
                                                {version.title}
                                                {isPrimary && " (Default)"}
                                            </h4>
                                            <div className="gd-list-rating-badge">
                                                {isActive ? "Selected" : version.platform}
                                            </div>
                                        </div>

                                        <div
                                            style={{ marginTop: "10px" }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {existingVote ? (
                                                <div className="gd-action-text">
                                                    🚫 Voted to remove — "{existingVote.reason}"{" "}
                                                    <button
                                                        className="pt-remove-game-btn"
                                                        onClick={() => retractVote(version.id)}
                                                    >
                                                        Undo
                                                    </button>
                                                </div>
                                            ) : isVoteFormOpen ? (
                                                <div>
                                                    <textarea
                                                        value={voteDrafts[version.id] || ""}
                                                        onChange={(e) =>
                                                            setVoteDrafts({
                                                                ...voteDrafts,
                                                                [version.id]: e.target.value,
                                                            })
                                                        }
                                                        placeholder={`Why doesn't "${version.title}" belong in this collection?`}
                                                        style={{
                                                            width: "100%",
                                                            minHeight: "60px",
                                                            boxSizing: "border-box",
                                                            background: "#1e1f22",
                                                            border: "1px solid #35373c",
                                                            borderRadius: "6px",
                                                            color: "#f2f3f5",
                                                            padding: "8px",
                                                            marginBottom: "8px",
                                                        }}
                                                    />
                                                    <button
                                                        className="pt-add-game-btn"
                                                        onClick={() => submitVote(version.id)}
                                                    >
                                                        Submit vote
                                                    </button>{" "}
                                                    <button
                                                        className="pt-remove-game-btn"
                                                        onClick={() => setOpenVoteFormFor(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="pt-remove-game-btn"
                                                    onClick={() => setOpenVoteFormFor(version.id)}
                                                >
                                                    🚫 Vote to remove from collection
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {!isGroup && (
                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>Suggest a Collection</h2>
                            <p className="gd-section-description">
                                Think this game belongs in a collection? Suggest one -
                                this is just recorded for review and won't move the
                                game automatically.
                            </p>
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

                <div className="gd-section">
                    <div className="gd-section-header">
                        <h2>Manage</h2>
                        <p className="gd-section-description">
                            Organize this entry in your lists
                        </p>
                    </div>
                    <p className="gd-action-text">
                        Go to "My Lists" to add this entry to custom lists
                    </p>
                    <Link to="/OptionC/tracker" className="gd-lists-link">
                        My Lists
                    </Link>
                </div>
            </div>
        </div>
    );
}
