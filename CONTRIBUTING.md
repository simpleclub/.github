# Contributing guide

This file outlines a general guide how you can contribute to public simpleclub repositories.  
If you are new to contributing on GitHub, you might want to see the setup section below. 

## Setting up your repo

### Fork the <repo> repository

* Ensure you have configured an SSH key with GitHub; see [GitHub's directions][ssh key].
* Fork this repository using the "Fork" button in the upper right corner of the GitHub page.
* Clone the forked repo: `git clone git@github.com:<your_github_user_name>/<repo>.git`
* Navigate into the project: `cd <repo>`
* Add this repo as a remote repository: 
  `git remote add upstream git@github.com:simpleclub/<repo>.git`
   
### Create pull requests

* Fetch the latest repo state: `git fetch upstream`
* Create a feature branch: `git checkout upstream/master -b <name_of_your_branch>`
* Now, you can change the code necessary for your patch.
* Commit your changes: `git commit -am "<commit_message>"`
* Push your changes: `git push origin <name_of_your_branch>`

After having followed these steps, you are ready to [create a pull request][create pr].  
The GitHub interface makes this very easy by providing a button on your fork page that creates 
a pull request with changes from a recently pushed to branch.  
Alternatively, you can also use `git pull-request` via [GitHub hub][].

## Notes

* Always add tests or confirm that your code is working with current tests.
* Use the coding conventions for the programming language.
* Adhere to the lints, i.e. the warnings provided by the linter.  
* If you find something that is fundamentally flawed, please propose a better solution - 
  we are open to complete revamps.

## Contributor License Agreement

We require contributors to sign our [Contributor License Agreement (CLA)][CLA].
In order for us to review and merge your code, please follow the link and sign the agreement.

[create pr]: https://help.github.com/en/articles/creating-a-pull-request-from-a-fork
[GitHub hub]: https://hub.github.com
[ssh key]: https://help.github.com/articles/generating-ssh-keys
[CLA]: https://simpleclub.page.link/cla
[versioning]: https://stackoverflow.com/questions/66201337/how-do-dart-package-versions-work-how-should-i-version-my-flutter-plugins/66201338#66201338
