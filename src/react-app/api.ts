import { StoreState } from "./types";

const BASE = "/api";

export async function fetchStateFromEdge(): Promise<StoreState | null> {
	try {
		const res = await fetch(`${BASE}/state`);
		if (!res.ok) return null;
		const json = (await res.json()) as { state: StoreState };
		return json.state;
	} catch (error) {
		console.warn("Unable to fetch remote state", error);
		return null;
	}
}

export async function pushStateToEdge(state: StoreState): Promise<boolean> {
	try {
		const res = await fetch(`${BASE}/state`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(state),
		});
		return res.ok;
	} catch (error) {
		console.warn("Unable to push remote state", error);
		return false;
	}
}
