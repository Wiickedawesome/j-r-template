import { View } from "../types";

export function TopBar({
	view,
	onChangeView,
	adminEmail,
	rewardName,
}: {
	view: View;
	onChangeView: (view: View) => void;
	adminEmail?: string;
	rewardName?: string;
}) {
	return (
		<header className="topbar">
			<div className="brand">
				<div className="brand-mark">J&R</div>
				<div>
					<p className="eyebrow">Cafe • Hardware</p>
					<h1 className="brand-name">J&R Stores</h1>
				</div>
			</div>
			<nav className="nav-actions" aria-label="Primary">
				<button
					type="button"
					className={view === "shop" ? "ghost active" : "ghost"}
					onClick={() => onChangeView("shop")}
				>
					Shopfront
				</button>
				<button
					type="button"
					className={view === "admin" ? "ghost active" : "ghost"}
					onClick={() => onChangeView("admin")}
				>
					Admin
				</button>
				<button
					type="button"
					className={view === "rewards" ? "ghost active" : "ghost"}
					onClick={() => onChangeView("rewards")}
				>
					Rewards
				</button>
			</nav>
			<div className="status-chips">
				{adminEmail ? <span className="chip">Admin: {adminEmail}</span> : <span className="chip subtle">Admin locked</span>}
				{rewardName ? <span className="chip">Member: {rewardName}</span> : <span className="chip subtle">Rewards guest</span>}
			</div>
		</header>
	);
}
