import { Globe, User, Users } from "svelte-hero-icons";

export const SINGLEPL_MODE_ID = 0;
export const LOCAL_MULTIPL_MODE_ID = 1;
export const ONLINE_MULTIPL_MODE_ID = 2;

export const Modes = [
    { name: "Singleplayer", id: SINGLEPL_MODE_ID, icon: User },
    { name: "Local Multiplayer", id: LOCAL_MULTIPL_MODE_ID, icon: Users },
    { name: "Online Multiplayer", id: ONLINE_MULTIPL_MODE_ID, icon: Globe },
];
