import React from "react";
import classNames from "classnames";

import { MoveInformation } from "@chessviewer/parser";

import styles from "./moveviewer.module.scss";

type MoveViewerProps = {
  className?: string;
  moves: MoveInformation[];
  curMove: number;
};

function MoveViewer({ className, moves, curMove }: MoveViewerProps) {
  return (
    <div className={classNames(styles["move-viewer"], className)}>
      {moves.map((move, i) => {
        const moveNum = i / 2 + 1;
        return (
          <span key={`${i}-${move.rawPGN}`}>
            {i % 2 === 0 && (
              <span className={styles["move-viewer--move-number"]}>
                {moveNum}.{" "}
              </span>
            )}
            <span
              className={classNames(
                styles["move-viewer--pgn"],
                i === curMove && styles["highlight"]
              )}
            >
              {move.rawPGN}
              {` `}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default MoveViewer;
