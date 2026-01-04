export type HeroContent = {
	title: string;
	subtitle: string;
	tagline: string;
	ctaPrimary: string;
	ctaSecondary: string;
};

export type Product = {
	id: string;
	name: string;
	description: string;
	price: number;
	category: "cafe" | "hardware";
	badge?: "weekly" | "popular" | "new";
	image: string;
};

export type MenuItem = {
	id: string;
	name: string;
	description: string;
	price: number;
	category: "drinks" | "bites" | "bakery";
	tags?: string[];
	image?: string;
};

export type HardwareAisle = {
	id: string;
	title: string;
	description: string;
	items: string[];
};

export type CartItem = {
	productId: string;
	quantity: number;
};

export type Special = {
	id: string;
	title: string;
	description: string;
	price: number;
	image: string;
	validThrough: string;
};

export type RewardProfile = {
	id: string;
	name: string;
	email: string;
	phone: string;
	points: number;
	tier: "Bronze" | "Silver" | "Gold";
};

export type StoreState = {
	hero: HeroContent;
	highlights: Product[];
	weeklySpecials: Special[];
	mostPopular: Product[];
	cafeMenu: MenuItem[];
	hardwareAisles: HardwareAisle[];
	cart: CartItem[];
	rewardProfile?: RewardProfile;
	adminSession?: { email: string };
};

export type View = "shop" | "admin" | "rewards";
