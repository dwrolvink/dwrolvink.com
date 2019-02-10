eval "$(ssh-agent -s)"
ssh-add /home/dorus/.ssh/github2
git add .
git commit
git push
