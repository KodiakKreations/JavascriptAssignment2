const money = [
  { level: '1', amount: '100' },
  { level: '2', amount: '200' },
  { level: '3', amount: '300' },
  { level: '4', amount: '500' },
  { level: '5', amount: '1,000' },
  { level: '6', amount: '2,000' },
  { level: '7', amount: '4,000' },
  { level: '8', amount: '8,000' },
  { level: '9', amount: '16,000' },
  { level: '10', amount: '25,000' },
  { level: '11', amount: '50,000' },
  { level: '12', amount: '100,000' },
  { level: '13', amount: '250,000' },
  { level: '14', amount: '500,000' },
  { level: '15', amount: '1,000,000' }
];

const musicRound1 = new Audio('./sounds/Round1.ogg');
musicRound1.loop = true;
musicRound1.volume = 0.1;
musicRound1.play();

const host = new SpeechSynthesisUtterance();
host.lang = 'en-US';
host.rate = 1.5;
host.voice = speechSynthesis.getVoices()[4];

const app = new Vue({
  el:"#app",
	mounted() {
		this.getTriviaQuestions();

		// setup keypress detection
		window.addEventListener('keydown', this.clickButton);

	},
  data: {
    message: "Hello World!",
	  
    items:money,
	  questions: [],
	  index: 0,
		shuffledAnswers: [],
		host,
  },
  watch: {
	  index() {
		  this.shuffle();
		  console.log(this.questionCurrent().correct_answer)
	  }
  },
  methods: {
	  clickButton(e) {
		  // if user presses a b c or d then act as if they clicked the corresponding answer
		  const key = document.querySelector(`button[data-key="${e.keyCode}"]`);
		  
		  if(!key) return;
		  key.click();
	  },
	  isAnswerCorrect(e) {
		  ({ index } = e.target.dataset);
		  
		  const selectedAnswer = this.shuffledAnswers[index];
		  
		  if (selectedAnswer === this.questionCurrent().correct_answer) {
				this.index += 1;
				this.hostSpeaksQs();
		  } else {
			  console.log('wrong');
		  }
	  },
	  questionCurrent() {
		  return this.questions[this.index];
	  },
	  answer(idx) {
		  return this.shuffledAnswers[idx];
	  },
	  shuffle() {
		  
		  const tempArray = [this.questionCurrent().correct_answer, ...this.questionCurrent().incorrect_answers];
		  
		  this.shuffledAnswers = _.shuffle(tempArray);
	  },
	  getTriviaQuestions: async function() {
		  const response = await fetch("https://opentdb.com/api.php?amount=15&type=multiple");
		  const data = await response.json();
		  this.questions = data.results;
		this.shuffle();
		this.hostSpeaksQs();

		},
		
		hostSpeaksQs() {
			if (this.host) {

				speechSynthesis.cancel();

				this.host.text = `${this.questionCurrent().question}, A, ${this.shuffledAnswers[0]}, B, ${this.shuffledAnswers[1]}, C, ${this.shuffledAnswers[2]}, D, ${this.shuffledAnswers[3]}}`;

				speechSynthesis.speak(this.host);
			
			}

		}
	  
  }
    
 

})

// window.speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;

// const recognition = new SpeechRecognition();
// recognition.interimResults = false;
// recognition.lang = 'en-US';
