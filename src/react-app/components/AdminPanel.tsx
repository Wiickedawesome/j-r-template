import { FormEvent, useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { fetchStateFromEdge, pushStateToEdge } from "../api";
import { useStore } from "../store";
import { Product, Special } from "../types";

function TextField({
	label,
	value,
	onChange,
	placeholder,
}: {
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}) {
	return (
		<label className="field">
			<span>{label}</span>
			<input
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={placeholder}
				type="text"
			/>
		</label>
	);
}

function NumberField({
	label,
	value,
	onChange,
	min,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	min?: number;
}) {
	return (
		<label className="field">
			<span>{label}</span>
			<input
				value={value}
				onChange={(event) => onChange(Number(event.target.value))}
				type="number"
				min={min ?? 0}
				step="0.5"
			/>
		</label>
	);
}

function ProductEditor({ item, onSave }: { item: Product; onSave: (changes: Partial<Product>) => void }) {
	const [draft, setDraft] = useState(item);

	useEffect(() => setDraft(item), [item]);

	return (
		<div className="panel-card">
			<div className="pill-row">
				<span className="pill">{item.category}</span>
				{item.badge && <span className="pill alt">{item.badge}</span>}
			</div>
			<h5>{item.name}</h5>
			<TextField label="Name" value={draft.name} onChange={(value) => setDraft((prev) => ({ ...prev, name: value }))} />
			<TextField
				label="Description"
				value={draft.description}
				onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
			/>
			<TextField label="Image" value={draft.image} onChange={(value) => setDraft((prev) => ({ ...prev, image: value }))} />
			<NumberField label="Price" value={draft.price} onChange={(value) => setDraft((prev) => ({ ...prev, price: value }))} />
			<button className="primary" onClick={() => onSave(draft)}>
				Save changes
			</button>
		</div>
	);
}

function SpecialEditor({ item, onSave }: { item: Special; onSave: (changes: Partial<Special>) => void }) {
	const [draft, setDraft] = useState(item);

	useEffect(() => setDraft(item), [item]);

	return (
		<div className="panel-card">
			<h5>{item.title}</h5>
			<TextField label="Title" value={draft.title} onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))} />
			<TextField
				label="Description"
				value={draft.description}
				onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
			/>
			<TextField label="Image" value={draft.image} onChange={(value) => setDraft((prev) => ({ ...prev, image: value }))} />
			<TextField
				label="Valid through"
				value={draft.validThrough}
				onChange={(value) => setDraft((prev) => ({ ...prev, validThrough: value }))}
			/>
			<NumberField label="Price" value={draft.price} onChange={(value) => setDraft((prev) => ({ ...prev, price: value }))} />
			<button className="primary" onClick={() => onSave(draft)}>
				Save changes
			</button>
		</div>
	);
}

function AddProductForm({
	title,
	onAdd,
	category,
}: {
	title: string;
	onAdd: (product: Omit<Product, "id">) => void;
	category: Product["category"];
}) {
	const [draft, setDraft] = useState<Omit<Product, "id">>({
		name: "",
		description: "",
		price: 10,
		category,
		badge: "new",
		image: "",
	});

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		onAdd(draft);
		setDraft({ ...draft, name: "", description: "", image: "" });
	};

	return (
		<form className="panel-card" onSubmit={handleSubmit}>
			<h5>{title}</h5>
			<TextField label="Name" value={draft.name} onChange={(value) => setDraft((prev) => ({ ...prev, name: value }))} />
			<TextField
				label="Description"
				value={draft.description}
				onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
				placeholder="Short marketing blurb"
			/>
			<TextField
				label="Image URL"
				value={draft.image}
				onChange={(value) => setDraft((prev) => ({ ...prev, image: value }))}
				placeholder="https://..."
			/>
			<NumberField label="Price" value={draft.price} onChange={(value) => setDraft((prev) => ({ ...prev, price: value }))} />
			<button className="primary" type="submit">
				Add item
			</button>
		</form>
	);
}

function AddSpecialForm({ onAdd }: { onAdd: (special: Omit<Special, "id">) => void }) {
	const [draft, setDraft] = useState<Omit<Special, "id">>({
		title: "",
		description: "",
		price: 20,
		image: "",
		validThrough: "This week",
	});

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();
		onAdd(draft);
		setDraft({ ...draft, title: "", description: "", image: "" });
	};

	return (
		<form className="panel-card" onSubmit={handleSubmit}>
			<h5>Add weekly special</h5>
			<TextField label="Title" value={draft.title} onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))} />
			<TextField
				label="Description"
				value={draft.description}
				onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))}
			/>
			<TextField label="Image" value={draft.image} onChange={(value) => setDraft((prev) => ({ ...prev, image: value }))} />
			<TextField
				label="Valid through"
				value={draft.validThrough}
				onChange={(value) => setDraft((prev) => ({ ...prev, validThrough: value }))}
			/>
			<NumberField label="Price" value={draft.price} onChange={(value) => setDraft((prev) => ({ ...prev, price: value }))} />
			<button className="primary" type="submit">
				Add special
			</button>
		</form>
	);
}

export function AdminPanel() {
	const {
		state,
		actions,
	} = useStore();

	const { hero, highlights, weeklySpecials, mostPopular, adminSession } = state;

	const [heroDraft, setHeroDraft] = useState(hero);
	const [adminEmail, setAdminEmail] = useState("manager@jrstores.com");
	const [adminCode, setAdminCode] = useState("123-456");
	const [syncMessage, setSyncMessage] = useState<string>("");
	const [syncBusy, setSyncBusy] = useState(false);

	useEffect(() => setHeroDraft(hero), [hero]);

	const handleHeroSave = () => actions.updateHero(heroDraft);

	const handlePullFromEdge = async () => {
		setSyncBusy(true);
		setSyncMessage("Fetching latest from edge...");
		const remote = await fetchStateFromEdge();
		if (remote) {
			actions.hydrate(remote);
			setSyncMessage("Applied edge state");
		} else {
			setSyncMessage("No edge state available yet");
		}
		setSyncBusy(false);
	};

	const handlePushToEdge = async () => {
		setSyncBusy(true);
		setSyncMessage("Publishing to Cloudflare...");
		const ok = await pushStateToEdge(state);
		setSyncMessage(ok ? "Saved to KV (or staging)" : "Publish failed (check Worker)");
		setSyncBusy(false);
	};

	if (!adminSession) {
		return (
			<div className="panel">
				<h3>Admin access</h3>
				<p className="muted">Mock sign-in for staging. Replace with Cloudflare Access.</p>
				<div className="panel-card">
					<TextField label="Email" value={adminEmail} onChange={setAdminEmail} />
					<TextField label="Access code" value={adminCode} onChange={setAdminCode} />
					<button className="primary" onClick={() => actions.loginAdmin(adminEmail)}>
						Enter admin
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="panel">
			<div className="panel-head">
				<div>
					<p className="eyebrow">Admin workspace</p>
					<h3>Live storefront controls</h3>
				</div>
				<div className="button-row">
					<button className="ghost" onClick={handlePullFromEdge} disabled={syncBusy}>
						Pull from edge
					</button>
					<button className="ghost" onClick={handlePushToEdge} disabled={syncBusy}>
						Publish to edge
					</button>
					<button className="ghost" onClick={actions.logoutAdmin}>
						Log out
					</button>
				</div>
			</div>
			{syncMessage && <p className="muted">{syncMessage}</p>}

			<section className="panel-section">
				<h4>Hero + CTA</h4>
				<div className="panel-grid">
					<div className="panel-card">
						<TextField label="Title" value={heroDraft.title} onChange={(value) => setHeroDraft((prev) => ({ ...prev, title: value }))} />
						<TextField
							label="Subtitle"
							value={heroDraft.subtitle}
							onChange={(value) => setHeroDraft((prev) => ({ ...prev, subtitle: value }))}
						/>
						<TextField
							label="Tagline"
							value={heroDraft.tagline}
							onChange={(value) => setHeroDraft((prev) => ({ ...prev, tagline: value }))}
						/>
						<TextField
							label="Primary CTA"
							value={heroDraft.ctaPrimary}
							onChange={(value) => setHeroDraft((prev) => ({ ...prev, ctaPrimary: value }))}
						/>
						<TextField
							label="Secondary CTA"
							value={heroDraft.ctaSecondary}
							onChange={(value) => setHeroDraft((prev) => ({ ...prev, ctaSecondary: value }))}
						/>
						<button className="primary" onClick={handleHeroSave}>
							Save hero copy
						</button>
					</div>
					<div className="panel-card subtle-bg">
						<p className="muted">Preview</p>
						<h4>{heroDraft.title}</h4>
						<p className="eyebrow">{heroDraft.subtitle}</p>
						<p>{heroDraft.tagline}</p>
						<div className="pill-row">
							<span className="pill">{heroDraft.ctaPrimary}</span>
							<span className="pill alt">{heroDraft.ctaSecondary}</span>
						</div>
					</div>
				</div>
			</section>

			<section className="panel-section">
				<div className="panel-head">
					<h4>Highlights</h4>
					<span className="chip subtle">Cafe + Hardware</span>
				</div>
				<div className="panel-grid three">
					{highlights.map((item) => (
						<ProductEditor
							key={item.id}
							item={item}
							onSave={(changes) => actions.updateHighlight(item.id, changes)}
						/>
					))}
					<AddProductForm
						title="Add cafe highlight"
						onAdd={actions.addHighlight}
						category="cafe"
					/>
					<AddProductForm
						title="Add hardware highlight"
						onAdd={actions.addHighlight}
						category="hardware"
					/>
				</div>
			</section>

			<section className="panel-section">
				<div className="panel-head">
					<h4>Weekly specials</h4>
					<span className="chip subtle">Publishes to landing</span>
				</div>
				<div className="panel-grid three">
					{weeklySpecials.map((special) => (
						<SpecialEditor
							key={special.id}
							item={special}
							onSave={(changes) => actions.updateSpecial(special.id, changes)}
						/>
					))}
					<AddSpecialForm onAdd={actions.addSpecial} />
				</div>
			</section>

			<section className="panel-section">
				<div className="panel-head">
					<h4>Most popular list</h4>
					<span className="chip subtle">Drives app home screen</span>
				</div>
				<div className="panel-grid three">
					{mostPopular.map((item) => (
						<ProductEditor
							key={item.id}
							item={item}
							onSave={(changes) => actions.updatePopular(item.id, changes)}
						/>
					))}
					<AddProductForm title="Add popular item" onAdd={actions.addPopular} category="hardware" />
				</div>
			</section>
		</div>
	);
}
