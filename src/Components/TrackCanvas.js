import React from 'react';
import './main_style.css'
import NoteList from './NoteList.js'
import {BrowserRouter as useParams} from "react-router-dom";
import ConvertToCoords from './ConvertToCoords.js'
import { get } from 'https';
//import generate from '@babel/generator';

export default class TrackCanvas extends React.Component{

    NOTES = {}
    PLAYING = false

    PositionY = 16;
    PositionX = 10;

    componentDidMount = () => {
        this.renderBoard()
    }

    getId = () => {
        let urlParts = window.location.href.split('/')
        let songId = urlParts[urlParts.length - 1]
        return songId;
    }

    renderBoard = () => {
        let id = this.getId()
        let selectedSong = {}
        this.props.songData.map(song => {
            if(song.id == id){
                selectedSong.id = song.id
                selectedSong.measures = song.measures
                selectedSong.notesPerMeasure = song.notesPerMeasure
                selectedSong.bpm = song.bpm
                selectedSong.key = song.key
                selectedSong.noteData = song.noteData
            }
        })
        this.NOTES = {};
        const canvas = this.refs.canvas;
        canvas.style.background = "#4B4B55";
        const rect = canvas.getBoundingClientRect();
        canvas.addEventListener('click', e => {
            let object = {};
            object.x = (e.clientX - rect.left);
            object.y =  (e.clientY - rect.top);
            //console.log(object.x);
            //console.log(object.y);
            this.checkCollision(object.x, object.y, selectedSong.id);
            
        })
        
        for(let i = 0; i < 12; i++){
            
            this.generateRow(selectedSong, selectedSong.notesPerMeasure,i)
            if (i + 1 == 12){
                this.renderActiveNotes(selectedSong)
            }
        }
    }

    checkCollision = (clickX, clickY, songId, lineTouch = false) => {
        let noteCollection = this.NOTES
        //console.log(songId)
        if(lineTouch == true){
            for (var note in noteCollection) {
                console.log(noteCollection[note])
                let coords = note.split(' ')
                //console.log(coords[1] + noteCollection[note].width)
                if( (clickX > parseInt(coords[1])) && (clickX < (parseInt(coords[1]) + noteCollection[note].width)) ){
                    if(noteCollection[note].status == true){
                        this.props.noteHit(note, songId)
                    }
                }
            }
        }else{
            for (var note in noteCollection) {
                //console.log(noteCollection[note])
                let coords = note.split(' ')
                //console.log(coords[1] + noteCollection[note].width)
                if( (clickX > parseInt(coords[1])) && (clickX < (parseInt(coords[1]) + noteCollection[note].width)) && (clickY > parseInt(coords[0])) && (clickY < (parseInt(coords[0]) + noteCollection[note].height)) ){
                    if(noteCollection[note].status == false){
                        this.noteClicked(note, songId)
                    }else if(noteCollection[note].status == true){
                        this.noteClicked(note, songId)
                    }
                }
            }
        }    
    }

    noteClicked = (noteKey, songId) => {
        //console.log(songId)
        if(this.NOTES[noteKey].status == false){
            //console.log('note placed')
            this.NOTES[noteKey].status = true
        }else if(this.NOTES[noteKey].status == true){
            //console.log('note removed')
            this.NOTES[noteKey].status = false
        }

        this.props.onClick(noteKey, this.NOTES[noteKey].status, songId);
        
    }

    renderActiveNotes = (song) => {
        //gets context of canvas
        //console.log(song.noteData)
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        if(song.noteData){
            song.noteData.map(note => {
                //console.log(note)
                let noteVal = NoteList(note.pitch[0]);
                let yPos = ConvertToCoords(noteVal, 'pitch');
                //console.log(yPos)
                let beatVal = this.convertBeatAndMeasure(note.beat[0], note.beat[1], song.notesPerMeasure);
                let xPos = ConvertToCoords(beatVal, 'time');
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
    }

     convertBeatAndMeasure = (measure, beat, beatsPer) => {
        //console.log(measure)
        let num = (measure * beatsPer) + beat
        //console.log(ConvertToCoords(num, 'time'))
        return num
     }

    generateRow = (song,length,rowNum) => {
        let totalLength = length * song.measures;
        let positionY = ((rowNum) * 35) + 16;
        //gets context of canvas
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        
        //generates individual notes on row 
        for(let i = 0; i < totalLength; i++){
            let oldNotes = this.NOTES;
            //should get the position data
            const rect = canvas.getBoundingClientRect();
            let positionX = (i * 45) + 15;
            //filled note color
            ctx.fillStyle = "#DDDD55";
            //blank note color
            ctx.fillStyle = "#000000";

            this.NOTES[`${positionY} ${positionX}`] = {status: false, width: 43, height: 30 };
            ctx.fillRect(positionX,positionY,43,30);
        }
        //console.log(this.NOTES)
    }

    draw = () => {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.renderBoard();
        this.drawScanLine();
       
    }

    drawScanLine = () => {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
         //console.log(this.PLAYING)
         if(this.PLAYING == true){
            //should get the position data
            const rect = canvas.getBoundingClientRect();
            let dX = 43
            this.PositionX += dX
            //filled note color
            ctx.fillStyle = "#FF0099";
            //console.log(this.PositionX)
            ctx.fillRect(this.PositionX,this.PositionY,4,416)

            let id = this.getId()
            this.checkCollision(this.PositionX,this.PositionY, id, true)
        }else{
            console.log('not drawing')
        }
    }

    handlePlay = () => {
        //console.log('bop')
        
        if(this.PLAYING == false){
            this.PLAYING = true
            setInterval(this.draw, 200);
        }else{
            //this.PLAYING = false
            console.log('not gonna')
        }
    }

    render(){
        return(
            <div>
                <canvas ref="canvas" width={750} height={450} />
                <br />
                <button onClick={this.handlePlay}>PLAY</button>
            </div>
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