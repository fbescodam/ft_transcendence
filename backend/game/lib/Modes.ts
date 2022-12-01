export const SINGLEPL_MODE_ID = 0;
export const LOCAL_MULTIPL_MODE_ID = 1;
export const ONLINE_MULTIPL_MODE_ID = 2;
export type GameMode = typeof SINGLEPL_MODE_ID | typeof LOCAL_MULTIPL_MODE_ID | typeof ONLINE_MULTIPL_MODE_ID;

export const Modes = [
	{ name: "Singleplayer", id: SINGLEPL_MODE_ID, icon: null },
	{ name: "Local Multiplayer", id: LOCAL_MULTIPL_MODE_ID, icon: null },
	{ name: "Online Multiplayer", id: ONLINE_MULTIPL_MODE_ID, icon: null },
];
