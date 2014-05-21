var pitches = {};
//pitch dictionary via numerical index. not zero based. I might regret that.
pitches['_1'] = ['C', 'B#'];
pitches['_2'] = ['C#', 'Db'];
pitches['_3'] = ['D', 'C*'];
pitches['_4'] = ['D#', 'Eb'];
pitches['_5'] = ['E', 'Fb'];
pitches['_6'] = ['F', 'E#'];
pitches['_7'] = ['F#', 'Gb'];
pitches['_8'] = ['G', 'F*'];
pitches['_9'] = ['G#', 'Ab'];
pitches['_10'] = ['A', 'G*'];
pitches['_11'] = ['A#', 'Bb'];
pitches['_12'] = ['B', 'Cb'];
    // //all the pitches?
    // pitches['c'] = pitches._1[0];
    // pitches['cSharp'] = pitches._2[0];
    // pitches['d'] = pitches._3[0];
    // pitches['dSharp'] = pitches._4[0];
    // pitches['e'] = pitches._5[0];
    // pitches['f'] = pitches._6[0];
    // pitches['fSharp'] = pitches._7[0];
    // pitches['g'] = pitches._8[0];
    // pitches['gSharp'] = pitches._9[0];
    // pitches['a'] = pitches._10[0];
    // pitches['aSharp'] = pitches._11[0];
    // pitches['b'] = pitches._12[0];
    // //and now for flats and weird doublesharps
    // pitches['bSharp'] = pitches._1[1];
    // pitches['dFlat'] = pitches._2[1];
    // pitches['cDoubleSharp'] = pitches._3[1];
    // pitches['eFlat'] = pitches._4[1];
    // pitches['fFlat'] = pitches._5[1];
    // pitches['eSharp'] = pitches._6[1];
    // pitches['gFlat'] = pitches._7[1];
    // pitches['fDoubleSharp'] = pitches._8[1];
    // pitches['aFlat'] = pitches._9[1];
    // pitches['gDoubleSharp'] = pitches._10[1];
    // pitches['bFlat'] = pitches._11[1];
    // pitches['cFlat'] = pitches._12[1];

//search through the pitches object for the given chord, return its "index" in the chord dictionary
function findChordByName(chord){
  var counter = 1;
  for (counter; counter <= 12; counter++){
    for(var i=0; i<pitches['_' + counter].length; i++){
      if (chord === pitches['_' + counter][i]){
        return counter;
      }
    }
  }
}

//hard-coded values because the semitone pattern won't ever change
//only call from getDiatonicScale for now; it can't wraparound for intervals larger than 2
function advanceIndex(index, interval){
  console.log("advanceIndex hit")
  if(index === 11){
    if (interval === 2)
      return 1;
    else
      return 13;
  }
  else if (index === 12){
    if (interval === 2)
      return 2;
    else
      return 1;
  }
  else
    return index + interval;
}

//given a key, output an object containing the major scale for that key
function getDiatonicScale(key){
  //use interval pattern to derive scale: WWhWWWh
  var pitchIndex = findChordByName(key);
  var scale = {};

  for(var i=1; i<8; i++){
    scale['_' + i] = pitches['_' + pitchIndex];
    if (i === 3){
      pitchIndex = advanceIndex(pitchIndex, 1);
    }
    else{
      pitchIndex = advanceIndex(pitchIndex, 2);
    }
  }
  return scale;
}

//given a chord name, transpose it from original key to destination key.
function transposeChord(chord, original, destination){
  var chordIndex = findChordByName(chord);
  var interval = original - destination;
  var invertedInterval = interval + 12;
  var result = pitches['_' + (chordIndex - interval)];
  
  if (!result){
    result = pitches['_' + (chordIndex - invertedInterval)];
  }
  
  return "[" + result[0] + "]";
}

function findNextToken(token, index, text){
  return text.indexOf(token, index);
}

function processText(text, originalKey, destinationKey){
  var result = '';
  var chordLine = '';
  var lyricLine = '';

  for (var i=0; i<text.length; i++){
    if (text[i] == '['){
      for(var j=0; j<i; j++){
        chordLine += '+'
      }

      var endBracket = findNextToken(']', i, text);
      chordLine += transposeChord(text.slice(i+1, endBracket), originalKey, destinationKey);
      i = endBracket;
    }
    else
      lyricLine += text[i];

  }

  result = chordLine + '<br>' + lyricLine;
  console.log(result);
  return result;
}

$(document).ready(function(){
    $('.processText').click(function(){

    $('div.destination').text(processText($('.source').text(), $('#originalKey').val(), $('#destinationKey').val()));
  });
});

