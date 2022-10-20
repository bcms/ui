import { Observable } from 'lib0/observable';
import { Awareness } from 'y-protocols/awareness';
import type { Doc } from 'yjs';
import type { BCMSEntrySync } from '../../types';

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

  constructor(
    public propPath: string,
    public doc: Doc,
    entrySync: BCMSEntrySync
  ) {
    super();
    this.awareness = new Awareness(doc);
    this.awareness.on('change', () => {
      entrySync.emit.cursorUpdate({
        propPath: this.propPath,
        languageCode: '',
        languageIndex: 0,
        data: Array.from(this.awareness.getStates().values()),
      });
    });
    this.doc = doc;
  }
}
