import { writable } from "svelte/store";
import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"
import { generateRandomString } from "$lib/Utils/Basic";

//TODO: store all user data in this bitch
export const user = writable()
export const loggedIn = writable(false)
export const state = writable(generateRandomString(32))
export const jwtToken = persist(writable("penis"), createSessionStorage(), "jwtToken");
