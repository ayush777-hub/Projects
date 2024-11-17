import React, { useState } from "react";
import { Player } from "../chess.model";

interface IRegisterProp {
  playerData: Player[];
  setplayerData: React.Dispatch<React.SetStateAction<Player[]>>;
}

const Register = ({ playerData, setplayerData }: IRegisterProp) => {
  var [player1Name, setplayer1Name] = useState(playerData[0].playerName);
  var [player2Name, setplayer2Name] = useState(playerData[1].playerName);

  return (
    <>
      <> Welcome to Chess.fake.com !!!!</>
      {playerData.map((player, index) => {
        return (
          <div key={index}>
            <label htmlFor={player.playerId}>Name:</label>
            <input
              placeholder={player.playerName}
              id={player.playerId}
              onChange={(e) => {
                if (index == 0) setplayer1Name(e.target.value);
                else setplayer2Name(e.target.value);
              }}
            />
            <button
              onClick={() => {
                player.playerName = index == 0 ? player1Name : player2Name;
                player.toStartConfirmation = true;
                setplayerData([...playerData]);
                console.log(playerData);
              }}
            >
              Lessssgo !!!
            </button>
          </div>
        );
      })}
    </>
  );
};

export default Register;
