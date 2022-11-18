import { writable } from "svelte/store";
import { generateRandomString } from "$lib/Utils/Basic";
import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"

/*==========================================================================*/

export const session = createSessionStorage<any>();

/*==========================================================================*/

export const JWT = persist<string | null>(writable<string | null>(null), session, "token");
export const user = persist(writable<string | null>(null), session, "displayName");
export const state = writable(generateRandomString(32))

/*==========================================================================*/