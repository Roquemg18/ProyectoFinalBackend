const fs = require('fs')

class FilesDao{
    constructor(file){
        this.file = process.cwd() + `/src/files/${file}`
    }

    async getItems(){
        if(fs.existsSync(this.file)){
            try {
                const data = await fs.promises.readFile(this.file)
                const items = JSON.parse(data)
                return items
            } catch (error) {
                console.log(error)
            }
        }
        return 'el archivo no existe'
    }

    async saveItems(){
        await fs.promises.writeFile()
    }
    
}

module.exports = FilesDao