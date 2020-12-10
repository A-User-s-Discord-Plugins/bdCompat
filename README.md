# bdCompat for Vizality

Compatibility layer for running BetterDiscord plugins in Vizality<br>
Forked from https://github.com/Juby210/bdCompat

![Screenshot showing a list of BetterDiscord plugins](https://auser.owns-a-furry.club/bfddF92.png)

## Installation

Clone this repository to your Vizality install's plugins folder

```
git clone https://git.gent.ooo/abUwUser/vz-bdCompat.git
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
There is a simple fix to that: Open BIV in Notepad or in any text editor and add this code after line 1998:
```js
if (_this.props.className = "vz-addon-card-icon-image-wrapper") return;
```
What the issue looks like:
![The issue](https://auser.owns-a-furry.club/2f403Ea.gif)
How to fix it:
![How to fix](https://auser.owns-a-furry.club/FeDC2bA.gif)