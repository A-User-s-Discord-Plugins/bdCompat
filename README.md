# bdCompat for Vizality

Compatibility layer for running BetterDiscord plugins in Vizality<br>
Forked from https://github.com/Juby210/bdCompat

![Screenshot showing a list of BetterDiscord plugins](https://auser.owns-a-furry.club/A0eAc42.png)

## Installation

Clone this repository to your Vizality install's plugins folder

```
git clone https://github.com/A-User-s-Discord-Plugins/bdCompat
```

## Installing BD plugins

<!-- Before you download and install any BD plugins, please take a look at the incompatibilites note on `INCOMPATIBILITIES.md` file -->

- Put the plugin in the `plugins` folder, if it doesn't exist then create one.
- Reload your Discord.
- Go to User Settings and head to the `BetterDiscord Plugins` section
- Enable the said plugin

#### edCompat? ED plugins support?
If you want EnhancedDiscord plugins support, you can use [EDPluginsLoader](https://github.com/Juby210/EDPluginsLoader) for BD.

## FAQ
#### [BetterImageViewer](https://github.com/1Lighty/BetterDiscordPlugins/tree/master/Plugins/BetterImageViewer) tries to zoom VZ plugin/theme icons
In [commit 91a2a96](https://github.com/vizality/vizality/commit/91a2a964ff61c52500560aff4713a8facf607051), `LazyImage` was added to VZ plugin/theme icons. This causes a problem to BIV, since it uses `LazyImage` to add the zooming functionality.<br />
I (A user) made a manual fix for BIV 1.5.1. [Download here](https://gist.github.com/abUwUser/c4cb8309b3c55fcd8fd4171c0c7b95c0) the patched plugin. Also I give all credits to [Lighty](https://github.com/1Lighty) for making this amazing plugin. <br/>

What the issue looks like:
![The issue](https://auser.owns-a-furry.club/2f403Ea.gif)

#### Plugins reloads at random times / infinitely
Yeah, I know that issue, but I didn't figured out exatly why this happens. My guesses it has be done with Vizality's hot reload feature, that is reloading BDCompat, making so to reload all BD plugins.

#### Lag when enabling a plugin
Now this time i have no idea to why this issue happens. If you figure out why, please make a PR and ping me in Discord talking about your guesses / how you fixed it<br/>

What the issue looks like:
![](https://auser.owns-a-furry.club/67A67bc.gif)

#### Hey! I found one issue! How i can contact you?
You can join in my [Discord Server](https://discord.gg/jGmSTkk) and report in [#support](https://discord.com/channels/662100872406499348/662111506254659615)