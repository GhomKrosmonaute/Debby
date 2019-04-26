
const Debby = require(__dirname+"/Debby.js")

const save = new Debby("./test.json")

	console.log(save.json)
	save.json.push(`Hello world n°${save.json.length + 1}`)
	save.end() // <= async function
	console.log(save.json)
