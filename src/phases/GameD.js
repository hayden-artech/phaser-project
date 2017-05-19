import Phase from './Phase'
import Basket from '../groups/Basket'
import config from '../config'

export default class GameC extends Phase{
    init(){
        this.stage.backgroundColor = "#FFFFFF"
    }

    create(){

        this.returnButton = this.add.text(50*config.scaleRate, 50*config.scaleRate, "Return To Home Screen", { font: 'bold 20pt Arial', fill: 'red', align: 'left'})
        this.returnButton.scale.setTo(config.scaleRate)
        this.returnButton.inputEnabled = true;
        this.returnButton.events.onInputDown.add(()=> this.state.start('HomeScreen'))

        this.itemList = []

        this.sources.items.forEach((source, index)=>{
            this.itemList.push(new Basket({game:this, x:10, y:index*20, typeName:source.name }))
        })
    }

    update(){
        this.itemList.forEach((item)=> item.x += 5)
    }
}