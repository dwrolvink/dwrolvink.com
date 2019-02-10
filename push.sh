eval "$(ssh-agent -s)"
ssh-add -l /home/dorus/.ssh/github
git add .
git commit
git push
