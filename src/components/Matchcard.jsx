import React from "react";

export default function MatchCard({ match }) {
  return (
    <div style={styles.card}>
      <h3>
        {match.teamA} ⚔ {match.teamB}
      </h3>
      <p>
        <strong>{match.scoreA} - {match.scoreB}</strong>
      </p>
      <p>{match.date}</p>
    </div>
  );
}

const styles = {
  card: {
    padding: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    marginBottom: "12px",
    background: "#fafafa",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};