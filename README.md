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
const db = new Debby(...paths)
```

## Functions

The **path** parameter represents a complete path.  
The **pathName** parameter represents a piece of path.  
The **data** parameter represents the path in the database.  

- class **Debby**
	- Prototype
		- addDatabase( *path* )
		- get( *pathName, ...data* )
		- set( *pathName, ...data* )
		- find( *pathName* )
		- end()
		- log()
	- Global
		- *static* GET( *pathName, ...data* )
		- *static* SET( *pathName, ...data* )
		- *static* FIND( *pathName* )
		- *static* END()
		- *static* LOG()
- class **Database** (*in Debby*)
	- Prototype
		- get( *...data* )
		- set( *...data* )
		- end()
		- log()


## Examples

```js
const save = new Debby(
	"./players.json",
	"./scores.json"
)
const settings = new Debby(
	"./config.json",
	"./guildConfigs.json"
)

function example(){
	save.set("players","<ID>","name","Ghom")
	save.set("players","<ID>","level",30)
	save.set("games",{
		"The Binding Of Isaac":{
			globalHighscore : 1100,
			globalItems : 65
		}
	})
	settings.set("config","prefix",".")
	settings.set("guildConfigs",[])
	settings.get("guildConfigs").push({
		name : "testing",
		value : false
	})
	Debby.END()
}

example()
```

# Thank for testing

I intend to improve this package as much as I could. Thank you for downloading!