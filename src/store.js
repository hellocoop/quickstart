import { writable } from 'svelte/store';

export const data = writable(null);
export const showSelectedApp = writable(false);
export const selectedAppData = writable(null);
export const notification = writable(null);
