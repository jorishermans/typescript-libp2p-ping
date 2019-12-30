import Libp2p from "libp2p";
import { Options } from "libp2p"; 
import TCP from "libp2p-tcp";
import Multiplex from "libp2p-mplex";
import SECIO from "libp2p-secio";
import Ping from "libp2p/src/ping";

import defaultsDeep from "@nodeutils/defaults-deep";
import PeerInfo from "peer-info";

const DEFAULT_OPTS = {
  modules: {
    transport: [
      TCP
    ],
    connEncryption: [
      SECIO
    ],
    streamMuxer: [
      Multiplex
    ]
  }
}

export class P2PNode extends Libp2p {
  constructor (opts: Options) {
    super(defaultsDeep(opts, DEFAULT_OPTS))
  }

  ping (remotePeerInfo: PeerInfo, callback: (err: any, ev: any) => any) {
    const p = new Ping(this._switch, remotePeerInfo)
    p.on('ping', time => {
      p.stop() // stop sending pings
      callback(null, time)
    })
    p.on('error', err => {
      callback(err, null);
    })
    p.start()
  }
}
