# jquery-sma-advertorial


## What is it?

A jQuery plugin that populates the best available deals for a region. Uses the smartAIRdeals API.

## Installation

Insert the following script to your code:

```
<script src="../jquery.sma.advertorial.min.js"></script>
```

Or use the remotely hosted version, available at:
```
<script src="http://85.25.43.140/addons/jquery-sma-advertorial/dist/jquery.sma.advertorial.min.js"></script>
```

Create a container element in your html code:

```html
<div id="sma-advertorial"></div>
```

Add the following code to your webpage:

```javascript
$( function() {
	$( "#sma-advertorial" ).smaAdvertorial( {
		clientId: "15548",
		categoryId: "5549851",
		language: "EN",
		limit: 4,
		datesVisible: true,
		mode: "cards",
		apiEndpoint: "http://XXX.XXX.XXX.XXX/addons/api/advertorial/getdeals/"
	} );
} );
```

## Parameters

### "clientId"

The identifier of the client

### "categoryId"

The identifier of the category we'll be getting our airdeals from

### "language"

You may use any of the following: "EN","EL"

### "mode"

The following modes are supported:

* list
* text
* cards

#### mode: "list"

A &lt;ul> html element with as many &lt;li> as the "limit" parameter specified.

#### mode: "text"

A text to be implemented directly to an advertorial. Max. "limit" parameter value is 3.

#### mode: "cards"

An html &lt;table> (in order to maximize compatibility through different newsportals) with two rows and two columns. Each cell contains the cover photo and the name/price combination of an airdeal. Overrides the value of the "limit" parameter.

### "limit"

Represents the number of airdeals we would like to display to our users.

### "datesVisible"

Only applicable to the "cards" mode. A boolean value that hides/shows the dates of the airdeals under the destination's city-name.


## Demo

Available at the /demo/ folder of the repo.


