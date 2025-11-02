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

