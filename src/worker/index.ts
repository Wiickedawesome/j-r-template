import { Hono } from "hono";
import { initialState } from "../react-app/mockData";
import { StoreState } from "../react-app/types";

type WorkerEnv = {
	DATA_KV?: KVNamespace;
	DATA_D1?: D1Database;
};

const app = new Hono<{ Bindings: Env & WorkerEnv }>();

const STATE_KEY = "jr-storefront-state";

const normalizeState = (incoming: StoreState | unknown): StoreState => {
	if (!incoming || typeof incoming !== "object") return initialState;
	const candidate = incoming as StoreState;
	return {
		...initialState,
		...candidate,
		// Always reset cart on server copy; cart stays client-local.
		cart: [],
	};
};

async function readState(env: WorkerEnv): Promise<StoreState> {
	try {
		if (env.DATA_KV) {
			const raw = await env.DATA_KV.get(STATE_KEY);
			if (raw) return normalizeState(JSON.parse(raw));
		}
		// Placeholder for D1 usage later; KV is preferred for doc-style storage.
		return initialState;
	} catch (error) {
		console.warn("Falling back to initial state", error);
		return initialState;
	}
}

async function writeState(env: WorkerEnv, state: StoreState) {
	if (!env.DATA_KV) return;
	await env.DATA_KV.put(STATE_KEY, JSON.stringify(state));
}

app.get("/api/health", (c) => c.json({ ok: true, ts: Date.now() }));

app.get("/api/state", async (c) => {
	const state = await readState(c.env);
	return c.json({ state, source: c.env.DATA_KV ? "kv" : "default" });
});

app.put("/api/state", async (c) => {
	const body = await c.req.json<Partial<StoreState>>();
	const merged = normalizeState(body as StoreState);
	await writeState(c.env, merged);
	return c.json({ state: merged, persisted: !!c.env.DATA_KV });
});

app.get("/api/menu", async (c) => {
	const state = await readState(c.env);
	return c.json({ cafeMenu: state.cafeMenu, hardwareAisles: state.hardwareAisles });
});

export default app;
