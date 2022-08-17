import { Observable } from 'lib0/observable';
import { Awareness } from 'y-protocols/awareness';
import type { Doc } from 'yjs';

export class BCMSContentProvider extends Observable<string> {
  awareness: Awareness;
  filterBcConns = true;
  shouldConnect = false;
  signalingUrls: string[] = [];
  signalingConns = [];
  maxConns = 1;
  peerOpts = {};
  key = 'test';
  room = null;

  constructor(public roomName: string, public doc: Doc) {
    super();
    this.awareness = new Awareness(doc);
    this.doc = doc;
    this.roomName = roomName;
  }
}
