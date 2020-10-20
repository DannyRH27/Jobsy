import { Message } from '../types';
import { RECEIVE_MESSAGE } from './actions'

const messageReducer = (state: Message[], action: any) => {
  switch (action.type) {
    case RECEIVE_MESSAGE:
			const nextState = [...state]
			const lastMessage = nextState.pop()
			if (lastMessage) {
				return [
					...nextState,
					{ ...lastMessage, showQuickReplies: false },
					{
						...action.message,
						showAvatar: lastMessage.direction !== action.message.direction
					}
				]
			}
			return [
				action.message
			]
    default:
      return state;
  }
};

export default messageReducer