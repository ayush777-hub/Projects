import { StrictMode, useState } from "react";
import "./App.css";
import ChessBoard from "./Component/ChessBoard";
import { Player } from "./chess.model";
import Register from "./Component/Register";

function App() {
  var [playerData, setPlayerData] = useState(setRandomPlayerData());
  return (
    <>
      {playerData[0].toStartConfirmation &&
      playerData[1].toStartConfirmation ? (
        <ChessBoard playerData={playerData} setPlayerData={setPlayerData} />
      ) : (
        <Register playerData={playerData} setplayerData={setPlayerData} />
      )}
    </>
  );
}

function setRandomPlayerData(): Player[] {
  var randomPLayerData = new Array<Player>();
  randomPLayerData.push({
    playerName: "PLayer1",
    isMyTurn: true,
    toStartConfirmation: false,
    playerId: crypto.randomUUID(),
    timeLeft: 600,
    color: "white",
    playerNumber: "player1",
  });
  randomPLayerData.push({
    playerName: "PLayer2",
    isMyTurn: false,
    toStartConfirmation: false,
    playerId: crypto.randomUUID(),
    timeLeft: 600,
    color: "black",
    playerNumber: "player2",
  });
  return randomPLayerData;
}

export default App;
