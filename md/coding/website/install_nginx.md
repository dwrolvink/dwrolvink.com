# Install Nginx on CentOS
[Source](https://www.cyberciti.biz/faq/how-to-install-and-use-nginx-on-centos-7-rhel-7/)

Add the following content to `/etc/yum.repos.d/nginx.repo` to add the nginx repo:
```bash
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/rhel/7/$basearch/
gpgcheck=0
enabled=1
```

Install nginx:
```
yum install -y nginx

mkdir /etc/nginx/sites-available/
mkdir /etc/nginx/sites-enabled/
touch /etc/nginx/sites-available/default.conf

# Create webdirectory, and set ownership to www-data
mkdir /var/www
chmod 775 -R /var/www

# Add user nginx and own ssh user to www-data
groupadd www-data
usermod <ssh user> -a -G www-data
usermod nginx -a -G www-data
sudo chown -R :www-data /var/www/

# (Optional) Change default directory for ssh user
# <logged in as ssh user>
echo "cd /var/www" > ~/.bashrc
```

Add the following to the bottom of the http block in `/etc/nginx/nginx.conf`:
```bash
include /etc/nginx/sites-enabled/*.conf;
server_names_hash_bucket_size 64;
```

Set contents of `/etc/nginx/sites-available/default.conf` to:
```bash
server { 
	listen 80; 
	server_name yeetbox dwrolvink.com;
	
	location / { 
		root /var/www/dwrolvink.github.io;
		index index.html
		try_uri $uri $uri/ =404;
	}
	
	location /md/ {
		proxy_pass http://localhost:8081; 
	}
} 

```

Pull website to /var/www:
```bash
yum install -y git
cd /var/www
git clone https://github.com/dwrolvink/dwrolvink.github.io.git
```

Enable the default site and start nginx
```bash
ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/default.conf
systemctl enable nginx
systemctl start nginx
```

## Access control
### SELinux
SELinux might be blocking proxy_pass. [You can turn SELinux off, or set it to permissive](https://linuxize.com/post/how-to-disable-selinux-on-centos-7/):

Add the following line to `/etc/selinux/config`: 
```bash
SELINUX=permissive
```
Then:
```bash
sudo shutdown -r now
#  Check
sestatus
```

### Firewalld
CentOS likes to be on the safe side of things. We need to enable port 80 before anything will work.

```bash
firewall-cmd --zone=public --add-port=80/tcp --permanent
firewall-cmd --reload
```


## Activating Markserv
As you might have noticed in the `default.conf`, `/md/` reroutes to port 8081. The idea is that Markserv runs on this port.
Go to [Installing Markserv](ttp://www.dwrolvink.com/?view=coding/website/install_markserv) to enable Markserv.

## Nginx and access from the internet
I changed the default.conf file because I got `Access Controll Allow Origin` errors. I'm not really that familiar with that yet. You can more about it here: [Nginx Access-Control-Allow-Origin and CORS](https://distinctplace.com/2017/04/17/nginx-access-control-allow-origin-cors/).

This config worked for me, not sure wheter the extra headers are necessary (in the last code block):
```bash

server {
        listen 80;
        server_name yeetbox www.dwrolvink.com;

        location / {
                root /var/www/dwrolvink.github.io;
                index index.html
                try_uri $uri $uri/ =404;
        }

        location /md/ {

		# Simple requests
    		if ($request_method ~* "(GET|POST)") {
      			add_header "Access-Control-Allow-Origin"  *;
    		}

		# Preflighted requests
		if ($request_method = OPTIONS ) {
			add_header "Access-Control-Allow-Origin"  *;
			add_header "Access-Control-Allow-Methods" "GET, POST, OPTIONS, HEAD";
			add_header "Access-Control-Allow-Headers" "Authorization, Origin, X-Requested-With, Content-Type, Accept";
			return 200;
		}

                proxy_pass http://localhost:8081;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_set_header Host $http_host;
                proxy_redirect off;
        }
}
```

Don't forget to restart nginx after editing the default.conf file, and don't forget to open port 80 and 8081 on your router!
