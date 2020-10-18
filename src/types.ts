interface QuickReply {
	title: string;
	payload: string;
}

export interface Message {
	type: "message";
	incoming: boolean;
	text: string;
	html: string;
	quick_reply?: QuickReply[];
}

export interface Event {

}