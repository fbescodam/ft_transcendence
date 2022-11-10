import { loggedIn } from "$lib/Stores/User";
import type { LoadInput, LoadOutput } from '@sveltejs/kit/types.internal';

// TODO: this shit does not work
// TODO: how can it work
export function authGuard({ page }: LoadInput): Promise<LoadOutput> {
	if (loggedIn && page.path === '/auth') {
		return { status: 302, redirect: '/' };
	}
	else if (loggedIn || page.path === '/auth') {
		return {};
	}
	else {
		return { status: 302, redirect: '/auth' }
	}
}

export default {
	authGuard
}
