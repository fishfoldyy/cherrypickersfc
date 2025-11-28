import React, { useEffect, useState } from "react";
import fetchScores from "../data/fetchScores";
import MatchCard from "./MatchCard";

export default function Scoreboard() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchScores().then(setMatches);
  }, []);

  return (
    <div>
      {matches.length === 0 ? (
        <p>Loading scores...</p>
      ) : (
        matches.map((match, index) => <MatchCard key={index} match={match} />)
      )}
    </div>
  );
}