import React, { useEffect } from "react";
import { Player } from "../chess.model";
import { useStyles } from "./Chess.style";

interface IGameTimerProp {
  playerData: Player[];
  setPlayerData: any;
}
const GameTimer = ({ playerData, setPlayerData }: IGameTimerProp) => {
  var styles = useStyles();
  useEffect(() => {
    var updateTimer = () => {
      setInterval(() => {
        if (
          playerData.find((player) => player.playerNumber == "player1")!
            .isMyTurn
        ) {
          playerData.find(
            (player) => player.playerNumber == "player1"
          )!.timeLeft -= 1;
        } else {
          playerData.find(
            (player) => player.playerNumber == "player2"
          )!.timeLeft -= 1;
        }
        setPlayerData([...playerData]);
      }, 1000);
    };
    updateTimer();
  }, []);
  return (
    <div className={`${styles.Timer}`}>
      <div className={styles.PLayerTimer}>
        {
          playerData.find((player) => player.playerNumber == "player1")!
            .timeLeft
        }
      </div>
      <div className={styles.PLayerTimer}>
        {
          playerData.find((player) => player.playerNumber == "player2")!
            .timeLeft
        }
      </div>
    </div>
  );
};

export default GameTimer;
