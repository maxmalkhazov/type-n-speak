import "./styles/styles.scss";

const synth = speechSynthesis;

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const header = document.querySelector('.header');
let textBox1 = document.querySelector('#textBox1');
let textBox2 = document.querySelector('#textBox2');

// Animation
const animate1 = [
    { fontSize: '1rem'},
    { fontSize: '5rem', offset: 0.3},
    { fontSize: '.25rem', offset: 0.8},
    { fontSize: '1rem'}
];

const animateDur = {
	duration: 3000,
	iterations: Infinity
};

let voices = [];

const getVoices = async () => {
	voices = await synth.getVoices();
	
	if (!voiceSelect.hasChildNodes()) {
		voices.forEach((voice) => {
			// Create option element for each voice
			const option = document.createElement('option');
			// Fill each option with voice and language
			option.textContent = `${voice.name} - ${voice.lang}`
			
			// Set option attributes
			option.setAttribute('data-lang', voice.lang);
			option.setAttribute('data-name', voice.name);
			
			// Append option to select menu
			voiceSelect.appendChild(option);
		});
	}
};

if (synth.onvoiceschanged !== undefined) {
	synth.onvoiceschanged = getVoices;
}

const getSpeech = () => {
	// Check if currently speaking
	if (synth.speaking) {
		console.error('Speech process is currently running.');
		return;
	}
	
	// Check if text input is populated
	if (textInput.value !== '') {
		
		// Add background animation
		header.style.background = 'url(https://cdn.dribbble.com/users/341264/screenshots/2203511/wave.gif)';
		header.style.backgroundSize = '100% 100%';
		header.style.backgroundRepeat = 'repeat-x';
		
		// Get speak text
		const speakText = new SpeechSynthesisUtterance(textInput.value);
		textBox1.innerText = textInput.value;
		textBox1.animate(animate1, animateDur);
		textBox2.innerText = textInput.value.split('').reverse().join('');
		textBox2.animate(animate1, animateDur);
		
		// Speak end
		speakText.onend = () => {
			console.log('Speech completed');
			header.style.background = '#141414';
			textBox1.innerText = '';
			textBox2.innerText = '';
		}
		
		// Speak error
		speakText.onerror = () => {
			console.error('Something went wrong...')
		}
		
		// Selected voice
		const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');
		
		// Loop through voices
		voices.forEach((voice) => {
			if (voice.name === selectedVoice) {
				speakText.voice = voice;
			}
		});
		
		// Set pitch and rate
		speakText.rate = rate.value;
		speakText.pitch = pitch.value;
		
		// Init speak
		synth.speak(speakText);
	}
};


// Event Listeners

// Text form submit
textForm.addEventListener('submit', (e) => {
	e.preventDefault();
	getSpeech();
	textInput.blur();
});

// Rate value change
rate.addEventListener('change', (e) => {
	rateValue.textContent = rate.value;
});

// Pitch value change
pitch.addEventListener('change', (e) => {
	pitchValue.textContent = pitch.value;
});

// Voice select change
voiceSelect.addEventListener('change', getSpeech);


