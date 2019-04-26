
const fs = require("fs")
const {promisify} = require("util")
const writeFile = promisify(fs.writeFile)

class Debby{

		/* La classe Database représente un emplacement.
		 * Elle automatise le système de sauvegarde.
		 */

	constructor(path,encoding){
		if(typeof path !== "string"){
			throw(
				new Error(`[Debby] the path must be a string !`)
			)
		}
		if(path.startsWith("./")){
			path = path.replace("./",__dirname+"/")
		}
		if(!path || !fs.existsSync(path)){
			throw(
				new Error(`[Debby] incorrect path : ${path||"none"}`)
			)
		}
		if(Debby.has(path)){
			throw(
				new Error(`[Debby] already existing path : ${path}`)
			)
		}
		this.path = path
		this.encoding = encoding || "utf8"
		this.progress = false
		this.content = {}
		this.backup = {}
		this.load()
		Debby.list.push(this)
	}
	get data(){
		return this.content
	}
	get source(){
		return this.content
	}
	get object(){
		return this.content
	}
	get json(){
		return this.content
	}
	set data(data){
		this.content = data
	}
	set source(data){
		this.content = data
	}
	set object(data){
		this.content = data
	}
	set json(data){
		this.content = data
	}

		/* ⚠ Methode save déconseillée !
		 * Tout est automatisé.
		 * Utilisez plutôt la methode end.
		 */

	async save(){
		if(this.progress)return false;
		this.progress = true
		try{
			await writeFile(this.path,JSON.stringify(this.content,null,"\t"))
			this.backup = JSON.parse(JSON.stringify(this.content))
		}catch(err){
			try{
				await writeFile(this.path,JSON.stringify(this.backup,null,"\t"))
				this.content = JSON.parse(JSON.stringify(this.backup))
				console.error(`[Debby] save error : ${this.path}\n[Debby] backup restored ✅\n[Debby] more details : ${err.message}`)
			}catch(err2){
				throw( 
					new Error(`[Debby] save error : ${this.path}\n[Debby] backup error : ${err2.message}\n[Debby] more details : ${err.message}`)
				)
			}
		}
		this.progress = false
	}

		/* ⚠ Methode load déconseillée
		 * Tout est automatisé.
		 */

	load(){
		try{
			this.content = JSON.parse(fs.readFileSync(this.path,this.encoding))
			this.backup = JSON.parse(JSON.stringify(this.content))
		}catch(err){
			this.content = {}
			console.error(`[Debby] load error : ${this.path}\n[Debby] file will be created ✅`)
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
		if(JSON.stringify(this.backup,null,"") !== JSON.stringify(this.content,null,"")){
			await this.save()
		}
	}

		/* END appelle la methode end de tous les Debby.
		 * Il est conseillé de l'utiliser plutot que end si
		 * vous utilisez plusieur Debby.
		 */

	static global_end(){
		for(var i=0; i<Debby.list.length; i++){
			Debby.list[i].end()
		}
	}

		/*
		 *
		 *
		 */

	static has(pathName){
		let debby = Debby.find(pathName)
		if(debby){
			return true
		}
		return false
	}

		/* Cette methode find est utilisée partout dans le programme
		 * pour récupérer une database grace a un bout de son path.
		 * En tant qu'utilisateur vous devriez plutot utiliser la
		 * methode get qui est faite de façon a vous faciliter le tout.
		 */

	static find(pathName){
		return Debby.list.find(debby=>{
			return debby.path === pathName || debby.path
				.replace(__dirname,"")
				.includes(pathName)
		})
	}
}

Debby.list = []

module.exports = Debby;
