// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];
const NUM_CATEGORIES= 6;
const NUM_CLUES_PER_CAT = 5;


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  let response = await axios.get(
    'https://jservice.io/api/categories?count=100'
  );

  let allIds = response.data.map(function(result) {
    return result.id;
  })

  let catIds = [];

  for (let x = 0; x < NUM_CATEGORIES; x++) {
    catIds.push(allIds[Math.floor(Math.random() * 100)]);
  }
  
  return catIds;
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
  let url = `https://jservice.io/api/category?id=${catId}`;
  let response = await axios.get(url);
  let title = response.data.title;

  let clues = [];

  for (let y= 0; y < NUM_CLUES_PER_CAT; y++) {
    clues.push(response.data.clues[Math.floor(Math.random() * response.data.clues.length)]);
  }

  let clueArray = clues.map(result=> ({
    'question':result.question,
    'answer': result.answer,
    showing: null
  }));
  
  categories.push({'title':title,'clues':clueArray});
  return categories;
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

  
 
async function fillTable() {
  
  let $tr = $('<tr>');

  for (let x = 0; x < NUM_CATEGORIES; x++) {
    let title = categories[x].title
   
    $tr.append($(`<th>${title}</th>`));
  }
  $('#jeopardy thead').append($tr);

  for (let y = 0; y < NUM_CLUES_PER_CAT; y++) {
    let $tr = $('<tr>');

    for (let x = 0; x < NUM_CATEGORIES; x++) {
      id = `${x}-${y}`;
      $tr.append($('<td>?</td>').attr('id',id));
    }
    $('#jeopardy tbody').append($tr); 
  }
}
        
    

   
    

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
  let id = evt.target.id;
  let [x,y] = id.split("-");
    
  // if ($(`#${x}-${y}`).text() === '?') {
  //   $(`#${x}-${y}`).text(categories[x].clues[y].question);
  // }
  // else if ($(`#${x}-${y}`).text() === categories[x].clues[y].question) {
  //   $(`#${x}-${y}`).text(categories[x].clues[y].answer)
  // }
  // else {
  //   return;
  // }

  if (!categories[x].clues[y].showing) {
    $(`#${x}-${y}`).text(categories[x].clues[y].question);
    categories[x].clues[y].showing = 'question';
  }
  else if (categories[x].clues[y].showing === 'question') {
    $(`#${x}-${y}`).text(categories[x].clues[y].answer);
    categories[x].clues[y].showing = 'answer';
  }
  else {
    return 
  }
}


/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
  $('#spinner').show();
  $('#jeopardy thead').empty();
  $('#jeopardy tbody').empty();
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
  $('#spinner').hide();
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  showLoadingView();

  let catIds = await getCategoryIds();

  categories = [];
    
  for (let catId of catIds) {
      await getCategory(catId);
  }

  hideLoadingView();

  fillTable();
}


/** On click of start / restart button, set up game. */

// TODO
$('#start').on('click', setupAndStart);

/** On page load, add event handler for clicking clues */

// TODO

addEventListener('DOMContentLoaded',function(){
  setupAndStart();
  $('#jeopardy').on('click','td',handleClick);
})

