import { HardwareAisle, HeroContent, MenuItem, Product, Special, StoreState } from "./types";

const hero: HeroContent = {
	title: "J&R Stores",
	subtitle: "Cafe • Hardware • Community",
	tagline:
		"One welcoming space for your morning coffee, weekend projects, and everyday essentials."
	,
	ctaPrimary: "View weekly specials",
	ctaSecondary: "Open admin panel",
};

const highlights: Product[] = [
	{
		id: "beans",
		name: "Belizean Sunrise Roast",
		description: "Small-batch espresso beans with citrus and cocoa notes.",
		price: 15.0,
		category: "cafe",
		badge: "new",
		image:
			"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "sandwich",
		name: "Harbor Cubano",
		description: "Pressed pork, pickles, and Swiss on fresh sourdough.",
		price: 11.5,
		category: "cafe",
		badge: "weekly",
		image:
			"https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "drill",
		name: "Impact Driver Kit",
		description: "Compact 20V driver with two batteries and fast charger.",
		price: 189.99,
		category: "hardware",
		badge: "popular",
		image:
			"https://images.unsplash.com/photo-1503387820893-6f8da0a81228?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "paint",
		name: "Low-VOC Interior Paint",
		description: "Satin finish, rich coverage, ready for weekend makeovers.",
		price: 42.0,
		category: "hardware",
		badge: "weekly",
		image:
			"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
	},
];

const weeklySpecials: Special[] = [
	{
		id: "latte-pass",
		title: "5-Latte Punch Pass",
		description: "Buy 4, get the 5th latte free. Perfect for the workweek.",
		price: 22,
		image:
			"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
		validThrough: "Ends Sunday",
	},
	{
		id: "weekend-bundle",
		title: "Weekend Fix Bundle",
		description:
			"Painter's tape, rollers, tray, and a starter gallon of interior satin paint.",
		price: 68,
		image:
			"https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=900&q=80",
		validThrough: "Limited stock",
	},
];

const mostPopular: Product[] = [
	{
		id: "pour-over",
		name: "Pour-Over Starter",
		description: "Ceramic dripper, filters, and a 12oz bag of Sunrise Roast.",
		price: 39,
		category: "cafe",
		badge: "popular",
		image:
			"https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "multitool",
		name: "Everyday Multi-tool",
		description: "Lightweight, locking blades, ready for camping and quick fixes.",
		price: 59,
		category: "hardware",
		badge: "popular",
		image:
			"https://images.unsplash.com/photo-1503387820893-6f8da0a81228?auto=format&fit=crop&w=900&q=80",
	},
	{
		id: "plant",
		name: "Countertop Herb Kit",
		description: "Self-watering basil and mint kit to brighten the cafe corner.",
		price: 32,
		category: "cafe",
		badge: "new",
		image:
			"https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=900&q=80",
	},
];

const cafeMenu: MenuItem[] = [
	{
		id: "latte",
		name: "Cardamom Latte",
		description: "House espresso, steamed milk, Belizean cardamom syrup.",
		price: 5.75,
		category: "drinks",
		tags: ["signature", "iced or hot"],
	},
	{
		id: "cold-brew",
		name: "Harbor Cold Brew",
		description: "12-hour steep, citrus peel, raw sugar.",
		price: 4.5,
		category: "drinks",
		tags: ["slow brew"],
	},
	{
		id: "toast",
		name: "Avocado Toast",
		description: "Sourdough, lime, chili flake, pickled onions.",
		price: 8,
		category: "bites",
		tags: ["vegetarian"],
	},
	{
		id: "panini",
		name: "Smoked Turkey Panini",
		description: "Gouda, roasted peppers, basil aioli.",
		price: 9.5,
		category: "bites",
		tags: ["popular"],
	},
	{
		id: "cookie",
		name: "Sea Salt Chocolate Chunk",
		description: "Baked hourly; crisp edges, gooey center.",
		price: 3,
		category: "bakery",
		tags: ["fresh"],
	},
];

const hardwareAisles: HardwareAisle[] = [
	{
		id: "paint-bar",
		title: "Paint Bar",
		description: "Color matching, low-VOC lines, rollers and tape ready to go.",
		items: ["Satin interior", "Ceiling white", "Painter's tape", "Primer kits"],
	},
	{
		id: "power-tools",
		title: "Power Tools",
		description: "Weekend warriors to pros: drivers, sanders, batteries, bits.",
		items: ["Impact drivers", "Orbital sanders", "Multi-tools", "Battery kits"],
	},
	{
		id: "garden",
		title: "Garden + Patio",
		description: "Everything for balconies to backyards; herbs next to hex keys.",
		items: ["Planters", "Herb starters", "Hoses", "Solar lights"],
	},
];

export const initialState: StoreState = {
	hero,
	highlights,
	weeklySpecials,
	mostPopular,
	cafeMenu,
	hardwareAisles,
	cart: [],
};

export { hero, highlights, weeklySpecials, mostPopular };
