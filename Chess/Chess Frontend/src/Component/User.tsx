import React from "react";

interface IUserProps {
  playerName: string;
  isMyTurn: boolean;
  toStartConfirmation: boolean;
  playerId: string;
}

const User = (props: IUserProps) => {
  return <div>{props.playerName}</div>;
};

export default User;
