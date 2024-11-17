import React, { useState } from "react";
import { Board, Tile } from "../chess.model";
import ChessTile, { IChessTileProps } from "./ChessTile";
import { useStyles } from "./Chess.style";

const ChessBoard = () => {
  var initalBoardState = new Board();
  initalBoardState.startNew();
  var styles = useStyles();

  var [chessBoardState, useChessBoardState] = useState<Array<Array<Tile>>>(
    initalBoardState.BoardState
  );

  return (
    <>
      <div className={`${styles.ChessBoard}`}>
        {chessBoardState.map((chessRow) => {
          return chessRow.map((tile) => {
            return <ChessTile tile={tile} chessBoard={chessBoardState} />;
          });
        })}
      </div>
    </>
  );
};

export default ChessBoard;
