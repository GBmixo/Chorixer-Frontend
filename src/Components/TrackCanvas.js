import React from 'react';
import NoteList from './NoteList.js'
import ConvertToCoords from './ConvertToCoords.js'
//import generate from '@babel/generator';

export default class TrackCanvas extends React.Component{

    NOTES = {}

    componentDidMount = () => {
        this.renderBoard()
    }

    renderBoard = () => {
        const canvas = this.refs.canvas;
        canvas.style.background = "#4B4B55";
        const rect = canvas.getBoundingClientRect();
        canvas.addEventListener('click', e => {
            let object = {};
            object.x = (e.clientX - rect.left);
            object.y =  (e.clientY - rect.top);
            //console.log(object.x);
            //console.log(object.y);
            this.checkCollision(object.x, object.y);
            
        })
        
        for(let i = 0; i < 12; i++){
            
            this.generateRow(this.props.gridLength,i)
            if (i + 1 == 12){
                this.renderActiveNotes()
            }
        }
    }

    checkCollision = (clickX, clickY) => {
        let noteCollection = this.NOTES

        for (var note in noteCollection) {
            //console.log(noteCollection[note])
            let coords = note.split(' ')
            //console.log(coords[1] + noteCollection[note].width)
            if( (clickX > parseInt(coords[1])) && (clickX < (parseInt(coords[1]) + noteCollection[note].width)) && (clickY > parseInt(coords[0])) && (clickY < (parseInt(coords[0]) + noteCollection[note].height)) ){
                if(noteCollection[note].status == false){
                    this.noteClicked(note)
                }else if(noteCollection[note].status == true){
                    this.noteClicked(note)
                }
            }
        }
    }

    noteClicked = (noteKey) => {
        if(this.NOTES[noteKey].status == false){
            //console.log('note placed')
            this.NOTES[noteKey].status = true
        }else if(this.NOTES[noteKey].status == true){
            //console.log('note removed')
            this.NOTES[noteKey].status = false
        }

        this.props.onClick(noteKey, this.NOTES[noteKey].status);
        
    }

    renderActiveNotes = () => {
        //console.log(this.props)
        //gets context of canvas
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        this.props.noteData.map(note => {
            //console.log(note)
            let noteVal = NoteList(note.pitch[0])
            let yPos = ConvertToCoords(noteVal, 'pitch')
            //console.log(yPos)
            let beatVal = this.convertBeatAndMeasure(note.beat[0], note.beat[1], this.props.songData.notesPerMeasure)
            let xPos = ConvertToCoords(beatVal, 'time')
            //console.log(xPos)

            const rect = canvas.getBoundingClientRect();
            let object = {};
            object.x = (rect.left);
            object.y =  (rect.top);
            //filled note color
            ctx.fillStyle = "#FFFF33";

            this.NOTES[`${yPos} ${xPos}`] = {status: true, width: 43, height: 30 }
            //console.log('making')
            ctx.fillRect(xPos,yPos,43,30)
            //console.log('end')
        })
    }

     convertBeatAndMeasure = (measure, beat, beatsPer) => {
        console.log(measure)
        let num = (measure * beatsPer) + beat
        //console.log(ConvertToCoords(num, 'time'))
        return num
     }

    generateRow = (length,rowNum) => {
        let totalLength = length * this.props.songData.measures
        let positionY = ((rowNum) * 35) + 16
        //gets context of canvas
        const canvas = this.refs.canvas
        const ctx = canvas.getContext("2d")
        
        //generates individual notes on row 
        for(let i = 0; i < totalLength; i++){
            let oldNotes = this.NOTES
            //should get the position data
            const rect = canvas.getBoundingClientRect();
            let object = {};
            object.x = (rect.left);
            object.y =  (rect.top);
            let positionX = (i * 45) + 15
            //filled note color
            ctx.fillStyle = "#DDDD55";
            //blank note color
            ctx.fillStyle = "#000000";

            this.NOTES[`${positionY} ${positionX}`] = {status: false, width: 43, height: 30 }

            
            
            
            ctx.fillRect(positionX,positionY,43,30)
        }
        //console.log(this.NOTES)
    }

    render(){
        return(
            <canvas ref="canvas" width={750} height={450} />
        )
    }
}

/*
    tutorial_canvas.style.background = "#000000"

    const rect = tutorial_canvas.getBoundingClientRect();
    tutorial_canvas.addEventListener('click', e => {
        let sun = {}
        sun.x = (e.clientX - rect.left);
        sun.y =  (e.clientY - rect.top);
        for(let h = 0; h<cards.length; h++){
            if(squarecircle(cards[h], sun)){
                wordgiven = wordgiven+cards[h].letter
                cards.splice(h,1)
                eaten.innerText = wordgiven
            }
        }
      })
*/