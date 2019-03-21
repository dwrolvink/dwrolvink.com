# Installing Markserv on Centos
[Source](https://github.com/markserv/markserv)

## Installing NodeJS on Centos
[Source](https://tecadmin.net/install-latest-nodejs-and-npm-on-centos/)

```bash
# Add node repo, install make tools
yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_11.x | sudo -E bash -

# Install nodejs
sudo yum install -y nodejs

# Install yarn
 curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
 sudo yum install yarn
```

### Notes
Centos7 is a weird duck in the lake. It ships with firewalld enabled. To reach a hosted website from another machine, disable firewalld with
```bash
systemctl stop firewalld
```

Or just open the port:
```bash
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --reload
```

### Test
Create `demo.js`, with contents:
```bash
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome Node.js');
}).listen(8080, "0.0.0.0");
console.log('Server running at http://0.0.0.0:80');
```
Then, do:
```bash
node --inspect demo.js
```
From a machine on the same subnet, go to `http://[ip of the webserver]:8080`, you should see `Welcome Node.js`.

## Installing markserv
```bash
yarn global add markserv
```

### Test
```bash
echo "# Test" > test.md
markserv test.md -p 8080 -a 0.0.0.0 
```
Browse to `http://[ip of the webserver]:8080` and you should see formatted markdown.

### Removing the footer
```bash
vi /usr/local/share/.config/yarn/global/node_modules/markserv/lib/templates/markdown.html
```
> `/usr/local/share/.config/yarn/global/node_modules` is the location where yarn installs modules when you use the global tag and are logged in as root.

Delete the following line (line 17 for my version): `<footer><sup><hr> Served by <a href="https://www.npmjs.com/package/markserv">MarkServ</a> | PID: {{pid}}</sup></footer>` (You can also decide to just remove the pid if you want to).

