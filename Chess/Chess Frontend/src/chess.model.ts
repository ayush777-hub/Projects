import { forEach } from "lodash";
import { ChessPieceConstantDictionary } from "./constants/ChessDictionary";
import { CanAttack, deepClone } from "./constants/Helper/CommonHelper";
var colorOption: "black" | "white" | null;

export class Position {
  private X_pos: number;
  private Y_pos: number;

  constructor(posX: number, posY: number) {
    this.X_pos = posX;
    this.Y_pos = posY;
  }

  public getCurrentPositionInString() {
    return (
      String.fromCharCode("A".charCodeAt(0) + this.X_pos) +
      this.Y_pos.toString()
    );
  }

  public SetNewPosition(posX: number, posY: number) {
    this.X_pos = posX;
    this.Y_pos = posY;
  }

  public getCurrentPositionAsNumber(): number[] {
    return [this.X_pos, this.Y_pos];
  }
}

// Piece Behaviour definitions
export abstract class ChessPiece {
  pieceType: PieceType = new PieceType("Pawn", "", "black");
  isFirstMove: boolean = true;
  position: Position = new Position(0, 0);
  direction?: number; //Will be used in case of Pawn only
  abstract currentPosition(): Position;
  abstract GetNextMoves(currentChessBoardState: Board): Array<Position>;
  abstract Move(newX: number, newY: number): Position;
  // Validation
  CheckAppend(
    currentChessBoardState: Board,
    possibleDirections: number[][],
    currentPosition: Position,
    nextMoveList: Position[]
  ): Position[] {
    possibleDirections.forEach((direction) => {
      var [moveX, moveY] = [...direction];
      var [posX, posY] = currentPosition.getCurrentPositionAsNumber();

      this.TakeDecisionBasedAddition(
        posX + moveX,
        posY + moveY,
        currentChessBoardState,
        nextMoveList
      );
    });
    return nextMoveList;
  }

  // Moves
  isInsideBoard(position: number): boolean {
    return !(position < 0 || position > 7);
  }
  iterateVertically(
    curX: number,
    curY: number,
    listOfMoves: Position[],
    currentChessBoardState: Board
  ) {
    var tempX = curX;
    var tempY = curY;
    while (tempX > 0) {
      tempX--;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
    tempX = curX;
    while (tempX < 7) {
      tempX++;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
  }
  iterateHorizontally(
    curX: number,
    curY: number,
    listOfMoves: Position[],
    currentChessBoardState: Board
  ) {
    var tempX = curX;
    var tempY = curY;
    while (tempY > 0) {
      tempY--;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
    tempY = curY;
    while (tempY < 7) {
      tempY++;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
  }
  iterateRightDiagonal(
    curX: number,
    curY: number,
    listOfMoves: Position[],
    currentChessBoardState: Board
  ) {
    var [tempX, tempY] = [curX, curY];
    while (tempX - 1 >= 0 && tempY - 1 >= 0) {
      tempX--;
      tempY--;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
    [tempX, tempY] = [curX, curY];
    while (tempX + 1 < 8 && tempY + 1 < 8) {
      tempX++;
      tempY++;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
  }
  iterateLeftDiagonal(
    curX: number,
    curY: number,
    listOfMoves: Position[],
    currentChessBoardState: Board
  ) {
    var [tempX, tempY] = [curX, curY];
    while (tempX - 1 >= 0 && tempY + 1 < 8) {
      tempX--;
      tempY++;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
    [tempX, tempY] = [curX, curY];
    while (tempX + 1 < 8 && tempY - 1 >= 0) {
      tempX++;
      tempY--;
      var shallContinue = this.TakeDecisionBasedAddition(
        tempX,
        tempY,
        currentChessBoardState,
        listOfMoves
      );
      if (!shallContinue) {
        break;
      }
    }
  }

  TakeDecisionBasedAddition(
    tempX: number,
    tempY: number,
    currentChessBoardState: Board,
    listOfMoves: Position[]
  ): boolean {
    if (!this.isInsideBoard(tempX) || !this.isInsideBoard(tempY)) return false;

    //var newChessBoardState = deepClone<Board>(currentChessBoardState);
    if (
      currentChessBoardState.BoardState[tempX][tempY].isOccupied() &&
      currentChessBoardState.BoardState[tempX][
        tempY
      ].occupiedBy!?.pieceType?.getColor() == this.pieceType?.getColor()
    )
      return false;
    var [oldPosX, oldPosY] = this.position.getCurrentPositionAsNumber();
    var prevState = currentChessBoardState.BoardState[tempX][tempY].occupiedBy!;
    currentChessBoardState.BoardState[tempX][tempY].LeaveTile();
    currentChessBoardState.BoardState[oldPosX][oldPosY].LeaveTile();
    currentChessBoardState.BoardState[tempX][tempY].OccupyTile(this);
    var isKingSafe = this.IsKingSafeAfterThisMove(currentChessBoardState);
    isKingSafe ? listOfMoves.push(new Position(tempX, tempY)) : null;
    currentChessBoardState.BoardState[tempX][tempY].LeaveTile();
    currentChessBoardState.BoardState[tempX][tempY].OccupyTile(prevState);
    currentChessBoardState.BoardState[oldPosX][oldPosY].OccupyTile(this);
    return true;
  }
  IsKingSafeAfterThisMove(newChessBoard: Board): boolean {
    var color = this.pieceType?.getColor();
    var kingPiece;
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (newChessBoard.BoardState[i][j].isOccupied()) {
          if (
            newChessBoard.BoardState[i][j].occupiedBy!?.pieceType?.GetName() ==
            "King"
          ) {
            if (
              newChessBoard.BoardState[i][
                j
              ].occupiedBy!?.pieceType?.getColor() == color
            ) {
              kingPiece = newChessBoard.BoardState[i][j].occupiedBy!;
            }
          }
        }
      }
    }
    kingPiece = kingPiece as KingPiece;
    return !kingPiece.isAttackedBy(newChessBoard);
  }
}
export class PieceType {
  private pieceName: string;
  private pieceSymbol: any;
  private color: typeof colorOption;

  constructor(
    _pieceName: string,
    _pieceSymbol: string,
    _color: typeof colorOption
  ) {
    this.pieceName = _pieceName;
    this.pieceSymbol = _pieceSymbol;
    this.color = _color;
  }
  public setSymbol(symbol: string) {
    this.pieceSymbol = symbol;
  }
  public GetSymbol() {
    return this.pieceSymbol;
  }
  public setName(name: string) {
    this.pieceName = name;
  }
  public GetName() {
    return this.pieceName;
  }
  public setColor(pieceColor: typeof colorOption) {
    this.color = pieceColor;
  }
  public getColor() {
    return this.color;
  }
}

export class KingPiece extends ChessPiece {
  constructor(
    setPosition: Position,
    color: typeof colorOption,
    pieceSymbol: string
  ) {
    super();
    this.position = setPosition;
    this.pieceType = new PieceType("King", pieceSymbol, color);
  }

  currentPosition(): Position {
    return this.position;
  }
  GetNextMoves(currentChessBoardState: Board): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    return this.CheckAppend(
      currentChessBoardState,
      [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ],
      currentPosition,
      nextMoveList
    );
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
  isAttackedBy(chessBoardState: Board): boolean {
    var [curX, curY] = this.position.getCurrentPositionAsNumber();
    var [tempX, tempY] = [curX, curY];
    while (tempX - 1 >= 0) {
      tempX--;
      var isPiecePresentAtTemp =
        chessBoardState.BoardState[tempX][tempY].isOccupied();
      var isPiecePresentAtTemp2 =
        chessBoardState.BoardState[tempX][tempY].isPiecePresent;
      if (isPiecePresentAtTemp2) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Vertically.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempX + 1 < 8) {
      tempX++;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Vertically.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempY - 1 >= 0) {
      tempY--;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Horizontally.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempY + 1 < 8) {
      tempY++;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Horizontally.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempX - 1 >= 0 && tempY + 1 < 8) {
      tempX--;
      tempY++;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Diagonally.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY) &&
              this.direction != 1
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempX - 1 >= 0 && tempY - 1 >= 0) {
      tempX--;
      tempY--;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Diagonally.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY) &&
              this.direction != 1
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempX + 1 < 8 && tempY - 1 >= 0) {
      tempX++;
      tempY--;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Diagonally.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY) &&
              this.direction != -1
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var [tempX, tempY] = [curX, curY];
    while (tempX + 1 < 8 && tempY + 1 < 8) {
      tempX++;
      tempY++;
      if (chessBoardState.BoardState[tempX][tempY].isPiecePresent) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
        } else {
          if (
            CanAttack.Diagonally.includes(pieceOccupied!.pieceType.GetName())
          ) {
            var name = pieceOccupied!.pieceType.GetName();
            if (
              name == "King" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              !areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY)
            )
              break;
            if (
              name == "Pawn" &&
              areAbsoluteDiffsLessThan1(curX, tempX, curY, tempY) &&
              this.direction != -1
            )
              break;
            return true;
          }
        }
        break;
      }
    }
    var HorseMoves = new Array<Array<number>>();
    HorseMoves = [
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [-2, -1],
      [-2, 1],
      [2, -1],
      [2, 1],
    ];
    for (var i = 0; i < HorseMoves.length; i++) {
      var [moveX, moveY] = HorseMoves[i];
      tempX = curX + moveX;
      tempY = curY + moveY;
      if (
        this.isInsideBoard(tempX) &&
        this.isInsideBoard(tempY) &&
        chessBoardState.BoardState[tempX][tempY].isPiecePresent
      ) {
        var pieceOccupied =
          chessBoardState.BoardState[tempX][tempY].occupiedBy!;
        if (pieceOccupied!.pieceType.getColor() == this.pieceType.getColor()) {
          continue;
        } else {
          if (
            CanAttack.HorseMove.includes(pieceOccupied!.pieceType.GetName())
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}
export class RookPiece extends ChessPiece {
  constructor(
    setPosition: Position,
    color: typeof colorOption,
    pieceSymbol: string
  ) {
    super();
    this.position = setPosition;
    this.pieceType = new PieceType("Rook", pieceSymbol, color);
  }

  currentPosition(): Position {
    return this.position;
  }
  GetNextMoves(currentChessBoardState: Board): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    var [curX, curY] = currentPosition.getCurrentPositionAsNumber();
    this.iterateVertically(curX, curY, nextMoveList, currentChessBoardState);
    this.iterateHorizontally(curX, curY, nextMoveList, currentChessBoardState);
    return nextMoveList;
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
}
export class BishopPiece extends ChessPiece {
  constructor(
    setPosition: Position,
    color: typeof colorOption,
    pieceSymbol: string
  ) {
    super();
    this.position = setPosition;
    this.pieceType = new PieceType("Bishop", pieceSymbol, color);
  }

  currentPosition(): Position {
    return this.position;
  }
  GetNextMoves(currentChessBoardState: Board): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    var [curX, curY] = currentPosition.getCurrentPositionAsNumber();
    this.iterateLeftDiagonal(curX, curY, nextMoveList, currentChessBoardState);
    this.iterateRightDiagonal(curX, curY, nextMoveList, currentChessBoardState);
    return nextMoveList;
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
}
export class QueenPiece extends ChessPiece {
  constructor(
    setPosition: Position,
    color: typeof colorOption,
    pieceSymbol: string
  ) {
    super();
    this.position = setPosition;
    this.pieceType = new PieceType("Queen", pieceSymbol, color);
  }

  currentPosition(): Position {
    return this.position;
  }
  GetNextMoves(currentChessBoardState: Board): Array<Position> {
    var currentPosition = this.position;
    var ret = new Array<Position>();
    var [curX, curY] = currentPosition.getCurrentPositionAsNumber();
    this.iterateVertically(curX, curY, ret, currentChessBoardState);
    this.iterateHorizontally(curX, curY, ret, currentChessBoardState);
    this.iterateLeftDiagonal(curX, curY, ret, currentChessBoardState);
    this.iterateRightDiagonal(curX, curY, ret, currentChessBoardState);
    return ret;
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
}
export class HorsePiece extends ChessPiece {
  constructor(
    setPosition: Position,
    color: typeof colorOption,
    pieceSymbol: string
  ) {
    super();
    this.position = setPosition;
    this.pieceType = new PieceType("Horse", pieceSymbol, color);
  }

  currentPosition(): Position {
    return this.position;
  }
  GetNextMoves(currentChessBoardState: Board): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    return this.CheckAppend(
      currentChessBoardState,
      [
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [-2, -1],
        [-2, 1],
        [2, -1],
        [2, 1],
      ],
      currentPosition,
      nextMoveList
    );
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
}
export class PawnPiece extends ChessPiece {
  constructor(
    setPosition: Position,
    color: typeof colorOption,
    pieceSymbol: string,
    direction: number
  ) {
    super();
    this.position = setPosition;
    this.pieceType = new PieceType("Pawn", pieceSymbol, color);
    this.direction = direction;
  }

  currentPosition(): Position {
    return this.position;
  }
  GetNextMoves(currentChessBoardState: Board): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    var possibleDirections = new Array<Array<number>>();
    possibleDirections.push([this.direction!, 0]);
    possibleDirections.push([this.direction!, 1]);
    possibleDirections.push([this.direction!, -1]);
    if (this.isFirstMove) {
      possibleDirections.push([2 * this.direction!, 0]);
    }

    return this.CheckAppend(
      currentChessBoardState,
      possibleDirections,
      currentPosition,
      nextMoveList
    );
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
}

// Chess Board design
export class Board {
  BoardState = new Array<Array<Tile>>();

  startNew() {
    for (var i = 0; i < 8; i++) {
      this.BoardState.push(new Array<Tile>());
    }
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        this.BoardState[i].push(new Tile(new Position(i, j)));
      }
    }
    this.setBlackPieces();
    this.setWhitePieces();
  }
  private setBlackPieces() {
    for (var i = 0; i < 8; i++) {
      var piece = new PawnPiece(
        new Position(6, i),
        "black",
        ChessPieceConstantDictionary.black_Pawn,
        -1
      );
      this.BoardState[6][i].OccupyTile(piece);
    }
    var rookPiece1 = new RookPiece(
      new Position(7, 0),
      "black",
      ChessPieceConstantDictionary.black_Rook
    );
    this.BoardState[7][0].OccupyTile(rookPiece1);

    var rookPiece2 = new RookPiece(
      new Position(7, 7),
      "black",
      ChessPieceConstantDictionary.black_Rook
    );
    this.BoardState[7][7].OccupyTile(rookPiece2);

    var horsePiece1 = new HorsePiece(
      new Position(7, 1),
      "black",
      ChessPieceConstantDictionary.black_Horse
    );
    this.BoardState[7][1].OccupyTile(horsePiece1);

    var horsePiece2 = new HorsePiece(
      new Position(7, 6),
      "black",
      ChessPieceConstantDictionary.black_Horse
    );
    this.BoardState[7][6].OccupyTile(horsePiece2);

    var bishopPiece1 = new BishopPiece(
      new Position(7, 2),
      "black",
      ChessPieceConstantDictionary.black_Bishop
    );
    this.BoardState[7][2].OccupyTile(bishopPiece1);

    var bishopPiece2 = new BishopPiece(
      new Position(7, 5),
      "black",
      ChessPieceConstantDictionary.black_Bishop
    );
    this.BoardState[7][5].OccupyTile(bishopPiece2);

    var kingPiece = new KingPiece(
      new Position(7, 4),
      "black",
      ChessPieceConstantDictionary.black_King
    );
    this.BoardState[7][4].OccupyTile(kingPiece);

    var queenPiece = new QueenPiece(
      new Position(7, 3),
      "black",
      ChessPieceConstantDictionary.black_Queen
    );
    this.BoardState[7][3].OccupyTile(queenPiece);
  }
  private setWhitePieces() {
    for (var i = 0; i < 8; i++) {
      var piece = new PawnPiece(
        new Position(1, i),
        "white",
        ChessPieceConstantDictionary.white_Pawn,
        1
      );
      this.BoardState[1][i].OccupyTile(piece);
    }
    var rookPiece1 = new RookPiece(
      new Position(0, 0),
      "white",
      ChessPieceConstantDictionary.white_Rook
    );
    this.BoardState[0][0].OccupyTile(rookPiece1);

    var rookPiece2 = new RookPiece(
      new Position(0, 7),
      "white",
      ChessPieceConstantDictionary.white_Rook
    );
    this.BoardState[0][7].OccupyTile(rookPiece2);

    var horsePiece1 = new HorsePiece(
      new Position(0, 1),
      "white",
      ChessPieceConstantDictionary.white_Horse
    );
    this.BoardState[0][1].OccupyTile(horsePiece1);

    var horsePiece2 = new HorsePiece(
      new Position(0, 6),
      "white",
      ChessPieceConstantDictionary.white_Horse
    );
    this.BoardState[0][6].OccupyTile(horsePiece2);

    var bishopPiece1 = new BishopPiece(
      new Position(0, 2),
      "white",
      ChessPieceConstantDictionary.white_Bishop
    );
    this.BoardState[0][2].OccupyTile(bishopPiece1);

    var bishopPiece2 = new BishopPiece(
      new Position(0, 5),
      "white",
      ChessPieceConstantDictionary.white_Bishop
    );
    this.BoardState[0][5].OccupyTile(bishopPiece2);

    var kingPiece = new KingPiece(
      new Position(0, 3),
      "white",
      ChessPieceConstantDictionary.white_King
    );
    this.BoardState[0][3].OccupyTile(kingPiece);

    var queenPiece = new QueenPiece(
      new Position(0, 4),
      "white",
      ChessPieceConstantDictionary.white_Queen
    );
    this.BoardState[0][4].OccupyTile(queenPiece);
  }

  ClearHelpingMoves() {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        this.BoardState[i][j].unMarkAsPotentialMove();
      }
    }
  }
  ShowHelpingMoves(potentialMoves: Array<Position> | undefined) {
    potentialMoves?.forEach((move) => {
      var [curX, curY] = move.getCurrentPositionAsNumber();
      this.BoardState[curX][curY].markAsPotentialMove();
    });
  }
}
export class Tile {
  public isPiecePresent: boolean = false;
  public occupiedBy: ChessPiece | null = null;
  public postion: Position;
  private potentialMove: boolean = false;
  constructor(setPosition: Position) {
    this.postion = setPosition;
  }
  getShade = () => {
    var [curX, curY] = this.postion!.getCurrentPositionAsNumber();
    if ((curX + curY) % 2 == 1) {
      return "white";
    }
    return "black";
  };
  isPotentialMoveSet() {
    return this.potentialMove;
  }
  OccupyTile = (piece: ChessPiece | null) => {
    if (piece == null) {
      this.isPiecePresent = false;
      this.occupiedBy = null;
      return;
    }
    this.isPiecePresent = true;
    piece.position = this.postion!;
    this.occupiedBy = piece;
  };
  LeaveTile = () => {
    this.isPiecePresent = false;
    this.occupiedBy = null;
  };
  isOccupied = (): boolean => {
    return this.isPiecePresent;
  };
  getOccupiedBy() {
    return this.occupiedBy;
  }
  markAsPotentialMove() {
    this.potentialMove = true;
  }
  unMarkAsPotentialMove() {
    this.potentialMove = false;
  }
}
function areAbsoluteDiffsLessThan1(
  curX: number,
  tempX: number,
  curY: number,
  tempY: number
) {
  return Math.abs(curX - tempX) < 2 && Math.abs(curY - tempY);
}

export interface Player {
  playerName: string;
  isMyTurn: boolean;
  toStartConfirmation: boolean;
  playerId: string;
  timeLeft: number;
  color: "black" | "white";
  playerNumber: "player1" | "player2";
}
