import baseStyled, { ThemedStyledInterface } from "styled-components";

export interface AppTheme {
  bgColor: string;
  textColor: "white" | "black";
  customColors: {
    black1: string;
    green1: string;
    darkBlue1: string;
    white1: string;
  };
}

export const defaultTheme: AppTheme = {
  bgColor: "#D87260",
  textColor: "white",
  customColors: {
    green1: "rgb(80, 217, 80)",
    darkBlue1: "rgb(6, 7, 15)",
    black1: "black",
    white1: "white",
  },
};

export const styled = baseStyled as ThemedStyledInterface<AppTheme>;
