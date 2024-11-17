import React, { useState } from "react";
import { Board, ChessPiece, Player, Tile } from "../chess.model";
import ChessTile, { IChessTileProps } from "./ChessTile";
import { useStyles } from "./Chess.style";
import User from "./User";
import GameTimer from "./GameTimer";

interface IGameProp {
  playerData: Player[];
  setPlayerData: any;
}
const ChessBoard = (props: IGameProp) => {
  var initalBoardState = new Board();
  initalBoardState.startNew();
  var styles = useStyles();

  var [chessBoard, setChessBoard] = useState<Board>(initalBoardState);
  var [selectedPiece, setselectedPiece] = useState<ChessPiece | null>(null);
  var [activeUser, setActiveUser] = useState<Player>(props.playerData[0]);
  return (
    <>
      <User
        {...props.playerData.find(
          (player) => player.playerNumber == "player1"
        )!}
      />
      <div className={styles.Arena}>
        <div className={`${styles.ChessBoard}`}>
          {chessBoard.BoardState.map((chessRow, indexX) => {
            console.log("Rerender happended at chessboard");
            return chessRow.map((tile, indexY) => {
              return (
                <ChessTile
                  key={indexX + "#" + indexY}
                  tile={tile}
                  chessBoard={chessBoard}
                  setChessBoard={setChessBoard}
                  playerData={props.playerData}
                  setPlayerData={props.setPlayerData}
                  selectedPiece={selectedPiece}
                  setSelectedPiece={setselectedPiece}
                />
              );
            });
          })}
        </div>
        <GameTimer
          playerData={props.playerData}
          setPlayerData={props.setPlayerData}
        />
      </div>
      <User
        {...props.playerData.find(
          (player) => player.playerNumber == "player2"
        )!}
      />
    </>
  );
};

export default ChessBoard;
