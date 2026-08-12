import { Link, useParams } from "react-router-dom";
import { useState } from "react";

import { games } from "/resources/gameData.js";
import { steamBannerUrl } from "../utils/steam";
import { useSteamDetails } from "../utils/useSteamDetails";

import "../GameDetail.css";

export default function GameDetailA() {
    const { id } = useParams();
    const game = games.find((g) => g.id === id);

    const { data: steamData, loading } = useSteamDetails(game?.steam);

    const [tracker, setTracker] = useState(() =>
        JSON.parse(sessionStorage.getItem("gameTracker") || "{}")
    );

    const [lists, setLists] = useState(() => {
        const saved = sessionStorage.getItem("gameLists");
        return saved ? JSON.parse(saved) : { default: { name: "Master Tracker", games: {} } };
    });

    if (!game) {
        return (
            <div className="gd-page">
                <Link className="gd-back" to="/OptionA">
                    ← Back to list
                </Link>

                <h1>Game not found</h1>
            </div>
        );
    }

    const myGame = tracker[game.id] || {};

    function updateGame(changes) {
        const next = {
            ...tracker,
            [game.id]: {
                ...myGame,
                ...changes,
            },
        };

        setTracker(next);
        sessionStorage.setItem(
            "gameTracker",
            JSON.stringify(next)
        );
    }

    // Get custom lists (excluding Master Tracker) where this game is included
    const customListsWithGame = Object.entries(lists)
        .filter(([listId]) => listId !== "default")
        .filter(([, list]) => list.games[game.id])
        .map(([listId, list]) => ({ listId, ...list }));

    const hasSteam = !!game.steam;

    const bannerSrc = hasSteam
        ? steamBannerUrl(game.steam)
        : game.banner;

    const releaseDate = hasSteam
        ? loading
            ? "Loading..."
            : steamData?.release_date?.date ?? "Unknown"
        : game.release ?? "Unknown";

    return (
        <div className="gd-page">
            <Link className="gd-back" to="/OptionA">
                ← Back to list
            </Link>

            <div className="gd-hero">
                <div className="gd-banner-container">
                    {bannerSrc ? (
                        <img
                            className="gd-banner"
                            src={bannerSrc}
                            alt={game.title}
                        />
                    ) : (
                        <div className="gd-placeholder">
                            {game.title.charAt(0)}
                        </div>
                    )}
                </div>

                <div className="gd-section gd-master-tracker-section">
                    <div className="gd-section-header">
                        <h2>Master Tracker</h2>
                        <p className="gd-section-description">Your main tracking data for this game</p>
                    </div>

                    <div className="gd-field">
                        <label>Status</label>
                        <select
                            value={myGame.status || ""}
                            onChange={(e) =>
                                updateGame({
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
                        <label>My Score</label>
                        <div className="gd-score">
                            <button
                                className={!myGame.score ? "active" : ""}
                                onClick={() =>
                                    updateGame({ score: null })
                                }
                                title="No score"
                            >
                                -
                            </button>

                            {Array.from({ length: 10 }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={
                                        myGame.score === i + 1
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        updateGame({
                                            score: i + 1,
                                        })
                                    }
                                    title={`Rating: ${i + 1}`}
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
                    <p className="gd-release">{releaseDate}</p>
                </div>

                {customListsWithGame.length > 0 && (
                    <div className="gd-section gd-custom-lists-section">
                        <div className="gd-section-header">
                            <h2>📚 In Your Lists</h2>
                            <p className="gd-section-description">Custom lists where this game is tracked</p>
                        </div>
                        <div className="gd-custom-lists">
                            {customListsWithGame.map(({ listId, name, games: listGames }) => {
                                const gameInList = listGames[game.id];
                                return (
                                    <div key={listId} className="gd-custom-list-item">
                                        <div className="gd-custom-list-info">
                                            <h4>{name}</h4>
                                            <div className="gd-list-rating-badge">
                                                {gameInList?.rating ? (
                                                    <>
                                                        <span className="gd-rating-stars">★</span>
                                                        <span className="gd-rating-num">{gameInList.rating}/10</span>
                                                    </>
                                                ) : (
                                                    <span className="gd-rating-none">Not rated</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="gd-section gd-action-section">
                    <div className="gd-section-header">
                        <h2>Manage</h2>
                    </div>
                    <p className="gd-action-text">Edit this game in your custom lists and collections</p>
                    <Link to="/OptionA/tracker" className="gd-lists-link">
                        Go to My Lists →
                    </Link>
                </div>
            </div>
        </div>
    );
}