
const fs = require("fs")
const {promisify} = require("util")
const writeFile = promisify(fs.writeFile)
const grid = require('console-gridlist')

const globalDebby = []

class Debby{

	/* Debby est le gestionnaire de bases de données.
	 * Il peut gérer autant de bases de données qu'il le faudra.
	 * la variable globalDebby contient tous les Debby existants.
	 */

	/* Le constructor prend des path en argument.
	 * Chaque path devient une base de données.
	 * la variable this.databases contient toutes les bases de données du Debby
	 */

	constructor(...paths){
		this.databases = []
		paths.forEach(path=>{
			if(Debby.FIND(path)) return console.error(`[Debby] ${path} is already used.`);
			this.databases.push(new Database(path))
		})
		if(paths.length===0) this.databases.push(new Database(`${__dirname}/database.json`));
		globalDebby.push(this)
		this.index = globalDebby.length
		console.log(`[Debby] new instantiated Debby`)
	}

	/* addDatabase ajoute une base de donnée post-instance.
	 * L'argument path doit être précis, très précis.
	 * Renvoie true si la base de donnée à été créée sans souci.
	 * Sinon, renvoie undefined.
	 */

	addDatabase(path){
		if(Debby.FIND(path)) return console.error(`[Debby] ${path} is already used.`);
		this.databases.push(new Database(path))
		return true
	}

	/* Les methodes get et set servent respectivement à 
	 * récupérer une donnée dans un objet sauvegardé et
	 * modifier/créer la valeur dans le chemin indiqué.
	 * Si les chemins n'existent pas, ils sont créés.
	 */

	get(pathName,...data){
		let database = this.find(pathName)
		if(database){
			return database.get(...data)
		}else{
			console.error(`[Debby] ${pathName} is not a valid path.`)
		}
	}
	set(pathName,...data){
		let database = this.find(pathName)
		if(database){
			database.set(...data)
		}else{
			console.error(`[Debby] ${pathName} is not a valid path.`)
		}
	}

	/*
	 *
	 *
	 */

	has(pathName,...data){
		let database = this.find(pathName)
		if(database){
			return database.has(...data)
		}else{
			console.error(`[Debby] ${pathName} is not a valid path.`)
		}
		return false
	}

	/*
	 *
	 *
	 */

	/*async forEach(pathName,...data,f){
		let database = this.find(pathName)
		if(database){
			return await database.forEach(...data,f)
		}else{
			console.error(`[Debby] ${pathName} is not a valid path.`)
		}
		return false
	}*/

	/* La methode save est déconseillée à l'utilisateur.
	 * Elle force la sauvegarde tant qu'aucune n'est en cours.
	 * Elle ne vérifie pas si l'object à été modifié avant.
	 * On préfèrera utiliser la methode end qui se trouve plus bas.
	 */

	async save(pathName){
		let database = this.find(pathName)
		if(database){
			await database.save()
		}else{
			console.error(`[Debby] ${pathName} is not a valid path.`)
		}
	}

	/* Ce load appelle la methode fs.readFileSync afin
	 * d'écraser l'object existant et de le remplacer
	 * par un object sauvegardé dans un fichier JSON.
	 * Ausi déconseillé que la methode save.
	 */

	load(pathName){
		let database = this.find(pathName)
		if(database){
			database.load()
		}else{
			console.error(`[Debby] ${pathName} is not a valid path.`)
		}
	}

	/* Cette methode find est utilisée partout dans le programme
	 * pour récupérer une database grace a un bout de son path.
	 * En tant qu'utilisateur vous devriez plutot utiliser la
	 * methode get qui est faite de façon a vous faciliter le tout.
	 */

	find(pathName){
		return this.databases.find(database=>{
			return database.path === pathName || database.path
				.replace(__dirname,"")
				.includes(pathName)
		})
	}

	/* Le end est une sorte de methode clé, il faut le mettre là
	 * ou vous êtes sûr que le programme ne plantera pas.
	 * A la fin d'un processus par exemple, car si il plante,
	 * ce sera avant cette methode clé et donc les données
	 * resteront intactes.
	 */

	 /* Cete methode va vous servir à sauvegarder toutes les
	  * bases de données de votre Debby de façon intelligente.
	  * Elle va comparer les changements et faire du debug.
	  * ⚠ N'utilisez qu'un seul end par base de donnée ! ⚠
	  */

	end(){
		for(var i=0; i<this.databases.length; i++){
			this.databases[i].end()
		}
	}

	/* log affiche dans la console les stats du Debby
	 */

	log(marge){
		console.log(`${marge||""}[Debby] ID : ${this.index}`)
		console.log(`${marge||""}[Debby] Databases : ${this.databases.length} items`)
		this.databases.forEach(database=>{
			database.log(`${marge||""}${marge||""}`)
		})
	}

	/* GET appelle la methode get de la base de donnée voulue en
	 * cherchant parmis les bases de données de tous les Debby.
	 */

	static GET(pathName,...data){
		let debby = Debby.FIND(pathName)
		if(debby) return debby.get(pathName,...data);
		console.error(`[Debby] ${pathName} is not a valid path.`)
	}

	/* SET appelle la methode set de la base de donnée voulue en
	 * cherchant parmis les bases de données de tous les Debby.
	 */

	static SET(pathName,...data){
		let debby = Debby.FIND(pathName)
		if(debby) return debby.set(pathName,...data);
		console.error(`[Debby] ${pathName} is not a valid path.`)
	}

	/* FIND renvoie le Debby contenant le path indiqué.
	 * Sinon, renvoie undefined.
	 */

	static FIND(pathName){
		return globalDebby.find(db=>db.find(pathName))
	}

	/* END appelle la methode end de tous les Debby.
	 * Il est conseillé de l'utiliser plutot que end si
	 * vous utilisez plusieur Debby.
	 */

	static END(){
		for(var i=0; i<this.globalDebby.length; i++){
			this.globalDebby[i].end()
		}
	}

	/* LOG affiche dans la console les stats de tous les Debby
	 */

	static LOG(marge){
		globalDebby.forEach(debby=>{
			debby.log(marge)
		})
	}
}




class Database{

	/* La classe Database représente un emplacement.
	 * Elle contient des statistiques et automatique
	 * le système de sauvegarde.
	 */

	constructor(path){
		this.path = path
		this.progress = false
		this.content = {}
		this.backup = {}
		this.loads = {
			minTime : -1,
			maxTime : -1,
			moyTime : 0,
			hits : 0,
			err : 0
		}
		this.saves = {
			minTime : -1,
			maxTime : -1,
			moyTime : 0,
			hits : 0,
			err : 0
		}
		this.load()
	}

	/* debby.get("database").persone.name
	 * debby.get("database","person","name")
	 * debby.get("database","person").name
	 * => "jean"
	 */

	get(...data){
		var current = this.content
		for(var i=0; i<data.length; i++){
			if(!current.hasOwnProperty(data[i])){
				return undefined
			}
			current = current[data[i]]
			if(i>=data.length-1){
				return current
			}
			if(typeof current !== "object"){
				return current
			}
		}
		return current
	}

	/* debby.set("database",{person:{name:"jean"}})
	 * debby.set("database","person",{name:"jean"})
	 * debby.set("database","person","name","jean")
	 * => "jean"
	 */

	set(...data){
		let val = data.pop()
		let path = data.join(".")
		var stringToPath = function (path) {
			if (typeof path !== 'string') return path;
			var output = [];
			path.split('.').forEach(function(item, index){
				item.split(/\[([^}]+)\]/g).forEach(function (key){
					if(key.length > 0){
						output.push(key);
					}
				});
			});
			return output;
		};
		path = stringToPath(path);
		var length = path.length;
		var current = this.content;
		path.forEach(function (key, index) {
			if(index === length -1){
				current[key] = val;
			}else{
				if(!current[key]){
					current[key] = {};
				}
				current = current[key];
			}
		});
		return val;
	}

	/*
	 *
	 *
	 */

	delete(...data){
		
	}

	/*
	 *
	 *
	 */

	has(...data){
		let prop = data.pop()
		let item = this.get(...data)
		if(item){
			if(Array.isArray(item)){
				if(isNaN(prop)){
					return false
				}else{
					return item[prop] ? true : false ;
				}
			}else if(typeof item === "object"){
				return item.hasOwnProperty(prop)
			}
		}
		return false
	}

	/*
	 *
	 *
	 */

	/*async forEach(...data,f){
		let item = this.get(...data)
		if(item){
			if(Array.isArray(item)){
				for(var i=0; i<item.length; i++){
					await f(item[i],i,item)
				}
				return this.set(...data,item)
			}else if(typeof item === "string"){
				let array = item.split('')
				for(var i=0; i<array; i++){
					await f(data[i],i,data)
				}
				return this.set(...data,array.join(''))
			}else if(typeof item === "object"){
				let array = Object.entries(item)
				for(var i=0; i<array.length; i++){
					await f(array[i][1],array[i][0],array)
				}
				return this.set(...data,Object.fromEntries(array))
			}
		}
		return false
	}*/

	/* ⚠ Methode save déconseillée !
	 * Tout est automatisé.
	 * Utilisez plutôt la methode end.
	 */

	async save(){
		let balise = Date.now()
		if(this.progress)return false;
		this.progress = true
		try{
			await writeFile(this.path,JSON.stringify(this.content,null,"\t"))
			this.time("saves",balise)
		}catch(err){
			console.error(`[Debby] ${this.path} save not work`)
			await writeFile(this.path,"{}")
			this.saves.err ++
		}
		this.progress = false
	}

	/* ⚠ Methode load déconseillée
	 * Tout est automatisé.
	 */

	load(){
		let balise = Date.now()
		try{
			this.content = JSON.parse(fs.readFileSync(this.path,"utf8"))
			this.backup = JSON.parse(JSON.stringify(this.content))
			this.time("loads",balise)
		}catch(err){
			console.error(`[Debby] ${this.path} load not work`)
			this.content = {}
			this.loads.err ++
		}
	}

	/* Le end est une sorte de methode clé, il faut le mettre là
	 * ou vous êtes sûr que le programme ne plantera pas.
	 * A la fin d'un processus par exemple, car si il plante,
	 * ce sera avant cette methode clé et donc les données
	 * resteront intactes.
	 */

	 /* Cete methode va vous servir à sauvegarder votre base
	  * de données de façon intelligente.
	  * Elle va comparer les changements et faire du debug.
	  * ⚠ N'utilisez qu'un seul end par base de donnée ! ⚠
	  */

	async end(){
		if(JSON.stringify(this.backup,null,"\t") !== JSON.stringify(this.content,null,"\t")){
			let saved = await this.save()
			if(saved){
				this.backup = JSON.parse(JSON.stringify(this.content))
			}
		}
	}

	/* time ne servirait a rien a un utilisateur.
	 * Veuillez ne pas l'utiliser pour le bon fonctionnement
	 * du programme.
	 */

	time(branch,balise){
		let duration = Date.now() - balise
		this[branch].hits ++;
		if(this[branch].minTime === -1) this[branch].minTime = duration;
		if(this[branch].maxTime === -1) this[branch].maxTime = duration;
		if(duration < this[branch].minTime) this[branch].minTime = duration;
		if(duration > this[branch].maxTime) this[branch].maxTime = duration;
		this[branch].moyTime = ((this[branch].moyTime * this[branch].hits) + duration) / (this[branch].hits + 1)
	}

	/* Affiche des stats et des info sur cette base de données.
	 */

	log(marge){
		console.log(`${marge||""}[Database] `+this.path)
		console.log(`${marge||""}${marge||""}`+grid(["type","hits","errors","min time","max time","moy time"],[
			["loads",this.loads.hits+" times",this.loads.err+" times",String(this.loads.minTime).slice(0,4)+" ms",String(this.loads.maxTime).slice(0,4)+" ms",String(this.loads.moyTime).slice(0,4)+" ms"],
			["saves",this.saves.hits+" times",this.saves.err+" times",String(this.saves.minTime).slice(0,4)+" ms",String(this.saves.maxTime).slice(0,4)+" ms",String(this.saves.moyTime).slice(0,4)+" ms"]
		]).replace(/\n/g,`\n${marge||""}${marge||""}`))
	}
}

module.exports = Debby;
