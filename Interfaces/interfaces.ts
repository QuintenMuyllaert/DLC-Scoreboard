// Interfaces
export interface LooseObject {
  [key: string]: any;
}

export interface User {
  username: string;
  password: string;
  isAdmin: boolean;
  serial: string;
  firstLogin: boolean;
}

export interface Scoreboard {
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

// Defaults
export const defaultTemplate: Template = {
  serial: "N/A",
  name: "N/A",
  parts: 0,
  duration: 0,
};

export const defaultScoreboard: Scoreboard = {
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
