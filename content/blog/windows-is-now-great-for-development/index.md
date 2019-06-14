---
title: Windows Is Now Great for Development
date: "2019-06-14"
spoiler: My personal thoughts and experience on how Windows is getting better for development
---

I'm not saying that Windows was never great for web or any kind of development, but from personal experience, prepping and developing things on Windows was quite a hassle at the time.

From extra configurations and specific tools to be installed, to different file handlings compared to Linux and macOS, Windows needs some special treatment and extra steps before actually developing things. But seeing how tools and Windows itself evolves from time to time, or update to update, there's not much of a difference working on Windows compared to working on Linux and macOS. And people already discussed a lot like "[is Windows okay for web development](https://www.reddit.com/r/webdev/comments/3ijf06/is_windows_okay_for_web_development/)" and [various guides to setting up Windows for development](https://www.google.com/search?q=windows+for+web+development).

Some of what I think the reasons why Windows is now great for development is:

## Tools are now multi-platform

I remember a time where a software is only available on one operating system, so you gotta search something similar or better for another operating system. Now most softwares are multi-platform, take for example: [Visual Studio Code](https://code.visualstudio.com/), [JetBrains' various IDEs](https://www.jetbrains.com/products.html), [NetBeans](https://netbeans.apache.org/), and a whole other [text editors](https://alternativeto.net/software/visual-studio-code/) and [IDEs](https://alternativeto.net/software/phpstorm/) available on Windows, Linux, and macOS with no difference whatsoever. So if you're the kind of people who switch workstations or have multiple operating systems installed, you'll get the same experience for your preferred editors.

For example, I have a MacBook and a Windows laptop with both have the same editors and tools installed. Both development experience is the same because all the softwares and tools are the same or similar. VS Code and PhpStorm shortcuts may vary on different platforms, but both have the same interface and workflows. No need to worry having a specific software on one operating system again.

## Similar tools are available

As I mentioned before, some softwares or tools are only available on a specific platform. Like how you can install tools quickly using package managers on Linux by just running `apt-get install php` to install PHP. But on macOS you need to add [Homebrew](https://brew.sh/) first, then run `brew install php`. [Homebrew is also available on Linux and Windows on WSL](https://docs.brew.sh/Homebrew-on-Linux), but as we know [things on WSL aren't that performant](https://www.google.com/search?q=wsl+performance). So if you need a "package manager" for Windows like the others, we can use [Chocolatey](https://chocolatey.org/) which can install tools by running `choco install php`. No need to download and install things manually.

Another example, installing PHP and MariaDB on Linux or macOS is just simply `apt-get install php mariadb` or `brew install php mariadb`, and Windows is just `choco install php mariadb`. No need to download separate things and install individually. Yes, some prefer using [WAMP](https://bitnami.com/stack/wamp/installer) or [XAMPP](https://www.apachefriends.org/download.html), but it's not the same experience like the other operating systems and requires extra configuration on environment variables and paths, and not to mention the hassle to download and install things manually.

## Windows itself is getting better

Yes, Windows isn't that perfect with it's [various unstable updates](https://www.google.com/search?q=windows+update+unstable) and random hiccups. But let's be honest for a moment, Windows is getting better by every update, and I'm talking about Windows 10 and not 7 or older versions. Compared to the early days of Windows 10, current versions are much more polished, optimized for various workstations, and better driver support from Windows updates which nowadays most drivers are available through an update.

With the addition of [Windows Subsystem for Linux (WSL)](https://www.google.com/search?q=windows+wsl), now you can run Linux on Windows by just [download your preferred distro on Microsoft Store](https://www.microsoft.com/store/productId/9NBLGGH4MSV6). While WSL isn't most developers' first choice because of its slow performance, future Windows 10 releases will include the [next iteration of WSL which includes a Linux kernel](https://www.howtogeek.com/424886/windows-10s-linux-kernel-is-now-available/). Or developer friendly additions like when [someone tried running `python` on the command line and it opens the Microsoft Store to install Python](https://twitter.com/shanselman/status/1127022451433410560?s=20), which [Microsoft explained in a blog post about this feature](https://devblogs.microsoft.com/python/python-in-the-windows-10-may-2019-update/). Not to mention now [Microsoft is on fire in the open source world](https://www.google.com/search?q=microsoft+open+source+strategy).

## Verdict

Nowadays using Windows for development is just like other operating systems, you just need the right tools and configurations, then you're good to go. Personally I develop both on macOS on my MacBook when I'm on the go, and on Windows when I'm at home or specifically need something Windows-only. And so far, working on Windows is better than before.

What do you think about developing things on Windows?
