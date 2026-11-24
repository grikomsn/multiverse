# grikomsn

Griko Nibras in your terminal.

```bash
npx grikomsn
```

It needs Node.js 22 or later. The package is one file and installs no dependencies.

In a terminal, the command opens a live card: the home page of [nibras.co](https://nibras.co), with its dither wave and its mascot. In a pipe or a script, it prints plain text.

## Keys and mouse

The mouse works too: a click opens a row or a page, the wheel moves a list, and the face likes a click.

| Key       | What it does                                                                 |
| --------- | ---------------------------------------------------------------------------- |
| `↑` `↓`   | Moves the cursor                                                             |
| `←` `→`   | Changes the page                                                             |
| `Enter`   | Opens the row in the browser                                                 |
| `c`       | Copies the address of the row                                                |
| `/`       | Opens the search bar                                                         |
| `t`       | Changes the theme                                                            |
| `Space`   | Presses the face. Try it twice.                                              |
| `m`       | Turns the mouse off, so you can select text. `Shift` and a drag also selects |
| `q` `Esc` | Quits                                                                        |

## Options

| Option           | What it does                                           |
| ---------------- | ------------------------------------------------------ |
| `--plain`        | Prints the card as text. This is the default in a pipe |
| `--json`         | Prints the facts as JSON                               |
| `--theme <name>` | Starts in the `light` or the `dark` theme              |
| `--no-motion`    | Shows still pictures. `NO_MOTION=1` does the same      |
| `--no-mouse`     | Does not read the mouse                                |
| `--offline`      | Uses the facts in the package, and makes no request    |

## Network

The card reads `https://nibras.co/card.json`, so it shows today's roles and posts. The request sends nothing about you. With `--offline`, or with no network, the card shows the facts from the day of its release.

## Source

[github.com/grikomsn/multiverse](https://github.com/grikomsn/multiverse/tree/main/apps/cli). The code is under the MIT License. `dist/THIRD-PARTY-LICENSES.txt` lists the packages inside the file.
