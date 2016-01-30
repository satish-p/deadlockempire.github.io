// constructor
var Instruction = function(code) {
	this.code = code;
	this.execute = function() {};
};

var WinningInstruction = function(code) {
	this.code = code;
	this.execute = function() { alert("you win"); };
};

var Level = function(intro, threads) {
	this.intro = intro;
	this.threads = threads;
};

var Thread = function(instructions) {
	this.instructions = instructions;
};

var level = new Level(
	"In this level, you want to finish the second thread.",
	[
		new Thread([
			new Instruction("Hello World!"),
		]),
		new Thread([
			new Instruction("foo"),
			new Instruction("bar"),
			new Instruction("zoo"),
			new WinningInstruction("[REACH THIS TO WIN]")
		]),
		new Thread([
			new Instruction("bar"),
			new WinningInstruction("[OR REACH THIS TO WIN]"),
			new Instruction("bar"),
		])
	]
);

var gameState = {
	threadInstructions: null,
	programCounters: null
};

var updateProgramCounters = function() {
	var threadCount = level.threads.length;
	$('.instruction').each(function() {
		$(this).removeClass('current-instruction');
	});
	// update program counters
	for (var i = 0; i < threadCount; i++) {
		var pc = gameState.programCounters[i];
		$(gameState.threadInstructions[i][pc]).addClass('current-instruction');
	}
};

var stepThread = function(thread) {
	var maxInstructions = level.threads[thread].instructions.length;
	var pc = gameState.programCounters[thread];
	console.log(maxInstructions, gameState.programCounters);
	if (pc + 1 < maxInstructions) {
		level.threads[thread].instructions[pc].execute();
		gameState.programCounters[thread]++;
		updateProgramCounters();
	} else {
		alert("Thread " + thread + " already finished.");
	}
};

var startLevel = function() {
	var mainArea = $('#mainarea');

	var sourcesSection = $('<div class="sources"></div>');
	var threadCount = level.threads.length;
	var width = 100.0 / threadCount;
	var threadInstructions = [];
	for (var i = 0; i < threadCount; i++) {
		var thread = level.threads[i];

		var threadArea = $('<div class="thread">thread ' + i + '</div>');
		var stepButton = $('<button>Step</button>');
		stepButton.data('thread', i);
		stepButton.click(function() {
			stepThread($(this).data('thread'));
		});
		threadArea.append(stepButton);
		var source = $('<div class="code"></div>');

		var instructions = [];
		for (var j = 0; j < thread.instructions.length; j++) {
			var instruction = $('<div class="instruction">' + thread.instructions[j].code + '</div>');
			instructions[j] = instruction;
			source.append(instruction);
		}
		threadInstructions[i] = instructions;

		threadArea.append(source);
		threadArea.css({width: width + "%"});
		sourcesSection.append(threadArea);
	}

	mainArea.append('<div class="clearboth"></div>');
	mainArea.append(sourcesSection);

	var programCounters = [];
	for (var i = 0; i < threadCount; i++) {
		programCounters[i] = 0;
	}
	gameState.programCounters = programCounters;
	gameState.threadInstructions = threadInstructions;

	updateProgramCounters();
};

$(function() {
	$('button#start').click(startLevel);
});
