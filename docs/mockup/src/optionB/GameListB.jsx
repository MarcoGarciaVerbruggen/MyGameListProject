import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
import { getDisplayGameForAbstraction } from "../utils/abstractionHelpers.js";
import { steamCoverUrl } from "../utils/steam";

import "../GameList.css";

export default function GameListB() {
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
        return JSON.parse(sessionStorage.getItem("gameTrackerB") || "{}");
    });

    const [searchQuery, setSearchQuery] = useState("");

    const conceptMemberIds = useMemo(() => {
        const memberIds = new Set();
        Object.values(gameAbstractions).forEach((abstraction) => {
            abstraction.gameIds.forEach((id) => memberIds.add(id));
        });
        return memberIds;
    }, []);

    // Sync tracker changes to Master Tracker in gameLists
    useEffect(() => {
        const lists = JSON.parse(sessionStorage.getItem("gameListsB") || '{"default": {"name": "Master Tracker", "games": {}}}');

        lists.default.games = {};
        Object.entries(tracker).forEach(([key, data]) => {
            if (data.score && !conceptMemberIds.has(key)) {
                lists.default.games[key] = { rating: data.score };
            }
        });

        sessionStorage.setItem("gameListsB", JSON.stringify(lists));
    }, [tracker, conceptMemberIds]);

    function updateAbstraction(abstractionKey, changes) {
        setTracker((prev) => {
            const next = {
                ...prev,
                [abstractionKey]: {
                    ...(prev[abstractionKey] || {}),
                    ...changes,
                },
            };

            // Remove from tracker if score is cleared
            if (changes.score !== undefined && changes.score === null) {
                delete next[abstractionKey];
            } else if (changes.score !== undefined && changes.score !== null && !next[abstractionKey].status) {
                // Auto-set status when adding a score
                next[abstractionKey].status = "Plan to Play";
            }

            sessionStorage.setItem(
                "gameTrackerB",
                JSON.stringify(next)
            );

            return next;
        });
    }

    // Build list of abstractions and independent games
    const displayItems = useMemo(() => {
        const items = [];
        const processedGameIds = new Set();

        Object.entries(gameAbstractions).forEach(([key, abstraction]) => {
            const displayGame = getDisplayGameForAbstraction(games, key);
            if (displayGame) {
                items.push({
                    type: "abstraction",
                    key,
                    abstraction,
                    game: displayGame,
                });
                abstraction.gameIds.forEach(id => processedGameIds.add(id));
            }
        });

        games.forEach((game) => {
            if (!processedGameIds.has(game.id)) {
                items.push({
                    type: "game",
                    key: game.id,
                    game,
                });
            }
        });

        return items;
    }, []);

    // Rank and filter
    const rankedItems = useMemo(() => {
        return [...displayItems].sort((a, b) => {
            return communityScores[b.game.id] - communityScores[a.game.id];
        });
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

    return (
        <div className="gl-page">
            <div className="gl-nav-header">
                <Link className="gl-back" to="/">
                    ← Back to menu
                </Link>
                <Link className="gl-personal-list" to="/OptionB/tracker">
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
                {filteredItems.map((item, index) => {
                    const cover = item.game.steam
                        ? steamCoverUrl(item.game.steam)
                        : item.game.banner;

                    const trackKey = item.type === "abstraction" ? item.key : item.game.id;
                    const myTrack = tracker[trackKey] || {};

                    const displayTitle = item.type === "abstraction"
                        ? item.abstraction.name
                        : item.game.title;

                    const linkPath = item.type === "abstraction"
                        ? `/OptionB/abstraction/${trackKey}`
                        : `/OptionB/game/${trackKey}`;

                    return (
                        <div key={trackKey} className="gl-row">
                            <Link
                                to={linkPath}
                                className="gl-row-main"
                            >
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
                                        updateAbstraction(trackKey, {
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
                                        updateAbstraction(trackKey, {
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