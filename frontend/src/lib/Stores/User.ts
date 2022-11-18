import { writable } from "svelte/store";
import { generateRandomString } from "$lib/Utils/Basic";
import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"

/*==========================================================================*/

export const session = createSessionStorage<any>();

/*==========================================================================*/

export const state = writable<string>(generateRandomString(32))
export const JWT = persist<string | null>(writable<string | null>(null), session, "token");
export const displayName = persist<string | null>(writable<string | null>(null), session, "displayName");
export const avatar = persist<string | null>(writable<string | null>(null), session, "avatar");

/*==========================================================================*/