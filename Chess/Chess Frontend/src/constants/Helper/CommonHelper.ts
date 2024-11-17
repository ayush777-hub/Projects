import { Position, Tile } from "../../chess.model";

export class CommonHelper {
  static ClearHelpingMoves(chessBoard: Array<Array<Tile>>) {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        chessBoard[i][j].unMarkAsPotentialMove();
      }
    }
  }
  static ShowHelpingMoves(
    chessBoard: Array<Array<Tile>>,
    potentialMoves: Array<Position> | undefined
  ) {
    potentialMoves?.forEach((move) => {
      var [curX, curY] = move.getCurrentPositionAsNumber();
      chessBoard[curX][curY].markAsPotentialMove();
    });
  }
}
