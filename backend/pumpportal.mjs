import WebSocket from 'ws';

const ws = new WebSocket('wss://pumpportal.fun/api/data');

ws.on('open', function open() {

  // Subscribing to token creation events
  let payload = {
    method: "subscribeNewToken",
  }
  ws.send(JSON.stringify(payload));

  // Subscribing to trades on tokens
  payload = {
    method: "subscribeTokenTrade",
    keys: ["6UXyLA3FkZrETFjbyCYFKfq3Tx1Wqe9SV2my65ucpump"] // array of token CAs to watch
  }
  ws.send(JSON.stringify(payload));
});

ws.on('message', function message(data) {
  const message = JSON.parse(data);
  console.log(message);

   if (message['txType'] === 'create') {
     const payload = {
       method: "subscribeTokenTrade",
       keys: [message['mint']] // array of token CAs to watch
     }
     ws.send(JSON.stringify(payload));
   }
  // ws.send
});