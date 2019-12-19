const NoteList = (number) => {
    let num = number
    
    const notes = {
            12: 'A',
            11: 'A#',
            10: 'B',
            9: 'B#',
            8: 'C#',
            7: 'D',
            6: 'D#',
            5: 'E',
            4: 'F',
            3: 'F#',
            2: 'G',
            1: 'G#',
            'A': 12,
            'A#': 11,
            'B': 10,
            'B#': 9,
            'C#': 8,
            'D': 7,
            'D#': 6,
            'E': 5,
            'F': 4,
            'F#': 3,
            'G': 2,
            'G#': 1,
    }
    return(notes[num])

}



export default NoteList;

