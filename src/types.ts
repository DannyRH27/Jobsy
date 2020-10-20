interface QuickReply {
	title: string;
  payload: string;
  visited: boolean;
}

export interface Event {
	type: "message" | "hello";
	userId: number;
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