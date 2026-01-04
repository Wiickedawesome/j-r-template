// src/App.tsx

import { useEffect, useState } from "react";
import "./App.css";
import { AdminPanel } from "./components/AdminPanel";
import { Landing } from "./components/Landing";
import { RewardsPanel } from "./components/RewardsPanel";
import { BottomNav } from "./components/BottomNav";
import { Footer } from "./components/Footer";
import { TopBar } from "./components/TopBar";
import { StoreProvider, useStore } from "./store";
import { View } from "./types";

function AppShell() {
	const [view, setView] = useState<View>("shop");
	const {
		state: { adminSession, rewardProfile },
	} = useStore();

	useEffect(() => {
		if (typeof window === "undefined") return;
		const readView = () => {
			const hash = window.location.hash.replace("#", "");
			if (hash === "admin" || hash === "shop" || hash === "rewards") {
				setView(hash as View);
			}
		};
		readView();
		window.addEventListener("hashchange", readView);
		return () => window.removeEventListener("hashchange", readView);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const currentHash = window.location.hash.replace("#", "");
		if (currentHash !== view) {
			window.location.hash = view;
		}
	}, [view]);

	return (
		<div className="layout">
			<TopBar
				view={view}
				onChangeView={setView}
				adminEmail={adminSession?.email}
				rewardName={rewardProfile?.name}
			/>
			<main>
				{view === "shop" && <Landing onAdminRequest={() => setView("admin")} />}
				{view === "admin" && <AdminPanel />}
				{view === "rewards" && <RewardsPanel />}
				<Footer onAdmin={() => setView("admin")} />
			</main>
			<BottomNav view={view} onChange={setView} />
		</div>
	);
}

export default function App() {
	return (
		<StoreProvider>
			<AppShell />
		</StoreProvider>
	);
}
