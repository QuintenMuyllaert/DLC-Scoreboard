// Interfaces
export interface LooseObject {
  [key: string]: any;
}

export type CollectionName = "accounts" | "scoreboards" | "templates" | "jwt" | "HMP" | "permissions";

export interface HMP {
  deviceName: string;
  deviceType: string;
  firmwareVersion: string;
  hostName: string;
  multiScreenId: string;
  serialNumber: string;
  name: string;
}

export interface User {
  username: string;
  password: string;
  email: string;
  uuid: string;
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
  scheduleData: scheduleData;
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

export interface scheduleData {
  startTime: number;
  endTime: number;
  sponsors: string[];
}

export interface registerData {
  username: string;
  password: string;
  serial: string;
  email: string;
  name: string;
}

export interface userdataData {
  newUsername: string;
  newPassword: string;
  newEmail: string;
  password: string;
}

export interface loginData {
  email: string;
  password: string;
}

export interface linkData {
  serial: string;
  name: string;
}

export interface apiResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;
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

export type Permission = "*" | "Template" | "Schedule" | "Sponsor";

export interface UserPermissions {
  email: string;
  permissions: Permission[];
}

export interface Permissions {
  serial: string;
  users: UserPermissions[];
}

export type PermissionType = "grant" | "revoke" | "list";
export type PermissionValue = "*" | "admin" | "user";

export interface PermissionRequest {
  type: PermissionType;
  value: PermissionValue;
  email: string;
  serial: string;
}

// Defaults
export const defaultTemplate: Template = {
  serial: "N/A",
  name: "N/A",
  parts: 0,
  duration: 0,
};

export const defaultScoreboard: Scoreboard = {
  name: "MissingNO.",
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
  message: "DLC Sportsystems - Scan de QR code of surf naar https://dlcscoreboard.computernetwork.be/ | Serial : ",
  nameHome: "THUIS",
  nameOut: "UIT",
  clockData: { realTime: true, paused: true, startTime: Date.now(), startPauseTime: Date.now(), pauseTime: 0, pauseAt: [] },
  scheduleData: { startTime: 0, endTime: 0, sponsors: [] },
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

export const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
