import { ChessPieceConstantDictionary } from "./constants/ChessDictionary";

var colorOption: "black" | "white" | null;

export class Position {
  private X_pos: number = 0;
  private Y_pos: number = 0;

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
    return new Array<number>(...[this.X_pos, this.Y_pos]);
  }
}

// Piece Behaviour definitions
export abstract class ChessPiece {
  pieceType?: PieceType;
  isFirstMove?: boolean;
  position?: Position;
  direction?: number; //Will be used in case of Pawn only
  abstract currentPosition(): Position;
  abstract GetNextMoves(
    currentChessBoardState: Array<Array<Tile>>
  ): Array<Position>;
  abstract Move(newX: number, newY: number): Position;
  // Validation
  CheckAppend(
    currentChessBoardState: Array<Array<Tile>>,
    possibleDirections: number[][],
    currentPosition: Position,
    nextMoveList: Position[]
  ): Position[] {
    possibleDirections.forEach((direction) => {
      var [moveX, moveY] = [...direction];
      var [posX, posY] = currentPosition.getCurrentPositionAsNumber();

      if (
        this.isInsideBoard(posX + moveX) &&
        this.isInsideBoard(posY + moveY)
      ) {
        this.TakeDecisionBasedAddition(
          posX + moveX,
          posY + moveY,
          currentChessBoardState,
          nextMoveList
        );
      }
    });
    return nextMoveList;
  }

  // Moves
  isInsideBoard(position: number): boolean {
    return !(position < 0 || position > 7);
  }
  iterateOnX(
    curX: number,
    curY: number,
    listOfMoves: Position[],
    currentChessBoardState: Array<Array<Tile>>
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
  iterateOnY(
    curX: number,
    curY: number,
    listOfMoves: Position[],
    currentChessBoardState: Array<Array<Tile>>
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
    currentChessBoardState: Array<Array<Tile>>
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
    currentChessBoardState: Array<Array<Tile>>
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
    currentChessBoardState: Tile[][],
    listOfMoves: Position[]
  ): boolean {
    var newChessBoardState = structuredClone(currentChessBoardState);
    newChessBoardState[tempX][tempY].OccupyTile(this);
    if (currentChessBoardState[tempX][tempY].isOccupied()) {
      if (this.IsKingSafeAfterThisMove(newChessBoardState)) {
        if (
          currentChessBoardState[tempX][tempY]
            .getOccupiedBy()
            ?.pieceType?.getColor() != this.pieceType?.getColor()
        ) {
          listOfMoves.push(new Position(tempX, tempY));
        }
      }
      return false;
    } else {
      if (this.IsKingSafeAfterThisMove(newChessBoardState)) {
        listOfMoves.push(new Position(tempX, tempY));
      }
    }
    return true;
  }
  IsKingSafeAfterThisMove(newChessBoardState: Tile[][]): boolean {
    var color = this.pieceType?.getColor();
    // Here the logic for checing if the king is unedr attack or not wil go. retuening true as of now.
    return true;
  }
}
export class PieceType {
  private pieceName?: string;
  private pieceSymbol: any;
  private color?: typeof colorOption;

  constructor(
    _pieceName?: string,
    _pieceSymbol?: string,
    _color?: typeof colorOption
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
  pieceType = new PieceType();
  isFirstMove = true;
  position = new Position(0, 0);

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
  GetNextMoves(currentChessBoardState: Array<Array<Tile>>): Array<Position> {
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
}
export class RookPiece extends ChessPiece {
  pieceType = new PieceType();
  isFirstMove = true;
  position = new Position(0, 0);

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
  GetNextMoves(currentChessBoardState: Array<Array<Tile>>): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    var [curX, curY] = currentPosition.getCurrentPositionAsNumber();
    this.iterateOnX(curX, curY, nextMoveList, currentChessBoardState);
    this.iterateOnY(curX, curY, nextMoveList, currentChessBoardState);
    return nextMoveList;
  }
  Move(newX: number, newY: number): Position {
    this.position.SetNewPosition(newX, newY);
    return this.position;
  }
}
export class BishopPiece extends ChessPiece {
  pieceType = new PieceType();
  isFirstMove = true;
  position = new Position(0, 0);

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
  GetNextMoves(currentChessBoardState: Array<Array<Tile>>): Array<Position> {
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
  pieceType = new PieceType();
  isFirstMove = true;
  position = new Position(0, 0);

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
  GetNextMoves(currentChessBoardState: Array<Array<Tile>>): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    var ret = new Array<Position>();
    var [curX, curY] = currentPosition.getCurrentPositionAsNumber();
    this.iterateOnX(curX, curY, ret, currentChessBoardState);
    this.iterateOnY(curX, curY, ret, currentChessBoardState);
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
  pieceType = new PieceType();
  isFirstMove = true;
  position = new Position(0, 0);

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
  GetNextMoves(currentChessBoardState: Array<Array<Tile>>): Array<Position> {
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
  pieceType = new PieceType();
  isFirstMove = true;
  position = new Position(0, 0);
  direction = -1; // -1 means down, 1 means up
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
  GetNextMoves(currentChessBoardState: Array<Array<Tile>>): Array<Position> {
    var currentPosition = this.position;
    var nextMoveList = new Array<Position>();
    var possibleDirections = new Array<Array<number>>();
    possibleDirections.push([0, this.direction]);
    possibleDirections.push([1, this.direction]);
    possibleDirections.push([-1, this.direction]);
    if (this.isFirstMove) {
      possibleDirections.push([0, 2 * this.direction]);
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
}
export class Tile {
  private isPiecePresent?: boolean;
  private occupiedBy?: ChessPiece | null;
  private postion?: Position;
  private potentialMove?: boolean = false;
  private isAttakedByWhite?: boolean;
  private isAttackedByBlack?: boolean;
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
  OccupyTile = (piece: ChessPiece) => {
    this.isPiecePresent = true;
    this.occupiedBy = piece;
  };
  LeaveTile = () => {
    this.isPiecePresent = true;
    this.occupiedBy = null;
  };
  isOccupied = (): boolean | undefined => {
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
  CalculateAttacks() {}
}
