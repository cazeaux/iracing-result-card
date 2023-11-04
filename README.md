# Iracing Result Card

This card displays the recent race results provided by the iRacing integration.

![example](example.png)

## iRacing integration

[Iracing integration](https://github.com/cazeaux/ha-iracing)

## Installation

Create a `www/iracing` folder in your `config`. If you have created the `www` folder for the first time, Home Assistant must be restarted.

Copy the `iracing-result-card.js` file into your `config/www/iracing` folder.

Add the custom resource by following these steps:

* Activate the advanced mode in your settings

![advanced settings](advanced-settings.png)

* Go to the **dashboards** page in the parameters, and click on the three dots on the top right, click on `Resources`

![resources](resources.png)

* Add the resource as follows:

![Alt text](add-resource.png)

Use the URL : `/local/iracing/iracing-result-card.js`

## How to use

```yaml
type: custom:iracing-result-card
entity: sensor.DRIVER_NAME_driver
```