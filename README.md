## Discrete Panel

This panel shows discrete values in a horizontal graph. This lets show state transitions clearly. It is a good
choice to display string or boolean data

### Screenshots

![example](https://raw.githubusercontent.com/cahya-wirawan/grafana-discrete-panel/master/src/img/screenshot-station-1.png)
![example](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-multiple.png)
![example](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-single-1.png)
![example](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-single-2.png)
![example](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-single-3.png)
![example](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-single-4.png)
![options](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-options-1.png)
![options](https://raw.githubusercontent.com/NatelEnergy/grafana-discrete-panel/master/src/img/screenshot-options-2.png)

### Building

To complie, run:

```
npm install -g yarn
yarn install --pure-lockfile
grunt
```

To lint everything:

```
yarn pretty
```

#### Changelog

##### v0.0.10

* Add new options:
  * write metric name on the right side
  * enable/disable the values on hover
  * zoom on mouse click or open a link
  * choose time range on click
  * hide or enable the drill down menu using the options: "button", "text" or "hidden"
  * metric name on the tooltip
  * open the link in a new tab or current tab

##### v0.0.9

* Add button with links to each rows (see the first picture above). The size of the button will be scaled automatically
  based on the height of the row. The URL is to define in the options tab.

##### v0.0.8 (not released yet)

* TODO... annotations

##### v0.0.7

* Switch to typescript
* Override applyPanelTimeOverrides rather than issueQueries to extend time
* Support numeric unit conversion
* New rendering pipeline (thanks @jonyrock)
* Don't detect duplicate colors from metrics
* Formatting with prettier.js
* Only hide hover text when it collides
* Show time axis (copied from novatec-grafana-discrete-panel)
* Improved text collision behavior

##### v0.0.6

* Fix for grafana 4.5 (thanks @alin-amana)

##### v0.0.5

* Support results from the table format
* Support results in ascending or decending order
* Configure legend percentage decimal points
* Legend can show transition count and distinct value count
* Clamp percentage stats within the query time window
* Changed the grafana dependency version to 4.x.x, since 3.x.x was not really supported
* Fixed issues with tooltip hover position
* Option to expand 'from' query so the inital state can avoid 'null'

##### v0.0.4

* Support shared tooltips (not just crosshair)

##### v0.0.3

* Configure more colors (retzkek)
* Fix tooltips (retzkek)
* Configure Text Size
* Support shared crosshair

##### v0.0.2

* Use the panel time shift.

##### v0.0.1

* First working version
