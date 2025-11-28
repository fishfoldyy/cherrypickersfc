import React from "react";
import Scoreboard from "./components/Scoreboard";

function App() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>⚽ My Football Team Scoreboard</h1>
      </header>
      <main style={styles.main}>
        <Scoreboard />
      </main>
      <footer style={styles.footer}>
        <p>Powered by React • Free deployment</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
    background: "#f9f9f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "#4CAF50",
    color: "white",
    padding: "20px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  main: {
    flex: 1,
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  footer: {
    background: "#eee",
    padding: "10px 0",
    fontSize: "14px",
  },
};

export default App;