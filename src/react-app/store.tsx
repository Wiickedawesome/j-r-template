import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialState } from "./mockData";
import { CartItem, HeroContent, Product, Special, StoreState } from "./types";

type StoreActions = {
	updateHero: (payload: Partial<HeroContent>) => void;
	updateHighlight: (id: string, payload: Partial<Product>) => void;
	addHighlight: (payload: Omit<Product, "id">) => void;
	updateSpecial: (id: string, payload: Partial<Special>) => void;
	addSpecial: (payload: Omit<Special, "id">) => void;
	updatePopular: (id: string, payload: Partial<Product>) => void;
	addPopular: (payload: Omit<Product, "id">) => void;
	addToCart: (productId: string) => void;
	updateCartQuantity: (productId: string, quantity: number) => void;
	removeFromCart: (productId: string) => void;
	hydrate: (next: StoreState) => void;
	loginAdmin: (email: string) => void;
	logoutAdmin: () => void;
	loginRewards: (profile: { name: string; email: string; phone: string }) => void;
	addRewardPoints: (points: number) => void;
};

type StoreValue = {
	state: StoreState;
	actions: StoreActions;
};

const StoreContext = createContext<StoreValue | undefined>(undefined);

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const STORAGE_KEY = "jr-storefront-state";

const normalizeState = (incoming: StoreState): StoreState => ({
	...initialState,
	...incoming,
});

const readPersistedState = (): StoreState => {
	if (typeof window === "undefined") return initialState;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return initialState;
		const parsed = JSON.parse(raw) as StoreState;
		return { ...initialState, ...parsed };
	} catch (error) {
		console.warn("Falling back to initial state", error);
		return initialState;
	}
};

export function StoreProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<StoreState>(() => readPersistedState());

	const actions = useMemo<StoreActions>(
		() => ({
			updateHero: (payload) =>
				setState((current) => ({ ...current, hero: { ...current.hero, ...payload } })),
			updateHighlight: (id, payload) =>
				setState((current) => ({
					...current,
					highlights: current.highlights.map((item) =>
						item.id === id ? { ...item, ...payload } : item,
					),
				})),
			addHighlight: (payload) =>
				setState((current) => ({
					...current,
					highlights: [...current.highlights, { ...payload, id: makeId() }],
				})),
			updateSpecial: (id, payload) =>
				setState((current) => ({
					...current,
					weeklySpecials: current.weeklySpecials.map((special) =>
						special.id === id ? { ...special, ...payload } : special,
					),
				})),
			addSpecial: (payload) =>
				setState((current) => ({
					...current,
					weeklySpecials: [...current.weeklySpecials, { ...payload, id: makeId() }],
				})),
			updatePopular: (id, payload) =>
				setState((current) => ({
					...current,
					mostPopular: current.mostPopular.map((item) =>
						item.id === id ? { ...item, ...payload } : item,
					),
				})),
			addPopular: (payload) =>
				setState((current) => ({
					...current,
					mostPopular: [...current.mostPopular, { ...payload, id: makeId() }],
				})),
			addToCart: (productId) =>
				setState((current) => {
					const existing = current.cart.find((item) => item.productId === productId);
					if (existing) {
						return {
							...current,
							cart: current.cart.map((item) =>
								item.productId === productId
									? { ...item, quantity: item.quantity + 1 }
								: item,
							),
						};
					}
					const next: CartItem = { productId, quantity: 1 };
					return { ...current, cart: [...current.cart, next] };
				}),
			updateCartQuantity: (productId, quantity) =>
				setState((current) => ({
					...current,
					cart: current.cart
						.map((item) =>
							item.productId === productId ? { ...item, quantity } : item,
						)
						.filter((item) => item.quantity > 0),
				})),
			removeFromCart: (productId) =>
				setState((current) => ({
					...current,
					cart: current.cart.filter((item) => item.productId !== productId),
				})),
			hydrate: (next) => setState(normalizeState(next)),
			loginAdmin: (email) =>
				setState((current) => ({
					...current,
					adminSession: { email },
				})),
			logoutAdmin: () =>
				setState((current) => ({
					...current,
					adminSession: undefined,
				})),
			loginRewards: (profile) =>
				setState((current) => ({
					...current,
					rewardProfile: {
						id: makeId(),
						tier: "Bronze",
						points: 120,
						...profile,
					},
				})),
			addRewardPoints: (points) =>
				setState((current) => {
					if (!current.rewardProfile) return current;
					const total = current.rewardProfile.points + points;
					const tier = total > 400 ? "Gold" : total > 200 ? "Silver" : "Bronze";
					return {
						...current,
						rewardProfile: { ...current.rewardProfile, points: total, tier },
					};
				}),
		}),
		[],
	);

	const value = useMemo(() => ({ state, actions }), [state, actions]);

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (error) {
			console.warn("Unable to persist mock data", error);
		}
	}, [state]);

	return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
	const context = useContext(StoreContext);
	if (!context) {
		throw new Error("useStore must be used within StoreProvider");
	}
	return context;
}
