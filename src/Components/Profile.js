import React from 'react';
import './main_style.css'
import NoteList from './NoteList.js'
import ConvertToCoords from './ConvertToCoords.js'
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
//import generate from '@babel/generator';

export default class Profile extends React.Component{
    handleClick = () => {
        this.props.editSong('create')
    }

    renderSongs = () => {
        //console.log(this.props.songData)
        let songList = []
        this.props.songData.map(song => {
            let id = song.id
            //console.log(id)
            let single = this.renderSingle(id)
            songList.push(single)
        })
        return(songList)
    }

    renderSingle = (id) => {
        let songId = id
        //console.log(id)
        return(<div key={songId}>
            <h3>{this.props.songData.id}</h3> <Link to={`/songs/${id}`}>song {`${songId}`}</Link>
        </div>)
    }

    render(){
        console.log('loadin a profile')
        return(
            <div>
                {this.renderSongs()}
                <button onClick={this.handleClick}>New Song</button>
            </div>
        )
    }
}
