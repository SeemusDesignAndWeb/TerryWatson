// Type definitions - safe to use on both client and server
export interface Episode {
	title: string;
	date?: string;
	description?: string;
	audioUrl: string;
	duration?: string;
}

export interface NewsUpdate {
	date: string;
	title: string;
	content: string;
}

export interface AmevaContent {
	intro: string;
	sections: Array<{
		title: string;
		content: string;
		isHighlight?: boolean;
	}>;
}

export interface BookContent {
	intro: string;
	about: string;
	topics: string[];
	availability: string;
	purchaseOptions?: {
		kindle?: {
			price?: string;
			description?: string;
		};
		paperbackUsed?: {
			description?: string;
		};
		paperbackNew?: {
			description?: string;
		};
	};
	contactEmail?: string;
}

export interface CarouselImage {
	id: string;
	src: string;
	alt: string;
	order?: number;
}

