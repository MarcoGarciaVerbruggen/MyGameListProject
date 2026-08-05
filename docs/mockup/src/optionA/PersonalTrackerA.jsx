import { Link } from "react-router-dom";

import { games } from "/resources/gameData.js";
import { steamCoverUrl } from "../utils/steam";

import "../PersonalTracker.css";

export default function PersonalTrackerA() {
    const tracker = JSON.parse(
        sessionStorage.getItem("gameTracker") || "{}"
    );

    const trackedGames = games
        .filter((game) => tracker[game.id]?.status)
        .sort((a, b) => {
            const scoreA = tracker[a.id]?.score ?? 0;
            const scoreB = tracker[b.id]?.score ?? 0;

            return scoreB - scoreA;
        });

    return (
        <div className="pt-page">
            <Link className="pt-back" to="/OptionA">
                ← Back to Top Games
            </Link>

            <header className="pt-header">
                <h1>My Game List</h1>
                <p>{trackedGames.length} tracked games</p>
            </header>

            {trackedGames.length === 0 ? (
                <div className="pt-empty">
                    <h2>Your tracker is empty.</h2>
                    <p>
                        Open a game and add it to your tracker.
                    </p>
                </div>
            ) : (
                <div className="pt-list">
                    {trackedGames.map((game, index) => {
                        const entry = tracker[game.id];

                        const cover = game.steam
                            ? steamCoverUrl(game.steam)
                            : game.banner;

                        return (
                            <Link
                                key={game.id}
                                to={`/OptionA/game/${game.id}`}
                                className="pt-row"
                            >
                                <div className="pt-rank">
                                    #{index + 1}
                                </div>

                                {cover ? (
                                    <img
                                        src={cover}
                                        alt={game.title}
                                        className="pt-cover"
                                    />
                                ) : (
                                    <div className="pt-cover-placeholder">
                                        {game.title.charAt(0)}
                                    </div>
                                )}

                                <div className="pt-info">
                                    <h2>{game.title}</h2>

                                    <p>{game.platform}</p>

                                    <span className="pt-status">
                    {entry.status}
                  </span>
                                </div>

                                <div className="pt-score">
                                    {entry.score ?? "-"}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}