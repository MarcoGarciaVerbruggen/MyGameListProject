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

            <div className="gd-card">
                <div>
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

                <div className="gd-info">
                    <h1>{game.title}</h1>

                    <p className="gd-platform">
                        {game.platform}
                    </p>

                    <p className="gd-release">
                        Released: {releaseDate}
                    </p>

                    <div className="gd-section">
                        <h2>My List</h2>

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
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}