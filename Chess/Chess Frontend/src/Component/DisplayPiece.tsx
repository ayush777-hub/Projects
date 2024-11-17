import React from "react";
import { ChessPiece } from "../chess.model";
import { useStyles } from "./Chess.style";

interface IDisplayChessPiece {
  chessPieceToDisplay: ChessPiece | undefined | null;
}
const DisplayPiece = (props: IDisplayChessPiece) => {
  var styles = useStyles();
  var piece = props.chessPieceToDisplay;
  var pieceType = piece?.pieceType?.getColor();
  return (
    <div className={`${pieceType == "white" ? styles.whiteChessPiece : ""}`}>
      {props.chessPieceToDisplay?.pieceType?.GetSymbol()}
    </div>
  );
};

export default DisplayPiece;
