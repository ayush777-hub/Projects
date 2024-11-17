import React from "react";
import { createUseStyles } from "react-jss";

interface Theme {
  spacing: {
    unit: number;
  };
  palette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

// Define the theme
const theme: Theme = {
  spacing: {
    unit: 8,
  },
  palette: {
    primary: "#1976d2",
    secondary: "#dc004e",
    background: "#ffffff",
    text: "#000000",
  },
};

// Define style types
type StyleProps = {
  isActive?: boolean;
  color?: string;
};

// Create styles using JSS syntax
export const useStyles = createUseStyles((theme: Theme) => ({
  chessTile: {
    width: "100px",
    height: "100px",
    color: "black",
    border: "1px solid",
    borderRadius: "5px",
    fontSize: "50px",
  },
  whiteBackground: {
    backgroundColor: "#EFF0F9",
  },
  blackBackground: {
    backgroundColor: "#626262",
  },
  whiteChessPiece: {
    border: "boldest solid 2px 2px",
  },
  ChessBoard: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gridTemplateRows: "repeat(8, 1fr)",
    aspectRatio: "1",
  },
  PotentialMove: {
    backgroundColor: "rgb(120,175,255,0.9)",
    border: "1px solid rgb(0,0,100,0.9)",
  },
  Arena: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Timer: {
    height: "100%",
    padding: "4px",
  },
  PLayerTimer: {
    padding: "4px",
  },
  //   // Media queries
  //   responsive: {
  //     width: "100%",

  //     "@media (min-width: 600px)": {
  //       width: "50%",
  //     },

  //     "@media (min-width: 960px)": {
  //       width: "33.33%",
  //     },
  //   },

  //   // Keyframe animations
  //   "@keyframes fadeIn": {
  //     from: { opacity: 0 },
  //     to: { opacity: 1 },
  //   },

  //   animated: {
  //     animation: "$fadeIn 0.3s ease-in",
  //   },

  //   // Global styles
  //   "@global": {
  //     body: {
  //       margin: 0,
  //       fontFamily: "Arial, sans-serif",
  //     },
  //   },
}));
