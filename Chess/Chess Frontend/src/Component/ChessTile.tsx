import React, { MouseEventHandler, useEffect, useState } from "react";
import { Board, ChessPiece, Player, Tile } from "../chess.model";
import { useStyles } from "./Chess.style";
import DisplayPiece from "./DisplayPiece";
import { deepClone } from "../constants/Helper/CommonHelper";
import cloneDeep from "lodash/cloneDeep";

export interface IChessTileProps {
  tile: Tile;
  chessBoard: Board;
  setChessBoard: React.Dispatch<React.SetStateAction<Board>>;
  playerData: Player[];
  setPlayerData: React.Dispatch<React.SetStateAction<Player[]>>;
  selectedPiece: ChessPiece | null;
  setSelectedPiece: React.Dispatch<React.SetStateAction<ChessPiece | null>>;
}
const ChessTile = (props: IChessTileProps) => {
  var styles = useStyles();
  var [activePLayer, setActivePlayer] = useState(
    props.playerData.find((player) => player.isMyTurn)
  );
  useEffect(() => {
    setActivePlayer(props.playerData.find((player) => player.isMyTurn));
  }, [props.playerData]);
  var DisplayAvailableMoves = (): void => {
    props.chessBoard.ClearHelpingMoves();
    var selectedPiece = props.tile.getOccupiedBy();
    var availableNextMoves = selectedPiece?.GetNextMoves(props.chessBoard);
    //console.log(availableNextMoves);
    props.chessBoard.ShowHelpingMoves(availableNextMoves);
    props.setSelectedPiece(selectedPiece);
    props.setChessBoard(cloneDeep(props.chessBoard));
  };
  var HandleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.preventDefault();
    if (props.tile.isPotentialMoveSet() && props.selectedPiece != null) {
      var [tileX, tileY] = props.tile.postion.getCurrentPositionAsNumber();
      var targetTile = props.chessBoard.BoardState[tileX][tileY];
      var [oldX, oldY] =
        props.selectedPiece.position.getCurrentPositionAsNumber();
      //targetTile.OccupyTile(props.selectedPiece); eed to check why is is not working
      targetTile.isPiecePresent = true;
      props.chessBoard.BoardState[oldX][oldY].isPiecePresent = false;
      props.chessBoard.BoardState[oldX][oldY].occupiedBy = null;

      targetTile.occupiedBy = props.selectedPiece;
      props.selectedPiece.position = targetTile.postion;
      props.chessBoard.BoardState[tileX][tileY] = targetTile;
      props.chessBoard.ClearHelpingMoves();
      props.setChessBoard(cloneDeep(props.chessBoard));
      var nextPlayer = props.playerData.find((player) => !player.isMyTurn);
      nextPlayer!.isMyTurn = true;
      activePLayer!.isMyTurn = false;
      props.setPlayerData([nextPlayer!, activePLayer!]);
      console.log("In handleClick move action");
      return;
    }
    if (
      activePLayer?.color == props.tile.getOccupiedBy()?.pieceType?.getColor()
    ) {
      DisplayAvailableMoves();
    }
  };
  return (
    <div
      className={`${styles.chessTile} ${
        props.tile.getShade() == "white"
          ? styles.whiteBackground
          : styles.blackBackground
      } ${props.tile.isPotentialMoveSet() ? styles.PotentialMove : ""}`}
      onClick={HandleClick}
    >
      {
        /*TODO: Need to check why if I do here props.tile.isOccupiedBy() it is returning different value than when I am directly accessing the value */
        props.tile.isPiecePresent ? (
          <DisplayPiece chessPieceToDisplay={props.tile.getOccupiedBy()} />
        ) : (
          ""
        )
      }
    </div>
  );
};

export default ChessTile;
