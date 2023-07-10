import React from "react";

import styles from "./usage.module.scss";

function UsageModal() {
  return (
    <div className={styles["usage-modal"]}>
      <h1>Usage</h1>
      <p>
        ChessViewer accepts any valid PGN (
        <a href="https://www.chess.com/terms/chess-pgn" target="_blank">
          Read more
        </a>
        ) formatted text, and dispays the game on the chessboard.
      </p>
      <p>
        The game can be stepped through by using the left and right buttons
        located under the moves list.
      </p>
      <p>
        A game has been pre-loaded into the text field, but feel free to delete
        it and replace with your own PGN&apos;s, or find some{" "}
        <a href="https://www.pgnmentor.com/files.html" target="_blank">
          here
        </a>
        .
      </p>
      <p>
        Just be sure to press the &quot;Load game&quot; button once youve pasted
        in your PGN.
      </p>
    </div>
  );
}

export default UsageModal;
