import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

import { games } from "/resources/gameData.js";
import { gameAbstractions } from "/resources/gameAbstractions.js";
import { steamCoverUrl } from "../utils/steam";

import "../PersonalTracker.css";

export default function PersonalTrackerC() {
    const [tracker, setTracker] = useState(() =>
        JSON.parse(sessionStorage.getItem("gameTrackerC") || "{}")
    );

    const [lists, setLists] = useState(() => {
        const saved = sessionStorage.getItem("gameListsC");
        return saved ? JSON.parse(saved) : { default: { name: "Master Tracker", games: {} } };
    });

    const [newListName, setNewListName] = useState("");
    const [showCreateList, setShowCreateList] = useState(false);
    const [searchQueries, setSearchQueries] = useState({});

    function createNewList(name) {
        if (!name.trim()) return;

        const listId = `list_${Date.now()}`;
        setLists((prev) => {
            const next = {
                ...prev,
                [listId]: { name, games: {} },
            };
            sessionStorage.setItem("gameListsC", JSON.stringify(next));
            return next;
        });

        setNewListName("");
        setShowCreateList(false);
    }

    function deleteList(listId) {
        if (listId === "default") return;

        setLists((prev) => {
            const next = { ...prev };
            delete next[listId];
            sessionStorage.setItem("gameListsC", JSON.stringify(next));
            return next;
        });
    }

    function addItemToList(itemKey, listId) {
        setLists((prev) => {
            const next = { ...prev };
            if (!next[listId].games[itemKey]) {
                // Get rating from master tracker if available
                const masterTrackerRating = tracker[itemKey]?.score || null;
                next[listId].games[itemKey] = { rating: masterTrackerRating };
            }
            sessionStorage.setItem("gameListsC", JSON.stringify(next));
            return next;
        });
    }

    function removeItemFromList(itemKey, listId) {
        setLists((prev) => {
            const next = { ...prev };
            delete next[listId].games[itemKey];
            sessionStorage.setItem("gameListsC", JSON.stringify(next));
            return next;
        });
    }

    function updateItemInList(itemKey, listId, rating) {
        setLists((prev) => {
            const next = { ...prev };
            if (next[listId].games[itemKey]) {
                next[listId].games[itemKey].rating = rating;
            }
            sessionStorage.setItem("gameListsC", JSON.stringify(next));
            return next;
        });

        // If it's the Master Tracker, also update the main tracker - this
        // is the same single shared rating used on GameListC/GameDetailC,
        // regardless of which version of a franchise you're viewing.
        if (listId === "default") {
            setTracker((prev) => {
                const next = { ...prev };
                if (rating === null) {
                    delete next[itemKey];
                } else {
                    next[itemKey] = {
                        ...(prev[itemKey] || {}),
                        score: rating,
                    };
                    if (!next[itemKey].status) {
                        next[itemKey].status = "Plan to Play";
                    }
                }
                sessionStorage.setItem("gameTrackerC", JSON.stringify(next));
                return next;
            });
        }
    }

    // Whichever version the user picked for each franchise on its detail
    // page - falls back to the franchise's default primary release.
    const selectedVersions = useMemo(() => {
        return JSON.parse(sessionStorage.getItem("selectedVersionsC") || "{}");
    }, []);

    // Trackable entities: every franchise (shown by the user's selected
    // release, or its default primary release), plus only the games that
    // AREN'T part of any franchise. There's no separate "collection"
    // entity here - the release itself is the entry, exactly like on
    // GameListC/GameDetailC.
    const trackableItems = useMemo(() => {
        const items = [];
        const processedGameIds = new Set();

        Object.entries(gameAbstractions).forEach(([key, abstraction]) => {
            const chosenId = selectedVersions[key] || abstraction.displayId;
            const chosenGame =
                games.find((g) => g.id === chosenId) ||
                games.find((g) => g.id === abstraction.displayId);
            if (chosenGame) {
                items.push({ type: "group", key, abstraction, game: chosenGame });
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

    // Only show items that have a score in the master tracker list
    const masterTrackerItems = useMemo(() => {
        return trackableItems
            .filter((item) => lists.default.games[item.key]?.rating)
            .sort((a, b) => {
                const scoreA = lists.default.games[a.key]?.rating ?? 0;
                const scoreB = lists.default.games[b.key]?.rating ?? 0;
                return scoreB - scoreA;
            });
    }, [trackableItems, lists.default.games]);

    // Filter items based on search query per list
    const getFilteredAvailableItems = (listId) => {
        const query = (searchQueries[listId] || "").toLowerCase();

        return masterTrackerItems.filter((item) => {
            const isNotInList = !lists[listId].games[item.key];
            const matchesQuery =
                !query ||
                item.game.title.toLowerCase().includes(query) ||
                item.game.platform.toLowerCase().includes(query);

            return isNotInList && matchesQuery;
        });
    };

    return (
        <div className="pt-page">
            <Link className="pt-back" to="/OptionC">
                ← Back to Top Games
            </Link>

            <header className="pt-header">
                <h1>My Lists</h1>
                <p>Manage your game collections</p>
            </header>

            <div className="pt-list-management">
                <div className="pt-list-header">
                    <h3>Your Lists</h3>
                    <button
                        className="pt-create-list-btn"
                        onClick={() => setShowCreateList(!showCreateList)}
                    >
                        + New List
                    </button>
                </div>

                {showCreateList && (
                    <div className="pt-create-list-form">
                        <input
                            type="text"
                            placeholder="List name..."
                            value={newListName}
                            onChange={(e) => setNewListName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    createNewList(newListName);
                                }
                            }}
                        />
                        <button
                            onClick={() => createNewList(newListName)}
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setShowCreateList(false)}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                <div className="pt-lists-tabs">
                    {Object.entries(lists).map(([listId, list]) => {
                        const availableItems = getFilteredAvailableItems(listId);

                        return (
                            <div key={listId} className="pt-list-section">
                                <div className="pt-list-title">
                                    <h4>{list.name}</h4>
                                    {listId !== "default" && (
                                        <button
                                            className="pt-delete-list-btn"
                                            onClick={() => deleteList(listId)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                <div className="pt-list-games">
                                    {Object.keys(list.games).length === 0 ? (
                                        <p className="pt-empty-list">No games in this list</p>
                                    ) : (
                                        Object.entries(list.games).map(([itemKey, gameData]) => {
                                            const item = trackableItems.find((t) => t.key === itemKey);
                                            if (!item) return null;

                                            const displayName = item.game.title;

                                            const cover = item.game.steam
                                                ? steamCoverUrl(item.game.steam)
                                                : item.game.banner;

                                            const linkPath = `/OptionC/game/${itemKey}`;

                                            return (
                                                <Link
                                                    key={itemKey}
                                                    to={linkPath}
                                                    className="pt-list-game-row-link"
                                                >
                                                    <div className="pt-list-game-row">
                                                        <div className="pt-game-info">
                                                            {cover ? (
                                                                <img
                                                                    src={cover}
                                                                    alt={displayName}
                                                                    className="pt-game-cover"
                                                                />
                                                            ) : (
                                                                <div className="pt-game-cover-placeholder">
                                                                    {displayName.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h5>{displayName}</h5>
                                                                <p>
                                                                    {item.game.platform}
                                                                    {item.type === "group" &&
                                                                        ` · ${item.abstraction.gameIds.length} versions`}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="pt-game-controls" onClick={(e) => e.stopPropagation()}>
                                                            <div className="pt-rating-buttons">
                                                                <button
                                                                    className={!gameData.rating ? "active" : ""}
                                                                    onClick={() =>
                                                                        updateItemInList(itemKey, listId, null)
                                                                    }
                                                                >
                                                                    -
                                                                </button>

                                                                {Array.from({ length: 10 }, (_, i) => (
                                                                    <button
                                                                        key={i + 1}
                                                                        className={
                                                                            gameData.rating === i + 1
                                                                                ? "active"
                                                                                : ""
                                                                        }
                                                                        onClick={() =>
                                                                            updateItemInList(itemKey, listId, i + 1)
                                                                        }
                                                                    >
                                                                        {i + 1}
                                                                    </button>
                                                                ))}
                                                            </div>

                                                            <button
                                                                className="pt-remove-game-btn"
                                                                onClick={() =>
                                                                    removeItemFromList(itemKey, listId)
                                                                }
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    )}
                                </div>

                                {availableItems.length > 0 && (
                                    <div className="pt-add-games">
                                        <div className="pt-search-add-games">
                                            <input
                                                type="text"
                                                className="pt-search-input"
                                                placeholder="Search games to add..."
                                                value={searchQueries[listId] || ""}
                                                onChange={(e) =>
                                                    setSearchQueries({
                                                        ...searchQueries,
                                                        [listId]: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <p>Add tracked games to this list:</p>
                                        <div className="pt-game-buttons">
                                            {availableItems.map((item) => (
                                                <button
                                                    key={item.key}
                                                    className="pt-add-game-btn"
                                                    onClick={() => addItemToList(item.key, listId)}
                                                >
                                                    + {item.game.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
