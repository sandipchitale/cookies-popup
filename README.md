# chrome.cookies

This extension uses the `chrome.cookies` API to show cookies for current domain via a popup UI. Also shows a badge showing the count of cookies.

## Overview

The extension uses `chrome.cookies.getAll()` to access and show the cookies for current tab's domain (all ports) in a popup window.

It supports removal of all cookies for `localhost` or `127.0.0.1` URLs for testing purposes.

## Running this extension

1. Clone this repository.
2. Load this directory in Chrome as an [unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked).
3. Pin the extension to the taskbar to access the action button.
4. Open the extension popup by clicking the action button and interact with the UI.
