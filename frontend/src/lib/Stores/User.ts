import { writable } from "svelte/store";
import { persist, createSessionStorage } from "@macfja/svelte-persistent-store"
import { generateRandomString } from "$lib/Utils/Basic";

//TODO: store all user data in this bitch
export let user = persist(writable("user"), createSessionStorage(), "displayname")
export const loggedIn = writable(false)
export const state = writable(generateRandomString(32))
