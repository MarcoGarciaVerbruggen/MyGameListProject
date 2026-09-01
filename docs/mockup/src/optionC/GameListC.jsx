import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameList.css";

export default function GameListC() {
    const communityScores = useMemo(() => {
        const saved = sessionStorage.getItem("communityScores");

        if (saved) return JSON.parse(saved);

        const scores = {};
        games.forEach((game) => {
            scores[game.id] = +(8 + Math.random() * 2).toFixed(2);
        });

        sessionStorage.setItem("communityScores", JSON.stringify(scores));
        return scores;
    }, []);

    const [tracker, setTracker] = useState(() => {
        return JSON.parse(sessionStorage.getItem("gameTrackerC") || "{}");
    });

    const [searchQuery, setSearchQuery] = useState("");

    // Sync tracker ratings into the Master Tracker list (gameListsC) that
    // PersonalTrackerC actually reads from - without this, a rating made
    // here or on GameDetailC never shows up in "My Lists".
    useEffect(() => {
        const lists = JSON.parse(
            sessionStorage.getItem("gameListsC") ||
            '{"default": {"name": "Master Tracker", "games": {}}}'
        );

        lists.default.games = {};
        Object.entries(tracker).forEach(([key, data]) => {
            if (data.score) {
                lists.default.games[key] = { rating: data.score };
            }
        });

        sessionStorage.setItem("gameListsC", JSON.stringify(lists));
    }, [tracker]);

    // Whichever version the user picked for each franchise on its detail
    // page - falls back to the franchise's default primary release.
    const selectedVersions = useMemo(() => {
        return JSON.parse(sessionStorage.getItem("selectedVersionsC") || "{}");
    }, []);

    // Every franchise is represented by the user's selected release, or
    // its default primary release if none has been picked yet. There's no
    // separate "concept" entity like Option B - the release itself is the
    // entry you see and rate.
    const displayItems = useMemo(() => {
        const items = [];
        const processedGameIds = new Set();

        Object.entries(gameAbstractions).forEach(([key, abstraction]) => {
            const chosenId = selectedVersions[key] || abstraction.displayId;
            const chosenGame =
                games.find((g) => g.id === chosenId) ||
                games.find((g) => g.id === abstraction.displayId);
            if (chosenGame) {
                items.push({
                    type: "group",
                    key,
                    abstraction,
                    game: chosenGame,
                });
            }
            abstraction.gameIds.forEach((id) => processedGameIds.add(id));
        });

        games.forEach((game) => {
            if (!processedGameIds.has(game.id)) {
                items.push({ type: "game", key: game.id, game });
            }
        });

        return items;
    }, [selectedVersions]);

    const rankedItems = useMemo(() => {
        return [...displayItems].sort(
            (a, b) => communityScores[b.game.id] - communityScores[a.game.id]
        );
    }, [displayItems, communityScores]);

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) return rankedItems;

        const query = searchQuery.toLowerCase();
        return rankedItems.filter(
            (item) =>
                item.game.title.toLowerCase().includes(query) ||
                item.game.platform.toLowerCase().includes(query) ||
                (item.abstraction && item.abstraction.name.toLowerCase().includes(query))
        );
    }, [rankedItems, searchQuery]);

    function updateEntry(key, changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [key]: { ...(prev[key] || {}), ...changes },
            };

            if (changes.score !== undefined && changes.score === null) {
                delete next[key];
            } else if (
                changes.score !== undefined &&
                changes.score !== null &&
                !next[key].status
            ) {
                next[key].status = "Plan to Play";
            }

            sessionStorage.setItem("gameTrackerC", JSON.stringify(next));
            return next;
        });
    }

    return (
        <div className="gl-page">
            <div className="gl-nav-header">
                <Link className="gl-back" to="/">
                    ← Back to menu
                </Link>
                <Link className="gl-personal-list" to="/OptionC/tracker">
                    📋 My Lists
                </Link>
            </div>

            <header className="gl-header">
                <h1>Top Games</h1>
                <p>Each franchise shown by its default or your selected release — other versions live on its page</p>
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
                {filteredItems.map((item, index) => {
                    const cover = item.game.steam
                        ? steamCoverUrl(item.game.steam)
                        : item.game.banner;

                    const trackKey = item.key;
                    const myTrack = tracker[trackKey] || {};
                    const displayTitle = item.game.title;
                    const linkPath = `/OptionC/game/${trackKey}`;

                    return (
                        <div key={trackKey} className="gl-row">
                            <Link to={linkPath} className="gl-row-main">
                                <div className="gl-rank">#{index + 1}</div>

                                {cover ? (
                                    <img
                                        src={cover}
                                        alt={displayTitle}
                                        className="gl-cover-img"
                                    />
                                ) : (
                                    <div className="gl-cover">
                                        {displayTitle.charAt(0)}
                                    </div>
                                )}

                                <div className="gl-info">
                                    <h2>{displayTitle}</h2>
                                    <p className="gl-platform">
                                        {item.game.platform}
                                        {item.type === "group" && (
                                            <> · {item.abstraction.gameIds.length} versions</>
                                        )}
                                    </p>
                                </div>

                                <div className="gl-community">
                                    <span className="gl-community-label">
                                        Score
                                    </span>
                                    <span className="gl-community-score">
                                        {communityScores[item.game.id].toFixed(2)}
                                    </span>
                                </div>
                            </Link>

                            <div className="gl-tracker" onClick={(e) => e.stopPropagation()}>
                                <select
                                    value={myTrack.status || ""}
                                    onChange={(e) =>
                                        updateEntry(trackKey, {
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
                                    value={myTrack.score ?? ""}
                                    onChange={(e) =>
                                        updateEntry(trackKey, {
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
    );
}
