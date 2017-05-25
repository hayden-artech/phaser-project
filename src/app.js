import 'pixi'
import 'p2'
import Phaser from 'phaser'

import config from './config.js'

import Boot from './phases/Boot'
import Loading from './phases/Loading'
import Logo from './phases/Logo'
import HomeScreen from './phases/HomeScreen'
import GameA from './phases/GameA'
import GameB_sectionB from './phases/GameB_sectionB'
import GameC from './phases/GameC'
import GameC_sectionB from './phases/GameC_sectionB'
import GameD from './phases/GameD'
import BillBoard from './phases/BillBoard'
import RequestFullScreen from './phases/RequestFullScreen'

import MenuButton from './groups/MenuButton'

import {gameASources, gameBSources,gameCSources, } from './stores/initDate'

import { requestFullScreen, shuffle } from './functions'

class Game extends Phaser.Game {
    constructor(width, height){
        super(width, height, Phaser.AUTO);

        const logoSource = [
            {type:'image',key:'background',url:config.httpRoot+'/assets/images/maxresdefault.jpg'},
            {type:'image',key:'begin',url:config.httpRoot+'/assets/images/begin.png'},
            {type:'image',key:'protal',url:config.httpRoot+'/assets/images/protal.png'},
            {type:'image',key:'bg_1_3',url:config.httpRoot+'/assets/images/backgrounds/bg_1_3.png'},
            {type:'image',key:'character_0',url:config.httpRoot+'/assets/images/characters/character_0.png'},
            {type:'image',key:'mainLogo',url:config.httpRoot+'/assets/images/logos/main_logo.png'},
            {type:'image',key:'GameALogo',url:config.httpRoot+'/assets/images/logos/game_a_logo.png'},
            {type:'image',key:'backetBack',url:config.httpRoot+'/assets/images/backets/backet_back.png'},
            {type:'audio',key:'buttonClick',url:config.httpRoot+'/assets/sounds/buttonclick.mp3'},
            {type:'audio',key:'buttonHover',url:config.httpRoot+'/assets/sounds/buttonhover.mp3'},
            {type:'audio',key:'bgMusic',url:config.httpRoot+'/assets/sounds/BgMusic.mp3'},
            {type:'audio',key:'correctAnswer',url:config.httpRoot+'/assets/sounds/correct.mp3'},
            {type:'audio',key:'wrongAnswer',url:config.httpRoot+'/assets/sounds/wrong.mp3'},
            {type:'audio',key:'startGame',url:config.httpRoot+'/assets/sounds/StartGame.mp3'},
        ]

        for(let i=0;i<10;i++){
            logoSource.push({
                type:'image',key:`bread_${i}`,url:config.httpRoot+`/assets/images/breads/bread_${i}.png`
            })
        }
        for(let i=0;i<5;i++){
            logoSource.push({
                type:'image',key:`backet_${i}`,url:config.httpRoot+`/assets/images/backets/backet_${i}.png`
            })
        }
        for(let i=0;i<6;i++){
            logoSource.push({
                type:'image',key:`belt_${i}`,url:config.httpRoot+`/assets/images/belts/belt_${i}.png`
            })
        }

        for(let i=0;i<3;i++){
            logoSource.push({
                type:'image',key:`bubble_${i}`,url:config.httpRoot+`/assets/images/bubbles/Game1_bubble_${i}.png`
            })
        }

        const gameList = [
            {name:'Game A',phase:'GameA'},
            {name:'Game B',phase:'GameB'},
            {name:'Game C',phase:'GameC'},
            {name:'Game D',phase:'GameD'},
            {name:'Game E',phase:'GameState'}
        ]

        //Game C need to shuffle at app.js as both section need the same sources
        const randGameCSources = shuffle(gameCSources)

        this.state.add('Boot',new Boot({nextPhase:'LogoLoading'}))
        this.state.add('LogoLoading',new Loading({nextPhase:'Logo',sources:logoSource}))
        this.state.add('Logo',new Logo({nextPhase:'HomeScreen'}))
        this.state.add('HomeScreen',new HomeScreen({nextPhase:'GameState',gameList}))
        this.state.add('GameA',new GameA({nextPhase:'BillBoard',sources:gameASources}))
        this.state.add('GameB',new GameB_sectionB({nextPhase:'BillBoard',sources:gameBSources.sectionB}))
        this.state.add('GameC',new GameC({nextPhase:'GameC_sectionB',sources:randGameCSources}))
        this.state.add('GameC_sectionB',new GameC_sectionB({nextPhase:'BillBoard',sources:randGameCSources}))
        this.state.add('GameD',new GameD({nextPhase:'BillBoard',sources:gameASources}))
        this.state.add('BillBoard',new BillBoard({nextPhase:'HomeScreen'}))

        this.gameState = {
            create: ()=> {

                this.returnButton = this.add.text(50*config.scaleRate, 50*config.scaleRate, "Return To Home Screen", { font: 'bold 20pt Arial', fill: 'white', align: 'left'})
                this.returnButton.scale.setTo(config.scaleRate)
                this.returnButton.inputEnabled = true;
                this.returnButton.events.onInputDown.add(()=> this.state.start('HomeScreen'))

                this.testGroup = new MenuButton({game: this, x:this.world.centerX, y:this.world.centerY, text: 'Hello', asset: 'begin', inputUpCallback:()=>{}})

                this.beginImg2 = this.add.sprite(100, this.world.centerY, 'begin')
                this.beginImg2.anchor.setTo(0,0.5)
                this.beginImg2.scale.setTo(0);
                this.beginImg2.angle = -180;
                this.beginImg2.inputEnabled = true;
                this.beginImg2.input.enableDrag();

                this.beginImg2.events.onInputDown.add((target, event)=> console.log(target, event))

                this.add.tween(this.beginImg2.scale).to({x:.3,y:.3}, 1000, Phaser.Easing.Linear.None, true)
                this.add.tween(this.beginImg2).to({angle:0} , 1000, Phaser.Easing.Linear.None, true)
                this.add.tween(this.beginImg2.anchor).to({x:.5}, 1000, Phaser.Easing.Linear.None, true)

            },
            update: ()=> {

            }
        };
    window.addEventListener('resize',(ev)=>{
        let wannaWidth= 1920,
        wannaHeight= 1100;
        const parentHeight = window.innerHeight,
        parentWidth = window.innerWidth;
        let scaleRate = 0;

        if(wannaWidth/wannaHeight > parentWidth/parentHeight){
            scaleRate = parentWidth/wannaWidth
            wannaHeight = wannaHeight * scaleRate
            wannaWidth = parentWidth
        }else{
            scaleRate = parentHeight/wannaHeight
            wannaWidth = wannaWidth * scaleRate
            wannaHeight = parentHeight
        }
        config.wannaWidth= Math.round(wannaWidth)
        config.wannaHeight= Math.round(wannaHeight)
        config.scaleRate= scaleRate.toFixed(5)

        this.scale.setGameSize(config.wannaWidth, config.wannaHeight);

    })

        this.state.add('GameState', this.gameState);

        this.state.start('Boot')
    }
}


document.querySelector('#accept_full').addEventListener('click',(ev)=>{
    document.querySelector('#content').style.display = 'none'
    requestFullScreen();
    var game = new Game(config.wannaWidth, config.wannaHeight);
})

document.querySelector('#denial_full').addEventListener('click',(ev)=>{
    document.querySelector('#content').style.display = 'none'
    var game = new Game(config.wannaWidth, config.wannaHeight);
})


config.testing = 'testtest'
