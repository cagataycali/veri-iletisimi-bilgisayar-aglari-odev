TCP P2P Network
------------


**Features**

- If anyone connect network, other peers send broadcast in random time ([3, 5, 10, 20] sec) // 2 peers needed.
- If anyone disconnect network peers knows.
- Peers can broadcast any message
- Peers can send private message to another node from network.

**Dependencies**

- Node.js

**Usage**

```
git clone git@github.com:cagataycali/veri-iletisimi-bilgisayar-aglari-odev.git
npm run server # starts server from ::8080.
npm run client # connect one client to network.
npm run private # private message sender client.
```