interface QuickReply {
	title: string;
	payload: string;
}

export interface Event {
	type: "message" | "hello";
	user: number;
	text?: string;
	channel?: string;
}

export interface Message {
	type: "message";
	direction: "incoming" | "outgoing";
	text: string;
	html?: string;
	quick_replies?: QuickReply[];
}

export interface Event {

}