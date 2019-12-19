import React from 'react';
import Tone from 'tone';
import './Components/main_style.css'
import TrackCanvas from './Components/TrackCanvas.js'
import ConvertToValues from './Components/ConvertToValues.js'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import NoteList from './Components/NoteList';
import { timeout } from 'q';
//import { timeout } from 'q';



class MainPage extends React.Component{
    READY = false

    state = {
        noteData: [],
        songData: {
            //number of measures
            measures: 1,
            //number of notes in a measure
            notesPerMeasure: 16,
            //the bpm of the song
            speed: 200

        },
        loadedAll: true,
        updated: false
    }

    renderPage = () => {
        return(
            <div>
                <TrackCanvas onClick={this.handleClick} gridLength={16} noteData={this.state.noteData} songData={this.state.songData} /><br />
                <button onClick={this.handleClick}>SOUND HERE</button>
            </div>
            
        )
    }

    handleClick = (noteKey, context) => {
        let synth = new Tone.Synth().toMaster();

        //unrender and wait until state is updated
        let oldState = this.state;
        let oldNoteCount = oldState.noteData.length
        oldState.loadedAll = false;
        this.setState(oldState);

        if(context == true){
            let vals = this.buildValues(noteKey, oldState);
            
            if(vals){
                synth.triggerAttackRelease(vals.noteData[vals.noteData.length - 1].pitch[0] + "4", "8n")
                oldState.loadedAll = true;
                this.setState(oldState)
            }
        }else if(context == false){

        }
        /*
        synth.triggerAttackRelease("A4", "8n")
        setTimeout(() => {synth.triggerAttackRelease("B3", "8n")}, 100)
        setTimeout(() => {synth.triggerAttackRelease("A3", "8n")}, 200)
        //setTimeout(() => {synth.triggerAttackRelease(this.state.noteData[0].pitch[0] + this.state.noteData[0].pitch[1], "8n")}, 350)
        */
    }

    buildValues = (noteKey, oldState) => {
        let coords = noteKey.split(' ');
        let pitch = ConvertToValues(coords[0], 'yAxis');
        let pitchVal = NoteList(pitch);

        let time = ConvertToValues(coords[1], 'xAxis');
        console.log(time)
        let beat = time % oldState.songData.notesPerMeasure;
        let measure = (time - beat)/this.state.songData.notesPerMeasure;

        oldState.noteData.push({
            pitch: [pitchVal, 4],
            beat: [measure, beat]
        })

        console.log(oldState)
        return(oldState)

    }

    
    render(){
            return (
                <div>
                    ...
                    {this.state.loadedAll ? this.renderPage() : null}
                </div>
                
            )
    }

}

export default MainPage;