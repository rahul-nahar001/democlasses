sessionStorage.currentQuestion = 0;
sessionStorage.answerAttempted = 0;
var answerUnattempted = 0, answerCorrect = 0, answerIncorrect = 0;
var deactivateTimer;

$(document).ready(function(){
	displayQuestionNumber();
    loadQuestions();
});


function loadQuestions(){
    var cQ = Number(sessionStorage.currentQuestion);
	$("#ndTestPageQuestionNumber").html(cQ+1);
	$("#ndTestPageQuestion").html(questionsArray[cQ].question);
	$("#ndTestPageOptionOne").html(questionsArray[cQ].optionOne);
	$("#ndTestPageOptionTwo").html(questionsArray[cQ].optionTwo);
	$("#ndTestPageOptionThree").html(questionsArray[cQ].optionThree);
	$("#ndTestPageOptionFour").html(questionsArray[cQ].optionFour);
	if(sessionStorage.getItem("userResponseId"+cQ)){
		var uRId = sessionStorage.getItem("userResponseId"+cQ);
		$("#"+uRId).addClass("nd-alert-success");
	}
    setSidebarHeight();
}

function setSidebarHeight(){
    var rightHeight = $('.nd-question-container').height();
    $('.nd-sidebar-container').css('height',(rightHeight-72));
}

function SaveNext(){
	var questionLength = questionsArray.length;
	var cQ = Number(sessionStorage.currentQuestion);
	if(cQ < questionLength-1){
		sessionStorage.currentQuestion = cQ+1;
	}
	else{
		sessionStorage.currentQuestion = 0;
	}
	$('.nd-alert').removeClass('nd-alert-success');
	loadQuestions();
}

function validateAnswer(a){
	var cQ = Number(sessionStorage.currentQuestion);
	var userResponseId = $(a).attr("id");
	var userResponse = $(a).find(".ndTestPageOption").html();
	$('.nd-alert').removeClass('nd-alert-success');
	$(a).addClass('nd-alert-success');
	sessionStorage.setItem("userResponse"+cQ,userResponse);
	sessionStorage.setItem("userResponseId"+cQ,userResponseId);
    $(".nd-sidebar-qn-span-"+(cQ+1)).addClass('attempted');
    sessionStorage.setItem("answerAttempted"+cQ,"Yes");
}

function clearResponse(){
	var cQ = Number(sessionStorage.currentQuestion);
	$('.nd-alert').removeClass('nd-alert-success');
	sessionStorage.removeItem("userResponse"+cQ);
	sessionStorage.removeItem("userResponseId"+cQ);
	$('.nd-sidebar-qn-span-'+(cQ+1)).removeClass('attempted');
	sessionStorage.removeItem("answerAttempted"+cQ);
}

function attemptedAnswerCount(){
	var a = 0;
	for(i=0;i<questionsArray.length;i++){
		if(sessionStorage.getItem("answerAttempted"+i)){
			a+=1;
		}
	}
	return a;
}

function correctAnswerCount(n){
	var count = 0;
	for(i=0;i<questionsArray.length;i++){
		if(sessionStorage.getItem("userResponse"+i)){
			if(sessionStorage.getItem("userResponse"+i) == questionsArray[i].correctAnswer){
				count+=1;
			}
		}
	}
    count=count*n;
    $('.nd-final-score').html(count);
    $('.nd-full-score').html(" /"+(questionsArray.length*2));
	$('.nd-test-main-container').css('display','none');
	$('.nd-test-submit-btn-2-container').css('display','none');
	populateFinalScore(count,n);
	deactivateTimer = true;
    $('.nd-score-main-container').css('display','block');
    sessionStorage.clear();
}

function displayQuestionNumber(){
    var html = "";
    for(i=0;i<questionsArray.length;i++){
        html += "<span class='nd-sidebar-qn-span-"+(i+1);
        if(sessionStorage.getItem("userResponseId"+i)){
			html +=" attempted";
		}
        html+="' onclick='displayQuestionFromSidebar(this)'>"+(i+1)+"</span>";
    }
    
    $(".nd-sidebar-question-number").html(html);
}

function displayQuestionFromSidebar(me){
    var cQ = Number(sessionStorage.currentQuestion);
    $('.nd-alert').removeClass('nd-alert-success');
    var num = $(me).html() - 1;
    sessionStorage.currentQuestion = num;
    loadQuestions();
}

function displayQuestionFromTopMenu(n){
    $('.nd-alert').removeClass('nd-alert-success');
    sessionStorage.currentQuestion = n-1;
    loadQuestions();
}

function startTimer(duration, display, n, start) {
    var timer = duration, minutes, seconds;
    var x = setInterval(function () {
    	if(deactivateTimer){
    		clearInterval(x);
    	}
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.text(minutes + ":" + seconds);

        if (--timer < 0) {
            alert("Buzzzzzz..!! Time Over. \nYour Test will be Auto Submitted.");
            clearInterval(x);
            correctAnswerCount(n);
        }
    }, 1000);
}

function populateFinalScore(count,n){
	var answerAttempted = attemptedAnswerCount();
	var attemptedPercent = (answerAttempted*100)/questionsArray.length;
	var unattemptedPercent = ((questionsArray.length - answerAttempted)*100)/questionsArray.length;
	var correctPercent = ((count/n)*100)/questionsArray.length;
	var incorrectPercent = ((answerAttempted - (count/n))*100)/questionsArray.length;
	$('.nd-final-score-attempted').html(answerAttempted);
	$('.nd-final-score-unattempted').html(questionsArray.length - answerAttempted);
	$('.nd-final-score-correct').html(count/n);
	$('.nd-final-score-incorrect').html(answerAttempted - (count/n));

	$('.nd-final-score-attempted-p').data('easyPieChart').update(0);
    $('.nd-final-score-attempted-p').data('easyPieChart').update(attemptedPercent);
	$('.nd-final-score-unattempted-p').data('easyPieChart').update(0);
	$('.nd-final-score-unattempted-p').data('easyPieChart').update(unattemptedPercent);
	$('.nd-final-score-correct-p').data('easyPieChart').update(0);
	$('.nd-final-score-correct-p').data('easyPieChart').update(correctPercent);
	$('.nd-final-score-incorrect-p').data('easyPieChart').update(0);
	$('.nd-final-score-incorrect-p').data('easyPieChart').update(incorrectPercent);

	

	$('.nd-final-score-attempted-p .percent').html(attemptedPercent);
	$('.nd-final-score-unattempted-p .percent').html(unattemptedPercent);
	$('.nd-final-score-correct-p .percent').html(correctPercent);
	$('.nd-final-score-incorrect-p .percent').html(incorrectPercent);

}