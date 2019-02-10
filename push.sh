eval "$(ssh-agent -s)"
ssh-add -l /home/dorus/.ssh/github2
git add .
git commit
git push
