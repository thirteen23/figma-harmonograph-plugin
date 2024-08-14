<a href="https://thirteen23.com">
    <picture>
    	<source media="(prefers-color-scheme: dark)" srcset="./documentation/thirteen23_logo_light.svg"> 
    <img src="./documentation/thirteen23_logo.svg" alt="thirteen23 logo" title="thirteen23" align="right" width="160" height="auto" />
        </picture>
</a>

# thirteen23 harmonograph

![thirteen23 harmonograph cover](documentation/cover.png)

[thirteen23 harmonograph](https://github.com/thirteen23/figma-harmonograph) is a Figma plugin that allows you to create beautiful mathematical art! This powerful tool simulates a harmonograph and allows you to generate intricate and beautiful line art. Customize your harmonograph by editing the frequency, amplitude, and steps in simple mode, or jump into advanced mode to take full control! If you need some inspiration, click the “Spin Me” button for a randomized pattern.

## Usage

- Navigate to the [thirteen23 harmonograph](https://www.figma.com/community/plugin/1403515351214143901/thirteen23-harmonograph) plugin page, select Open in… and select your desired Figma file.
- Save or Like it to access it later in Figma. Go to **Plugins / Saved / thirteen23 harmonograph**

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="./documentation/divider-dark.png"> 
    	<img alt="divider please ignore" src="./documentation/divider-light.png">
</picture>

## Development

To get started, install the dependencies and build the project:

```bash
$ npm install
$ npm run dev
```

Once installed and built, connect the plugin to Figma.

## Connecting your plugin to Figma

To connect your plugin to Figma, go to **Plugins / Development / Import plugin from manifest...** in the Figma desktop app.

_You can also type "Import plugin from manifest..." in Figma global search to go there_

From there you need to link the **manifest.json** file located in the **public** folder in your directory:

```bash
/figma-harmonograph/public/manifest.json
```

You are now able to run the plugin in Figma. Go to: **Plugins / Development / thirteen23-harmonograph**

<picture>
	<source media="(prefers-color-scheme: dark)" srcset="./documentation/divider-dark.png"> 
    	<img alt="divider please ignore" src="./documentation/divider-light.png">
</picture>

## Credits

Harmonograph code based on: [ttencate/harmonograph](https://github.com/ttencate/harmonograph)
Built with: [Figma Plugin DS Svelte](https://github.com/thomas-lowry/figma-plugin-ds-svelte)

Inspired by:

[Intro to Harmonographs]([https://www.worldtreesoftware.com/apps/web/harmonograph/intro/)
[Harmonograph: A Visual Guide to the Mathematics of Music](https://www.vhplab.net/IMG/pdf/harmonograph_-_a_visual_guide_to_the_mathematics_of_music.pdf)
[Fran McConville's Harmonograph Page](https://www.fxmtech.com/harmonog.html)
