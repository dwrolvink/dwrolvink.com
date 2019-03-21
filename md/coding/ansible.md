# Ansible
This series is a very basic walkthrough in setting up Ansible, and making sure that Ansible can connect to and manage Windows hosts.

The walkthrough is very terse. I like to provide mostly code that you can copypaste, combined with simple do-this-than-that steps.
I'll only add extra information if there are big gotchas, or if my setup is not desireable for your setup (but why I had to do it regardless). 

I don't use any placeholders (like `<username>`), instead I start a section with a setup heading, and give you dummy information there. I personally find that easier to follow most of the time.

If I got most information in a certain section from one source, then that source will be listed at the top of the section. These sources provide more explanation (and that can be a good or a bad thing). In my workthrough I made some changes here and there to the source material, as often the source material misses steps (or fails to include necessary steps that have been explained earlier on / in other sources). 

- [Ansible - First steps](https://github.com/dwrolvink/Linux/blob/master/CentOS/Ansible/ansible_first_steps.md)
  Setting up Ansible, create a playbook, simple password encryption using vault
- [Ansible - Windows - Certificate Authentication](https://github.com/dwrolvink/Linux/blob/master/CentOS/Ansible/ansible_windows_authentication.md)
- [Ansible - Windows - Kerberos Authentication](https://github.com/dwrolvink/Linux/blob/master/CentOS/Ansible/ansible_kerberos_authentication.md)
