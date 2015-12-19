# lxd
[![Coverage Status](https://coveralls.io/repos/alanhoff/node-lxd/badge.svg?branch=master)][0]
[![Jenkins](http://jenkins.proxima.cc/buildStatus/icon?job=node-lxd)][1]
[![Dependencies](https://david-dm.org/alanhoff/node-lxd.svg)][2]

A Node.js wrapper for LXD rest interface.

## Getting started

### Installation

```
npm install node-lxd --save
```

### Usage

Generate keys:

```
lxc config set core.https_address 127.0.0.1
lxc config trust add $HOME/.config/lxc/client.crt
```

Example API usage:

```js
var fs = require('fs');
var path = require('path');
var lxd = require('lxd');

var LXD_CERT = path.resolve(process.env.HOME, '.config/lxc/client.crt');
var LXD_KEY = path.resolve(process.env.HOME, '.config/lxc/client.key');
var LXD_URI = 'https://127.0.0.1:8443/';

var client = new lxd.LXD({
  uri: LXD_URI,
  client: {
    strictSSL: false,
    agentOptions: {
      cert: fs.readFileSync(LXD_CERT),
      key: fs.readFileSync(LXD_KEY)
    }
  }
});

client.getContainers()
  .then(function(res) {
    console.log(res);
  });
```

## API Overview

TODO

## Testing

If you're on Ubuntu and have the `lxd` package installed, you can just run `npm test`.

If you're on OSX, you can use Vagrant to setup a VM to allow you to run the tests:

```
vagrant up
vagrant ssh
cd /vagrant
npm test
```

### License (ISC)

```
Copyright (c) 2015, Alan Hoffmeister <alanhoffmeister@gmail.com>

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

[0]: https://coveralls.io/github/alanhoff/node-lxd
[1]: http://jenkins.proxima.cc/job/node-lxd
[2]: https://david-dm.org/alanhoff/node-lxd
