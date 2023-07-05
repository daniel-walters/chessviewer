"use client";
import React from "react";

interface Props {
  chessboard: any[];
}

function movePieceButton(props: Props) {
  const fn = () => {
    console.log(props.chessboard);
  };
  return <button onClick={fn}>Move Piece</button>;
}

export default movePieceButton;
