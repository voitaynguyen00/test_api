const http = require('http');
const fs = require('fs');
const os = require('os');

function hexToBytes(hexString) {
    const byteArray = [];
    for (let i = 0; i < hexString.length; i += 2) {
      byteArray.push(parseInt(hexString.substr(i, 2), 16));
    }
    return byteArray;
}

const interfaces = os.networkInterfaces();
const addresses = [];

for (const interface in interfaces) {
  for (const addr of interfaces[interface]) {
    if (addr.family === 'IPv4' && !addr.internal) {
      addresses.push(addr.address);
    }
  }
}
console.log(addresses[0]); // outputs your local IPv4 address

const server = http.createServer((req, res) => {
  if (req.method === 'PUT' && req.url === '/test') {
    count++;
    const filename = process.argv[2];
    fs.readFile(filename, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Internal Server Error');
        res.end();
      } else {
        console.log(`File ${filename} successfully read!`);
        const hexString = data.toString();
        const byteArray = hexToBytes(hexString);
        const uint8Array2 = new Uint8Array(byteArray);
        console.log(uint8Array2);
        res.writeHead(200, { 'Content-Type': 'application/octet-stream' , 'Content-Length': uint8Array2.length});
        res.write(uint8Array2);
        res.end();
      }
    });
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('Bad Request: Invalid HTTP method');
    res.end();
  }
});
const hostname = addresses[0]; // Replace with your desired IP address
const port = 3000; // Replace with your desired port number
server.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}`);
});
