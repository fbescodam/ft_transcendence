import { writable } from "svelte/store";
import { generateRandomString } from "$lib/Utils/Basic";
import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"

/*==========================================================================*/

export const session = createSessionStorage();

/*==========================================================================*/

export const JWT = writable<string | null>(null);
export const user = persist(writable("user"), session, "displayName");
export const state = writable(generateRandomString(32))

/*==========================================================================*/