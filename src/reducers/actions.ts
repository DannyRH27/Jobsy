import { Message } from '../types';

export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE"

export const receiveMessage = (message: Message) => ({
	type: RECEIVE_MESSAGE,
	message
})

