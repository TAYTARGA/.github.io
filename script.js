let tentativeDecision = null; // null = undecided, true = wash, false = don't wash

// Function to show a specific question and hide others
function showQuestion(questionId) {
    // Hide all questions first
    document.querySelectorAll('.question').forEach(q => {
        q.classList.remove('active');
        // q.style.display = 'none'; // Alternative way to hide
    });
    // Show the target question
    const targetQuestion = document.getElementById(questionId);
    if (targetQuestion) {
        targetQuestion.classList.add('active');
        // targetQuestion.style.display = 'block'; // Alternative way to show
    } else {
        console.error("Question ID not found:", questionId);
    }
     // Ensure result is hidden when showing questions
    document.getElementById('result').classList.add('hidden');
}

// Function to handle the user's answer
function handleAnswer(currentQuestionId, answer) {
    console.log(`Answered ${currentQuestionId} with ${answer}`); // For debugging

    // Hide current question before showing next (optional, handled by showQuestion)
    // document.getElementById(currentQuestionId).classList.remove('active');

    switch (currentQuestionId) {
        case 'q1': // Looks oily?
            if (answer === 'yes') {
                showQuestion('q2'); // Ask about important people
            } else {
                showQuestion('q1a'); // Ask if feels oily
            }
            break;

        case 'q1a': // Feels oily / will get oily?
             if (answer === 'yes') {
                 showQuestion('q1a-sub'); // Ask if it will last
             } else {
                 // Doesn't look oily, doesn't feel oily -> Tentatively DON'T wash
                 tentativeDecision = false;
                 showQuestion('q_future'); // Go to final check
             }
             break;

        case 'q1a-sub': // Will it last?
            if (answer === 'yes') { // Can last
                tentativeDecision = false;
                showQuestion('q_future');
            } else { // Cannot last -> Check photos
                 showQuestion('q4');
            }
            break;

        case 'q2': // Important people?
            if (answer === 'yes') {
                // Need to see important people -> Tentatively WASH
                tentativeDecision = true;
                showQuestion('q_future'); // Go to final check
            } else {
                showQuestion('q3'); // Ask about hat/makeup
            }
            break;

        case 'q3': // Hat/Makeup conflict?
            if (answer === 'yes') {
                // Cannot wear hat due to makeup -> Tentatively WASH
                tentativeDecision = true;
                showQuestion('q_future'); // Go to final check
            } else {
                showQuestion('q4'); // Ask about photos
            }
            break;

        case 'q4': // Photoshoot?
            if (answer === 'yes') {
                showQuestion('q5'); // Ask about dry shampoo
            } else {
                // No important people, can wear hat, no photos -> Tentatively DON'T wash (if reached from Q3)
                // OR Feels oily but won't last, but no photos -> Tentatively DON'T wash (if reached from Q1a-sub)
                tentativeDecision = false;
                showQuestion('q_future'); // Go to final check
            }
            break;

        case 'q5': // Dry shampoo works?
            if (answer === 'no') {
                // Photoshoot and dry shampoo doesn't work -> Tentatively WASH
                tentativeDecision = true;
            } else {
                // Photoshoot but dry shampoo works -> Tentatively DON'T wash
                tentativeDecision = false;
            }
            showQuestion('q_future'); // Go to final check
            break;

        case 'q_future': // Future plans more important?
            let finalDecision;
            if (answer === 'yes') {
                // Future is more important -> Override -> DON'T WASH TODAY
                finalDecision = false;
            } else {
                // Future is not more important -> Keep tentative decision
                finalDecision = tentativeDecision;
            }
            // Handle cases where tentativeDecision might still be null (shouldn't happen with this logic, but safety check)
            if (finalDecision === null) {
                console.warn("Tentative decision was null at final stage. Defaulting to Don't Wash.");
                finalDecision = false; // Default safe option
            }
            showResult(finalDecision);
            break;

        default:
            console.error("Unknown question ID:", currentQuestionId);
            restart(); // Go back to start if something unexpected happens
    }
}

// Function to display the final result
function showResult(shouldWash) {
     // Hide all question divs
    document.querySelectorAll('.question').forEach(q => {
        q.classList.remove('active');
    });

    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');

    if (shouldWash) {
        resultText.textContent = "结论：洗！✨";
        resultDiv.className = 'result wash'; // Use class for styling
    } else {
        resultText.textContent = "结论：今天不洗！😌";
        resultDiv.className = 'result dont-wash'; // Use class for styling
    }
    resultDiv.classList.remove('hidden'); // Show the result area
}

// Function to restart the decision process
function restart() {
    tentativeDecision = null; // Reset state
    document.getElementById('result').classList.add('hidden'); // Hide result
    showQuestion('q1'); // Show the first question
}

// Initial setup: Show the first question when the page loads
document.addEventListener('DOMContentLoaded', () => {
    showQuestion('q1');
});