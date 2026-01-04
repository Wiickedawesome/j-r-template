import { View } from "../types";

const labels: Record<View, string> = {
	shop: "Shop",
	admin: "Admin",
	rewards: "Rewards",
};

export function BottomNav({ view, onChange }: { view: View; onChange: (view: View) => void }) {
	return (
		<nav className="bottom-nav" aria-label="Primary mobile navigation">
			{(Object.keys(labels) as View[]).map((itemView) => (
				<button
					key={itemView}
					type="button"
					className={view === itemView ? "bottom-nav-item active" : "bottom-nav-item"}
					onClick={() => onChange(itemView)}
				>
					<span className="nav-dot" aria-hidden>
						•
					</span>
					{labels[itemView]}
				</button>
			))}
		</nav>
	);
}
