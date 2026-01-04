export function Footer({ onAdmin }: { onAdmin: () => void }) {
	return (
		<footer className="footer">
			<div>
				<p className="eyebrow">J&R Stores</p>
				<h4>Cafe + Hardware, one roof.</h4>
				<p className="muted">Open daily • Harbor Road, Belize City</p>
				<div className="pill-row">
					<span className="pill">Cloudflare-native</span>
					<span className="pill alt">Edge synced</span>
				</div>
			</div>
			<div className="footer-actions">
				<button className="primary" onClick={onAdmin}>
					Open admin
				</button>
				<button className="ghost">Download app (soon)</button>
			</div>
		</footer>
	);
}
