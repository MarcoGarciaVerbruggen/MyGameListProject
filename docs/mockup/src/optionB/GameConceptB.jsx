import { useParams, Link } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
import { getDisplayGameForAbstraction } from "../utils/abstractionHelpers.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameDetail.css";

export default function GameConceptB() {
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

    const [conceptRatingModes, setConceptRatingModes] = useState(() => {
        return JSON.parse(sessionStorage.getItem("conceptRatingModesB") || "{}");
    });

    const [removalVotes, setRemovalVotes] = useState(() => {
        return JSON.parse(sessionStorage.getItem("conceptRemovalVotesB") || "{}");
    });

    const [showModePrompt, setShowModePrompt] = useState(false);
    const [pendingFollowGame, setPendingFollowGame] = useState(null);

    const [openVoteFormFor, setOpenVoteFormFor] = useState(null);
    const [voteDrafts, setVoteDrafts] = useState({});

    const abstraction = gameAbstractions[id];
    const displayGame = abstraction ? getDisplayGameForAbstraction(games, id) : null;

    const memberGames = useMemo(() => {
        if (!abstraction) return [];
        return abstraction.gameIds
            .map((gameId) => games.find((g) => g.id === gameId))
            .filter(Boolean);
    }, [abstraction]);

    const ratedMemberScores = useMemo(() => {
        return memberGames
            .map((g) => tracker[g.id]?.score)
            .filter((s) => s != null);
    }, [memberGames, tracker]);

    const hasAnyMemberRating = ratedMemberScores.length > 0;
    const conceptMeta = conceptRatingModes[id];

    useEffect(() => {
        if (!conceptMeta || conceptMeta.mode === "independent") return;

        let derived = null;
        if (conceptMeta.mode === "follow") {
            derived = tracker[conceptMeta.followGameId]?.score ?? null;
        } else if (conceptMeta.mode === "average") {
            derived = ratedMemberScores.length
                ? Math.round(
                    ratedMemberScores.reduce((a, b) => a + b, 0) / ratedMemberScores.length
                )
                : null;
        }

        const currentScore = tracker[id]?.score ?? null;
        if (derived !== currentScore) {
            setTracker((prev) => {
                const next = { ...prev };
                if (derived === null) {
                    delete next[id];
                } else {
                    next[id] = { ...(prev[id] || {}), score: derived };
                    if (!next[id].status) next[id].status = "Plan to Play";
                }
                sessionStorage.setItem("gameTrackerB", JSON.stringify(next));
                return next;
            });
        }

    }, [conceptMeta, ratedMemberScores, tracker, id]);

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

    function updateMemberGame(gameId, changes) {
        if (changes.score !== undefined && changes.score !== null) {
            const alreadyHasAnyRating = memberGames.some(
                (g) => tracker[g.id]?.score != null
            );
            if (!alreadyHasAnyRating && !conceptRatingModes[id]) {
                setPendingFollowGame(gameId);
                setShowModePrompt(true);
            }
        }
        updateEntry(gameId, changes);
    }

    function chooseRatingMode(mode) {
        const meta = { mode, followGameId: mode === "follow" ? pendingFollowGame : null };
        setConceptRatingModes((prev) => {
            const next = { ...prev, [id]: meta };
            sessionStorage.setItem("conceptRatingModesB", JSON.stringify(next));
            return next;
        });

        if (mode === "independent") {
            const seedScore = tracker[pendingFollowGame]?.score ?? null;
            if (seedScore != null) {
                updateEntry(id, { score: seedScore });
            }
        }

        setShowModePrompt(false);
        setPendingFollowGame(null);
    }

    function submitVote(gameId) {
        const reason = (voteDrafts[gameId] || "").trim();
        if (!reason) return;

        const voteKey = `${id}:${gameId}`;
        setRemovalVotes((prev) => {
            const next = { ...prev, [voteKey]: { reason, timestamp: Date.now() } };
            sessionStorage.setItem("conceptRemovalVotesB", JSON.stringify(next));
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
            sessionStorage.setItem("conceptRemovalVotesB", JSON.stringify(next));
            return next;
        });
    }

    const myData = tracker[id] || {};

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

    const followGameTitle = conceptMeta?.mode === "follow"
        ? memberGames.find((g) => g.id === conceptMeta.followGameId)?.title
        : null;

    return (
        <div className="gd-page">
            <Link className="gd-back" to="/OptionB">
                ← Back
            </Link>

            {showModePrompt && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#2b2d31",
                            border: "1px solid #35373c",
                            borderRadius: "14px",
                            padding: "24px",
                            maxWidth: "420px",
                            width: "90%",
                            color: "#f2f3f5",
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>
                            How should "{abstraction.name}" be rated overall?
                        </h3>
                        <p className="gd-action-text">
                            You just rated a game in this collection for the first time.
                            Choose how the collection's own rating should work.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
                            <button className="gd-lists-link" style={{ border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={() => chooseRatingMode("follow")}>
                                Always follow this game's rating
                            </button>
                            <button className="gd-lists-link" style={{ border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={() => chooseRatingMode("average")}>
                                Average of all rated games in the collection
                            </button>
                            <button className="gd-lists-link" style={{ border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={() => chooseRatingMode("independent")}>
                                Independent rating I set myself
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="gd-hero">
                <div className="gd-banner-container">
                    {cover ? (
                        <img src={cover} alt={abstraction.name} className="gd-banner" />
                    ) : (
                        <div className="gd-placeholder">
                            {abstraction.name.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="gd-section">
                    <div className="gd-section-header">
                        <h2>Master Tracker</h2>
                        <p className="gd-section-description">
                            Your overall rating for the collection as a whole
                        </p>
                    </div>

                    {!hasAnyMemberRating ? (
                        <p className="gd-action-text">
                            Rate at least one game below to enable an overall rating
                            for this collection.
                        </p>
                    ) : (
                        <>
                            <div className="gd-field">
                                <label>Status</label>
                                <select
                                    value={myData.status || ""}
                                    onChange={(e) =>
                                        updateEntry(id, { status: e.target.value })
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
                                {conceptMeta?.mode === "follow" && (
                                    <p className="gd-action-text">
                                        Following the rating of "{followGameTitle}"
                                    </p>
                                )}
                                {conceptMeta?.mode === "average" && (
                                    <p className="gd-action-text">
                                        Average of {ratedMemberScores.length} rated game(s) in this collection
                                    </p>
                                )}
                                <div
                                    className="gd-score"
                                    style={
                                        conceptMeta?.mode !== "independent"
                                            ? { opacity: 0.6, pointerEvents: "none" }
                                            : undefined
                                    }
                                >
                                    <button
                                        className={!myData.score ? "active" : ""}
                                        onClick={() => updateEntry(id, { score: null })}
                                    >
                                        -
                                    </button>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            className={myData.score === i + 1 ? "active" : ""}
                                            onClick={() => updateEntry(id, { score: i + 1 })}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="gd-body">
                <div className="gd-header">
                    <h1>{abstraction.name}</h1>
                    <p className="gd-platform">
                        {memberGames.length} games in this collection
                    </p>
                </div>

                <div className="gd-section">
                    <div className="gd-custom-lists">
                        {memberGames.map((game) => {
                            const gameData = tracker[game.id] || {};
                            const gameCover = game.steam
                                ? steamCoverUrl(game.steam)
                                : game.banner;
                            const voteKey = `${id}:${game.id}`;
                            const existingVote = removalVotes[voteKey];
                            const isVoteFormOpen = openVoteFormFor === game.id;

                            return (
                                <div key={game.id} className="gd-custom-list-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
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
                                        className="gd-field"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ marginTop: "12px", marginBottom: 0 }}
                                    >
                                        <label>Status</label>
                                        <select
                                            value={gameData.status || ""}
                                            onChange={(e) =>
                                                updateMemberGame(game.id, {
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

                                    <div
                                        className="gd-field"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ marginTop: "10px", marginBottom: 0 }}
                                    >
                                        <label>Rating</label>
                                        <div className="gd-score small">
                                            <button
                                                className={!gameData.score ? "active" : ""}
                                                onClick={() =>
                                                    updateMemberGame(game.id, { score: null })
                                                }
                                            >
                                                -
                                            </button>
                                            {Array.from({ length: 10 }, (_, i) => (
                                                <button
                                                    key={i + 1}
                                                    className={
                                                        gameData.score === i + 1 ? "active" : ""
                                                    }
                                                    onClick={() =>
                                                        updateMemberGame(game.id, { score: i + 1 })
                                                    }
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div
                                        style={{ marginTop: "12px" }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {existingVote ? (
                                            <div className="gd-action-text">
                                                🚫 Voted to remove — "{existingVote.reason}"{" "}
                                                <button
                                                    className="pt-remove-game-btn"
                                                    onClick={() => retractVote(game.id)}
                                                >
                                                    Undo
                                                </button>
                                            </div>
                                        ) : isVoteFormOpen ? (
                                            <div>
                                                <textarea
                                                    value={voteDrafts[game.id] || ""}
                                                    onChange={(e) =>
                                                        setVoteDrafts({
                                                            ...voteDrafts,
                                                            [game.id]: e.target.value,
                                                        })
                                                    }
                                                    placeholder={`Why doesn't "${game.title}" belong in this collection?`}
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
                                                    onClick={() => submitVote(game.id)}
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
                                                onClick={() => setOpenVoteFormFor(game.id)}
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

                {customListsWithConcept.length > 0 && (
                    <div className="gd-section">
                        <div className="gd-section-header">
                            <h2>Your Lists</h2>
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
                        <h2>Manage</h2>
                        <p className="gd-section-description">
                            Organize this collection in your lists
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