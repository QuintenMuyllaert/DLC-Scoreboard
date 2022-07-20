// Interfaces
export interface LooseObject {
  [key: string]: any;
}

export type CollectionName = "accounts" | "scoreboards" | "templates" | "colors" | "jwt" | "HMP";

export interface HMP {
  deviceName: string;
  deviceType: string;
  firmwareVersion: string;
  hostName: string;
  multiScreenId: string;
  serialNumber: string;
}

export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
  serial: string;
  firstLogin: boolean;
}

export interface Scoreboard {
  name: string;
  display: boolean;
  isPlaying: boolean;
  fullscreen: boolean;
  sponsors: string[];
  hb: string;
  ho: string;
  ub: string;
  uo: string;
  t1: number;
  t2: number;
  message: string;
  nameHome: string;
  nameOut: string;
  clockData: clockData;
  serial: string;
  hasAdmin: boolean;
  colors: string[];
}

export interface Template {
  serial: string;
  name: string;
  parts: number;
  duration: number;
}

export interface clockData {
  realTime: boolean;
  paused: boolean;
  startTime: number;
  startPauseTime: number;
  pauseTime: number;
  pauseAt: number[];
}

export type bottomTab = "" | "withbottom-tab";

export type themeColors = "light" | "dark" | "png";

export interface JWT {
  iat: number;
  isAdmin: boolean;
  serial: string;
  snowflake: string;
  username: string;
}

export interface sponsorFolder {
  name: string;
  children: string[];
}

export interface AppState {
  color: themeColors;
  bottomtab: bottomTab;
  scoreboard: Scoreboard;
  templates: Template[];
  sponsors: sponsorFolder[];
  users: any[];
  jwt: JWT;
}

export type AppStateKeys = keyof AppState;
export type AppStateValues = AppState[AppStateKeys];

export type FlagPlace = `${"h" | "u"}${"b" | "o"}`;

// Defaults
export const defaultTemplate: Template = {
  serial: "N/A",
  name: "N/A",
  parts: 0,
  duration: 0,
};

export const defaultScoreboard: Scoreboard = {
  name: "N/A",
  display: true,
  serial: "N/A",
  isPlaying: false,
  fullscreen: false,
  sponsors: [],
  hb: "black",
  ho: "black",
  ub: "black",
  uo: "black",
  t1: 0,
  t2: 0,
  message: "DLC Sportsystems - Made with 💙 by QMA",
  nameHome: "THUIS",
  nameOut: "UIT",
  clockData: { realTime: true, paused: true, startTime: Date.now(), startPauseTime: Date.now(), pauseTime: 0, pauseAt: [] },
  colors: ["green", "lightblue", "darkblue", "purple", "white", "black", "yellow", "red", "orange", "darkred"],
  hasAdmin: false,
};

export const defaultAppState: AppState = {
  color: "dark",
  bottomtab: "",
  scoreboard: defaultScoreboard,
  templates: [],
  sponsors: [],
  users: [],
  jwt: {
    iat: 0,
    isAdmin: false,
    serial: "",
    snowflake: "",
    username: "",
  },
};
