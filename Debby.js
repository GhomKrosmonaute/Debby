
const fs = require("fs")
const {promisify} = require("util")
const writeFile = promisify(fs.writeFile)

const globalDebby = []

class Debby{

	/* La classe Database représente un emplacement.
	 * Elle contient des statistiques et automatique
	 * le système de sauvegarde.
	 */

	constructor(path){
		this.path = path
		this.progress = false
		this.content = {}
		this.backup = {}
		this.load()
		this.index = globalDebby.length
		globalDebby.push(this)
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

	/* ⚠ Methode save déconseillée !
	 * Tout est automatisé.
	 * Utilisez plutôt la methode end.
	 */

	async save(){
		if(this.progress)return false;
		this.progress = true
		try{
			await writeFile(this.path,JSON.stringify(this.content,null,"\t"))
		}catch(err){
			await writeFile(this.path,"{}")
		}
		this.progress = false
	}

	/* ⚠ Methode load déconseillée
	 * Tout est automatisé.
	 */

	load(){
		try{
			this.content = JSON.parse(fs.readFileSync(this.path,"utf8"))
			this.backup = JSON.parse(JSON.stringify(this.content))
		}catch(err){
			this.content = {}
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

	/* END appelle la methode end de tous les Debby.
	 * Il est conseillé de l'utiliser plutot que end si
	 * vous utilisez plusieur Debby.
	 */

	static global_end(){
		for(var i=0; i<globalDebby.length; i++){
			globalDebby[i].end()
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
		return globalDebby.find(debby=>{
			return debby.path === pathName || debby.path
				.replace(__dirname,"")
				.includes(pathName)
		})
	}
}

module.exports = Debby;
