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
 sudo yum install -y yarn
```

### Notes
Centos7 is a weird duck in the lake. It ships with firewalld enabled. To reach a hosted website from another machine, disable firewalld with
```bash
systemctl stop firewalld
```

Or just open the port:
```bash
firewall-cmd --zone=public --add-port=8081/tcp --permanent
firewall-cmd --reload
```

### Test
Create `demo.js`, with contents:
```bash
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Welcome Node.js');
}).listen(8081, "0.0.0.0");
console.log('Server running at http://0.0.0.0:8081');
```
Then, do:
```bash
node --inspect demo.js
```
From a machine on the same subnet, go to `http://[ip of the webserver]:8081`, you should see `Welcome Node.js`.

## Installing markserv
```bash
yarn global add markserv
```

If you've installed yarn as sudo user (instead of root), add the following line to your .bashrc:
```bash
export PATH="$PATH:/home/<user>/.yarn/bin" 
```

### Test
```bash
echo "# Test" > test.md
markserv test.md -p 8081 -a 0.0.0.0 
```
Browse to `http://[ip of the webserver]:8081` and you should see formatted markdown.

### Removing the footer
```bash
vi /usr/local/share/.config/yarn/global/node_modules/markserv/lib/templates/markdown.html
```
> `/usr/local/share/.config/yarn/global/node_modules` is the location where yarn installs modules when you use the global tag and are logged in as root. If not logged in as root, it will be saved to `/home/<username>/.yarn/bin/`

Delete the following line (line 17 for my version): `<footer><sup><hr> Served by <a href="https://www.npmjs.com/package/markserv">MarkServ</a> | PID: {{pid}}</sup></footer>` (You can also decide to just remove the pid if you want to).
a
I'm using markserv to serve markdown to my main website, so I actually remove everything except for the following:
```html
<article class="markdown-body">
{{{content}}}
</article>
```

### Running Markserv in a folder
```bash
cd /var/www/dwrolvink.github.io/
markserv -p 8081 -a 0.0.0.0 &
```

### Creating a Markserv service
Always nice to have a service you can just turn on and not forget to uncouple the command you just ran.

To make a service for Markserv is pretty trivial. Just make a file called `/etc/systemd/system/markserver.service`
and give it the following content:
```bash
[Unit]
Description=Markdown service for <my website>

# Make sure the network is initialized first
After=network.target

[Service]
ExecStart=/home/<username>/.yarn/bin/markserv -p 8081 -a 0.0.0.0

# Restart Backend when an error causes it to shutdown
Restart=on-failure
TimeoutStartSec=20
WorkingDirectory=/var/www/<your website root folder>

[Install]
# Make sure this service is started up after reboot
WantedBy=multi-user.target
```

Then run `systemctl start markserver`, `systemctl status markserver` to check if it ran succesfully, `systemctl daemon-reload` if you edit the file and want to try again, `systemctl enable markserver` to finally add it to boot up.
