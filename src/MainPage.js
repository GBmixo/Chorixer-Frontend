import React from 'react';
import Tone from 'tone';
import './Components/main_style.css'
import TrackCanvas from './Components/TrackCanvas.js'
import Profile from './Components/Profile.js'
import ConvertToValues from './Components/ConvertToValues.js'
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import NoteList from './Components/NoteList';
import { timeout } from 'q';



class MainPage extends React.Component{
    READY = false

    state = {
        userStatus: null,
        //object has a pitch array with note and octave
        //also has a time array with measure and beat
        noteData: [],
        songData: [
            {
                id: 333,
                //object has a pitch array with note and octave
                //also has a time array with measure and beat
                noteData: [],
                //number of measures
                measures: 1,
                //number of notes in a measure
                notesPerMeasure: 16,
                //the bpm of the song
                speed: 200,
                //key of song
                key: 'C'
            }
        ],
        loadedAll: false,
        updated: false
    }

    componentDidMount = () => {
        this.fetchSongs()
    }

    fetchSongs = () => {
        const songUrl = 'http://localhost:3000/songs';

        fetch(songUrl)
        .then(resp => resp.json())
        .then(json => {
            let oldState = this.state
            json.map(song => {
                //this.fetchNotes(song.id)
                oldState.loadedAll = true
                oldState.songData.push({
                    id: song.id,
                    noteData: [],
                    measures: song.measures,
                    notesPerMeasure: 16,
                    key: song.key
                })
                this.setState(oldState)
            })
        }) 
    }
    fetchNotes = () => {
        const noteUrl = 'http://localhost:3000/notes';

        fetch(noteUrl)
        .then(resp => resp.json())
        .then(json => {
            //console.log(json)
        }) 
    }

    renderPage = () => {
        return(
            <div>
                <TrackCanvas userStatus={this.state.userStatus} editSong={this.editSong} onClick={this.handleClick} noteHit={this.soundTrigger} gridLength={16} noteData={this.state.noteData} songData={this.state.songData} /><br />
            </div>
            
        )
    }

    editSong = (action, songInfo = null) => {
        const songUrl = 'http://localhost:3000/songs';
        if(action == 'create'){
            fetch(songUrl, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    user_id: 1,
                    bpm: 200,
                    speed: 200,
                    key: 'C',
                    measures: 1,
                })
            })
            
        }else if(action == 'update'){
            fetch(songUrl, {
                method: "PATCH", 
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    bpm: songInfo.bpm,
                    speed: songInfo.speed,
                    key: songInfo.key,
                })
            })
        }else if(action == 'delete'){
            fetch(`http://localhost:3000/songs/${songInfo.id}`, {
                method: "DELETE", 
            })
        }
    }

    editNotes = (action, noteInfo = null) => {
        const noteUrl = 'http://localhost:3000/notes';
        if(action == 'create'){
            fetch(noteUrl, {
                method: "POST", 
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    
                })
            })
        }else if(action == 'delete'){
            fetch(`http://localhost:3000/notes/${noteInfo.id}`, {
                method: "DELETE", 
            })
        }
    }

    renderProfile = () => {
        console.log('rendering')
        let thing = this.state.songData
        return(
            <div>
                <Profile editSong={this.editSong} userStatus={this.state.userStatus} songData={thing} />
            </div>
        )
    }

    handleClick = (noteKey, context, songId) => {
        //console.log(songId)
        let synth = new Tone.Synth().toMaster();

        //unrender and wait until state is updated
        let oldState = this.state;
        //let oldNoteCount = oldState.noteData.length
        oldState.loadedAll = false;
        this.setState(oldState);

        let selectedSong = {}
        let songIndex = 0
        oldState.songData.map((song, index) => {
            if(song.id == songId){
                selectedSong.id = song.id
                selectedSong.measures = song.measures
                selectedSong.notesPerMeasure = song.notesPerMeasure
                selectedSong.bpm = song.bpm
                selectedSong.key = song.key
                selectedSong.noteData = song.noteData
                songIndex = index
            }
        })

        if(context == true){
            console.log('adding')
            let vals = this.buildValues(noteKey, oldState, true, songIndex);
            console.log(vals)
            if(vals){
                //console.log(oldState.noteData)
            synth.triggerAttackRelease(vals.noteData[vals.noteData.length - 1].pitch[0] + "4", "8n")
                oldState.loadedAll = true;
                this.setState(oldState)
            }
        }else if(context == false){
            console.log('removing')
            let notes = oldState.songData[songIndex].noteData
            notes.map((note, index) => {
                
                let vals = this.buildValues(noteKey, oldState, false, songIndex)
                console.log(vals.pitch)
                if((vals.pitch[1] == note.pitch[1]) && (vals.beat[0] == note.beat[0])){    
                    //console.log('octave and measure are equal')
                    if((vals.pitch[0] == note.pitch[0]) && (vals.beat[1] == note.beat[1])){
                        //console.log(index)
                        //console.log('note and beat are equal')
                        console.log('the note is ' + note.pitch[0])
                        console.log(`removing ${oldState.noteData[index].pitch[0]}`)
                        oldState.songData[songIndex].noteData.splice(index, 1)
                        //console.log(oldState.noteData)
                        oldState.loadedAll = true
                        this.setState(oldState)
                    }
                }
            })
        }
        /*
        synth.triggerAttackRelease("A4", "8n")
        setTimeout(() => {synth.triggerAttackRelease("B3", "8n")}, 100)
        setTimeout(() => {synth.triggerAttackRelease("A3", "8n")}, 200)
        //setTimeout(() => {synth.triggerAttackRelease(this.state.noteData[0].pitch[0] + this.state.noteData[0].pitch[1], "8n")}, 350)
        */
    }

    buildValues = (noteKey, oldState, context, songIndex) => {
        
        let coords = noteKey.split(' ');
        let pitch = ConvertToValues(coords[0], 'yAxis');
        let pitchVal = NoteList(pitch);

        let time = ConvertToValues(coords[1], 'xAxis');
        //console.log(time)
        let beat = time % oldState.songData[songIndex].notesPerMeasure;
        let measure = (time - beat)/oldState.songData[songIndex].notesPerMeasure;

        if(context == true){
            //console.log('updating state')
            oldState.songData[songIndex].noteData.push({
                pitch: [pitchVal, 4],
                beat: [measure, beat]
            })
            oldState.noteData.push({
                pitch: [pitchVal, 4],
                beat: [measure, beat]
            })
        }else if(context == false){
            //console.log('not updating state')
            return{
                pitch: [pitchVal, 4],
                beat: [measure, beat]
            }
        }

        //console.log(oldState)
        return(oldState)

    }

    soundTrigger = (note,songId) => {
        let oldState = this.state;
        let songIndex = 0
        oldState.songData.map((song, index) => {
            if(song.id == songId){
                songIndex = index
            }
        })
        let synth = new Tone.Synth().toMaster();
        let vals = this.buildValues(note, oldState, true, songIndex);
        console.log(vals.songData.noteData)
        synth.triggerAttackRelease(vals.noteData[vals.noteData.length - 1].pitch[0] + "4", "16n")
    }

    
    render(){
            return (
                <Router>
                    <div>
                        <div>
                            <Link to="/">Profile</Link>
                        </div>
                        <Switch>
                            <Route path='/songs/:id'>
                                {this.state.loadedAll ? this.renderPage() : null}
                            </Route>
                            <Route path='/' exact>
                                {this.state.loadedAll ? this.renderProfile() : null}
                            </Route>
                        </Switch>
                        
                    </div>
                </Router>
               
            )
    }

}

export default MainPage;