import { useMemo, useState } from "react";
import { useStore } from "../store";

type ProductFilter = "all" | "cafe" | "hardware";

export function Landing({ onAdminRequest }: { onAdminRequest: () => void }) {
	const {
		state: { hero, highlights, weeklySpecials, mostPopular, cafeMenu, hardwareAisles, cart },
		actions,
	} = useStore();

	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState<ProductFilter>("all");

	const productLookup = useMemo(() => {
		const map = new Map<string, (typeof highlights)[number]>();
		[...highlights, ...mostPopular].forEach((item) => map.set(item.id, item));
		return map;
	}, [highlights, mostPopular]);

	const allProducts = useMemo(() => Array.from(productLookup.values()), [productLookup]);

	const filtered = useMemo(() => {
		return allProducts.filter((item) => {
			const matchesFilter = filter === "all" ? true : item.category === filter;
			const matchesSearch = search
				? `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
				: true;
			return matchesFilter && matchesSearch;
		});
	}, [allProducts, filter, search]);

	const cartItems = useMemo(() => {
		return cart.map((entry) => ({
			entry,
			product: productLookup.get(entry.productId),
		}));
	}, [cart, productLookup]);

	const cartTotal = useMemo(
		() =>
			cartItems.reduce(
				(sum, { entry, product }) => sum + (product ? product.price * entry.quantity : 0),
				0,
			),
		[cartItems],
	);

	return (
		<div className="page">
			<section className="hero">
				<div className="hero-copy">
					<p className="eyebrow">Neighborhood-owned • Cloudflare-powered</p>
					<h2>{hero.title}</h2>
					<h3>{hero.subtitle}</h3>
					<p className="lede">{hero.tagline}</p>
					<div className="actions">
						<button className="primary">{hero.ctaPrimary}</button>
						<button className="ghost" onClick={onAdminRequest}>
							{hero.ctaSecondary}
						</button>
					</div>
					<div className="stat-row">
						<div>
							<p className="stat">12 min</p>
							<p className="eyebrow">From harbor to home</p>
						</div>
						<div>
							<p className="stat">2-in-1</p>
							<p className="eyebrow">Cafe + Hardware</p>
						</div>
						<div>
							<p className="stat">Live</p>
							<p className="eyebrow">Inventory sync</p>
						</div>
					</div>
				</div>
				<div className="hero-card">
					<p className="eyebrow">Weekly Specials</p>
					<ul className="mini-list">
						{weeklySpecials.slice(0, 2).map((special) => (
							<li key={special.id}>
								<div>
									<p className="label">{special.title}</p>
									<p className="muted">{special.description}</p>
								</div>
								<span className="price">${special.price.toFixed(2)}</span>
							</li>
						))}
					</ul>
					<div className="badge">Updated live</div>
				</div>
			</section>

			<section className="section compact">
				<div className="section-head">
					<div>
						<p className="eyebrow">Live inventory preview</p>
						<h4>Quick find</h4>
					</div>
					<div className="pill-row">
						{(["all", "cafe", "hardware"] as ProductFilter[]).map((value) => (
							<button
								key={value}
								className={filter === value ? "ghost active" : "ghost"}
								onClick={() => setFilter(value)}
							>
								{value === "all" ? "All" : value === "cafe" ? "Cafe" : "Hardware"}
							</button>
						))}
					</div>
				</div>
				<div className="search-row">
					<input
						type="search"
						placeholder="Search drinks, tools, kits..."
						value={search}
						onChange={(event) => setSearch(event.target.value)}
					/>
					<span className="chip subtle">{filtered.length} items</span>
				</div>
				<div className="grid highlight-grid">
					{filtered.slice(0, 6).map((item) => (
						<article className="card" key={item.id}>
							<img src={item.image} alt={item.name} loading="lazy" />
							<div className="card-body">
								<div className="pill-row">
									<span className="pill">{item.category === "cafe" ? "Cafe" : "Hardware"}</span>
									{item.badge && <span className="pill alt">{item.badge}</span>}
								</div>
								<h5>{item.name}</h5>
								<p className="muted">{item.description}</p>
								<div className="card-footer">
									<p className="price">${item.price.toFixed(2)}</p>
									<button className="primary" onClick={() => actions.addToCart(item.id)}>
										Add to cart
									</button>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="section">
				<div className="section-head">
					<div>
						<p className="eyebrow">Front counter + aisle four</p>
						<h4>Highlights today</h4>
					</div>
					<button className="ghost" onClick={onAdminRequest}>
						Edit in admin
					</button>
				</div>
				<div className="grid highlight-grid">
					{highlights.map((item) => (
						<article className="card" key={item.id}>
							<img src={item.image} alt={item.name} loading="lazy" />
							<div className="card-body">
								<div className="pill-row">
									<span className="pill">{item.category === "cafe" ? "Cafe" : "Hardware"}</span>
									{item.badge && <span className="pill alt">{item.badge}</span>}
								</div>
								<h5>{item.name}</h5>
								<p className="muted">{item.description}</p>
								<div className="card-footer">
									<p className="price">${item.price.toFixed(2)}</p>
									<button className="ghost small" onClick={() => actions.addToCart(item.id)}>
										Add to cart
									</button>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="section">
				<div className="section-head">
					<div>
						<p className="eyebrow">Cafe + Hardware promos</p>
						<h4>Weekly specials</h4>
					</div>
					<span className="chip subtle">Publishes from admin</span>
				</div>
				<div className="grid specials-grid">
					{weeklySpecials.map((special) => (
						<article className="card special" key={special.id}>
							<img src={special.image} alt={special.title} loading="lazy" />
							<div className="card-body">
								<h5>{special.title}</h5>
								<p className="muted">{special.description}</p>
								<div className="card-footer">
									<span className="badge">{special.validThrough}</span>
									<p className="price">${special.price.toFixed(2)}</p>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="section">
				<div className="section-head">
					<div>
						<p className="eyebrow">Bar + bakery</p>
						<h4>Cafe menu</h4>
					</div>
					<span className="chip subtle">Editable later in admin</span>
				</div>
				<div className="menu-grid">
					{["drinks", "bites", "bakery"].map((category) => {
						const items = cafeMenu.filter((item) => item.category === category);
						return (
							<div className="menu-card" key={category}>
								<p className="eyebrow">{category === "drinks" ? "Drinks" : category === "bites" ? "Bites" : "Bakery"}</p>
								<ul className="mini-list">
									{items.map((item) => (
										<li key={item.id}>
											<div>
												<p className="label">{item.name}</p>
												<p className="muted">{item.description}</p>
											</div>
											<span className="price">${item.price.toFixed(2)}</span>
										</li>
									))}
								</ul>
							</div>
						);
					})}
				</div>
			</section>

			<section className="section">
				<div className="section-head">
					<div>
						<p className="eyebrow">Aisles to-go</p>
						<h4>Hardware lineup</h4>
					</div>
					<button className="ghost" onClick={onAdminRequest}>
						Add categories in admin
					</button>
				</div>
				<div className="grid aisles-grid">
					{hardwareAisles.map((aisle) => (
						<article className="aisle-card" key={aisle.id}>
							<div className="pill-row">
								<span className="pill">{aisle.title}</span>
							</div>
							<p className="muted">{aisle.description}</p>
							<ul>
								{aisle.items.map((item) => (
									<li key={item} className="muted">{item}</li>
								))}
							</ul>
							<button className="ghost" onClick={() => setFilter("hardware")}>Browse items</button>
						</article>
					))}
				</div>
			</section>

			<section className="section">
				<div className="section-head">
					<div>
						<p className="eyebrow">Trending</p>
						<h4>Most popular</h4>
					</div>
					<button className="ghost" onClick={onAdminRequest}>
						Manage popular list
					</button>
				</div>
				<div className="grid popular-grid">
					{mostPopular.map((item) => (
						<article className="tile" key={item.id}>
							<div className="tile-body">
								<div className="pill-row">
									<span className="pill">{item.category === "cafe" ? "Cafe" : "Hardware"}</span>
									{item.badge && <span className="pill alt">{item.badge}</span>}
								</div>
								<h5>{item.name}</h5>
								<p className="muted">{item.description}</p>
								<div className="tile-footer">
									<p className="price">${item.price.toFixed(2)}</p>
									<button className="primary ghost" onClick={() => actions.addToCart(item.id)}>
										Add to cart
									</button>
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			<section className="section">
				<div className="section-head">
					<div>
						<p className="eyebrow">Pre-cart</p>
						<h4>Pickup basket (mock)</h4>
					</div>
					<span className="chip subtle">Persisted locally for now</span>
				</div>
				<div className="cart-panel">
					{cartItems.length === 0 ? (
						<p className="muted">Add items from any card to preview checkout flow.</p>
					) : (
						<>
							<ul className="cart-list">
								{cartItems.map(({ entry, product }) => (
									<li key={entry.productId} className="cart-line">
										<div>
											<p className="label">{product?.name ?? "Unknown item"}</p>
											<p className="muted">Qty</p>
										</div>
										<div className="cart-actions">
											<input
												type="number"
												min={0}
												value={entry.quantity}
												onChange={(event) =>
													actions.updateCartQuantity(entry.productId, Number(event.target.value))
												}
											/>
											<p className="price">
												${product ? (product.price * entry.quantity).toFixed(2) : "0.00"}
											</p>
											<button className="ghost small" onClick={() => actions.removeFromCart(entry.productId)}>
												Remove
											</button>
										</div>
									</li>
								))}
							</ul>
							<div className="cart-total">
								<p className="label">Subtotal</p>
								<p className="stat">${cartTotal.toFixed(2)}</p>
								<button className="primary">Checkout (stub)</button>
							</div>
						</>
					)}
				</div>
			</section>
		</div>
	);
}
