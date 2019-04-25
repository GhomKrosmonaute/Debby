# Debby - JSON Database

Easy-to-use JSON-based database for beginners

## Install

This package has three files.

- Debby.js
- README.md
- package.json

```fix
npm install json-debby
```

## Initialize

Add as many files as you want to your database by entering their path as a parameter of the constructor. They will be managed by Debby automatically, depending on what you request from your database.

```js
const Debby = require("json-debby")
const debby = new Debby("./save.json") 
```

## Functions

The **path** parameter represents a complete path.  
The **pathName** parameter represents a piece of path.  

- class **Debby**
	- content *alias : data, source, object & json*
	- end()
	- *static* global_end()
	- *static* has( *pathName* )
	- *static* find( *pathName* )


## Examples

```js
const debby = new Debby("./save.json")

function example(){
	
	cosnole.log(debby.json) //=> {}

	debby.json.fleurs = {}
	debby.json.fleurs.rose = "🌹"

	console.log(debby.json) /*=> {
		"fleurs" : {
			"rose" : "🌹"
		}
	}*/

	debby.end()
}

example()
```

# Thank for testing

I intend to improve this package as much as I could. Thank you for downloading!