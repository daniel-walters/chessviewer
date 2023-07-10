import React, { useState } from "react";

import pgn from "../../test";

import MoveViewer from "./MoveViewer";

import ArrowLeft from "../../../public/arrow-left.svg?svgr";
import ArrowRight from "../../../public/arrow-right.svg?svgr";

import styles from "./moveinfo.module.scss";
import { MoveInformation } from "@chessviewer/parser";

type MoveInfoProps = {
  curMove: number;
  moves: MoveInformation[];
  handleReset: (pgn: string) => void;
  handleMove: (direction: "NEXT" | "PREV") => void;
};

function MoveInfo({ handleReset, handleMove, moves, curMove }: MoveInfoProps) {
  const [curPgn, setCurPgn] = useState<string>(pgn);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className={styles["move-info"]}>
      <div className={styles["move-info--title"]}>
        <h2>Moves</h2>
      </div>
      <MoveViewer
        className={styles["move-info--viewer"]}
        moves={moves}
        curMove={curMove}
      />
      {edit && (
        <div className={styles["move-info--input"]}>
          <textarea
            placeholder="Enter your PGN here..."
            value={curPgn}
            onChange={(e) => setCurPgn(e.target.value)}
            spellCheck={false}
          />
          {!!error && <p className={styles["error-text"]}>{error}</p>}
        </div>
      )}
      <button
        className={styles["move-info--cta"]}
        onClick={() => {
          try {
            if (!edit) {
              setEdit(true);
              return;
            }
            handleReset(curPgn);
            setError("");
            setEdit(false);
          } catch (e) {
            setError(
              "Something went wrong reading the PGN. Please check the format and try again."
            );
          }
        }}
      >
        {edit ? "Load game" : "Edit PGN"}
      </button>
      <div className={styles["move-info--controls"]}>
        <button disabled={curMove <= -1} onClick={() => handleMove("PREV")}>
          <ArrowLeft />
        </button>
        <button
          disabled={curMove === moves.length - 1}
          onClick={() => handleMove("NEXT")}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
}

export default MoveInfo;
