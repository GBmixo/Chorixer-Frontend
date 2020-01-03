const NoteList = (number) => {
    let num = number
    
    const notes = {
            4: 'A',
            3: 'A#',
            2: 'B',
            1: 'B#',

            12: 'C#',
            11: 'D',
            10: 'D#',
            9: 'E',
            8: 'F',
            7: 'F#',
            6: 'G',
            5: 'G#',
            'A': 4,
            'A#': 3,
            'B': 2,
            'B#': 1,
            
            'C#': 12,
            'D': 11,
            'D#': 10,
            'E': 9,
            'F': 8,
            'F#': 7,
            'G': 6,
            'G#': 5,
    }
    return(notes[num])

}



export default NoteList;

