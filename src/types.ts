interface QuickReply {
	title: string;
  payload: string;
  visited: boolean;
}

export interface Event {
	type: "message" | "hello";
	text?: string;
	channel?: string;
}

export interface Message {
	type: "message";
	direction: "incoming" | "outgoing";
	text: string;
	html?: string;
	quick_replies?: QuickReply[];
	showQuickReplies: boolean;
	showAvatar: boolean;
}
