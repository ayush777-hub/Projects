import React from "react";
import { Tile } from "../chess.model";
import { useStyles } from "./Chess.style";
import DisplayPiece from "./DisplayPiece";
import { ValidationHelper } from "../constants/Helper/ChessValidationHelper";
import { CommonHelper } from "../constants/Helper/CommonHelper";

export interface IChessTileProps {
  tile: Tile;
  chessBoard: Array<Array<Tile>>;
}
const ChessTile = (props: IChessTileProps) => {
  var styles = useStyles();
  var DisplayAvailableMoves = (): void => {
    CommonHelper.ClearHelpingMoves(props.chessBoard);
    if (ValidationHelper.KingUnderAttack(props.chessBoard)) {
      // Only display moves for the current piece that can save the king
      return;
    }
    var selectedPiece = props.tile.getOccupiedBy();
    var availableNextMoves = selectedPiece?.GetNextMoves(props.chessBoard);
    CommonHelper.ShowHelpingMoves(props.chessBoard, availableNextMoves);
  };

  return (
    <div
      className={`${styles.chessTile} ${
        props.tile.getShade() == "white"
          ? styles.whiteBackground
          : styles.blackBackground
      }`}
      onClick={DisplayAvailableMoves}
    >
      {props.tile.isOccupied() ? (
        <DisplayPiece chessPieceToDisplay={props.tile.getOccupiedBy()} />
      ) : (
        ""
      )}
    </div>
  );
};

export default ChessTile;
