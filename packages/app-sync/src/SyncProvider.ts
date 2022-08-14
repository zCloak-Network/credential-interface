import { Manager, Socket } from 'socket.io-client';

import { MessageType } from './type';

export class SyncProvider extends Socket {
  #handlers = new Set<(messages: MessageType[]) => void>();

  #handleMessages = (messages: MessageType[]) => {
    this.#handlers.forEach((cb) => {
      cb(messages);
    });
  };

  constructor(url: string, nsp = '/ws') {
    const manager = new Manager(url, {
      transports: ['websocket'],
      autoConnect: false
    });

    super(manager, nsp);
    this.on('message:list', this.#handleMessages);
  }

  public subscribe(address: string, startId: number, callback: (messages: MessageType[]) => void) {
    this.#handlers.add(callback);
    this.emit('message:subscribe', {
      address,
      start_id: startId
    });
  }
}
