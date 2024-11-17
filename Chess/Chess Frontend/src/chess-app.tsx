// import React, { useState } from "react";
// // import { Card } from '@/components/ui/card';

// type PieceType =
//   | "k"
//   | "q"
//   | "r"
//   | "b"
//   | "n"
//   | "p"
//   | "K"
//   | "Q"
//   | "R"
//   | "B"
//   | "N"
//   | "P"
//   | "";
// type Player = "white" | "black";
// type Board = PieceType[][];
// type Position = { row: number; col: number } | null;

// const INITIAL_BOARD: Board = [
//   ["r", "n", "b", "q", "k", "b", "n", "r"],
//   ["p", "p", "p", "p", "p", "p", "p", "p"],
//   Array(8).fill(""),
//   Array(8).fill(""),
//   Array(8).fill(""),
//   Array(8).fill(""),
//   ["P", "P", "P", "P", "P", "P", "P", "P"],
//   ["R", "N", "B", "Q", "K", "B", "N", "R"],
// ];

// interface PieceSymbols {
//   [key: string]: string;
// }

// const ChessApp: React.FC = () => {
//   const [board, setBoard] = useState<Board>(INITIAL_BOARD);
//   const [selectedPiece, setSelectedPiece] = useState<Position>(null);
//   const [currentPlayer, setCurrentPlayer] = useState<Player>("white");

//   const getPieceSymbol = (piece: PieceType): string => {
//     const symbols: PieceSymbols = {
//       k: "♔",
//       q: "♕",
//       r: "♖",
//       b: "♗",
//       n: "♘",
//       p: "♙",
//       K: "♚",
//       Q: "♛",
//       R: "♜",
//       B: "♝",
//       N: "♞",
//       P: "♟",
//     };
//     return symbols[piece] || "";
//   };

//   const isPieceOwner = (piece: PieceType): boolean => {
//     if (!piece) return false;
//     return currentPlayer === "white"
//       ? piece === piece.toUpperCase()
//       : piece === piece.toLowerCase();
//   };

//   const handleSquareClick = (row: number, col: number): void => {
//     if (selectedPiece) {
//       // Move logic would go here
//       const newBoard: Board = [...board];
//       // Implement move validation and execution here
//       setSelectedPiece(null);
//       setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
//     } else if (isPieceOwner(board[row][col])) {
//       setSelectedPiece({ row, col });
//     }
//   };

//   const getSquareColor = (row: number, col: number): string => {
//     const isSelected = selectedPiece?.row === row && selectedPiece?.col === col;
//     const isEven = (row + col) % 2 === 0;

//     if (isSelected) return "bg-yellow-200";
//     return isEven ? "bg-gray-200" : "bg-gray-400";
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="p-8">
//         <div className="grid gap-0">
//           {board.map((row, rowIndex) => (
//             <div key={rowIndex} className="flex">
//               {row.map((piece, colIndex) => (
//                 <div
//                   key={`${rowIndex}-${colIndex}`}
//                   className={`w-16 h-16 flex items-center justify-center cursor-pointer ${getSquareColor(
//                     rowIndex,
//                     colIndex
//                   )}`}
//                   onClick={() => handleSquareClick(rowIndex, colIndex)}
//                 >
//                   <span className="text-4xl select-none">
//                     {getPieceSymbol(piece)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//         <div className="mt-4 text-center">{currentPlayer}'s turn</div>
//       </div>
//     </div>
//   );
// };

// export default ChessApp;
