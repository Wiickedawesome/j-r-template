import { FormEvent, useState } from "react";
import { useStore } from "../store";

export function RewardsPanel() {
	const {
		state: { rewardProfile, mostPopular },
		actions,
	} = useStore();

	const [form, setForm] = useState({ name: "", email: "", phone: "" });

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		actions.loginRewards(form);
	};

	if (!rewardProfile) {
		return (
			<div className="panel">
				<h3>Rewards login</h3>
				<p className="muted">Join with email or phone. Data is mocked and stays local.</p>
				<form className="panel-card" onSubmit={handleSubmit}>
					<label className="field">
						<span>Name</span>
						<input
							value={form.name}
							onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
							placeholder="Avery Doe"
							required
						/>
					</label>
					<label className="field">
						<span>Email</span>
						<input
							type="email"
							value={form.email}
							onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
							placeholder="you@example.com"
							required
						/>
					</label>
					<label className="field">
						<span>Phone</span>
						<input
							type="tel"
							value={form.phone}
							onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
							placeholder="+501 555 1234"
							required
						/>
					</label>
					<button className="primary" type="submit">
						Create account
					</button>
				</form>
			</div>
		);
	}

	return (
		<div className="panel">
			<div className="panel-head">
				<div>
					<p className="eyebrow">Member perks</p>
					<h3>Welcome back, {rewardProfile.name}</h3>
				</div>
				<span className="chip">{rewardProfile.tier} tier</span>
			</div>
			<div className="panel-grid three">
				<div className="panel-card">
					<p className="muted">Points balance</p>
					<p className="stat">{rewardProfile.points}</p>
					<div className="pill-row">
						<span className="pill">Email: {rewardProfile.email}</span>
						<span className="pill">Phone: {rewardProfile.phone}</span>
					</div>
				</div>
				<div className="panel-card">
					<p className="muted">Earn points</p>
					<button className="primary" onClick={() => actions.addRewardPoints(25)}>
						Add 25 pts (mock)
					</button>
					<button className="ghost" onClick={() => actions.addRewardPoints(75)}>
						Add 75 pts (bulk)
					</button>
				</div>
				<div className="panel-card subtle-bg">
					<p className="muted">Suggested pickups</p>
					<ul className="mini-list">
						{mostPopular.slice(0, 3).map((item) => (
							<li key={item.id}>
								<div>
									<p className="label">{item.name}</p>
									<p className="muted">{item.category}</p>
								</div>
								<span className="price">${item.price.toFixed(2)}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
