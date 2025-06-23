const inputHours = document.getElementById("input-hours");
const inputMinutes = document.getElementById("input-minutes");
const inputSeconds = document.getElementById("input-seconds");
const inputSpeed = document.getElementById("input-speed");
const convertButton = document.getElementById("convert-btn");
const results = document.getElementById("results");

convertButton.addEventListener('click', function() {
    let preHours = Number(inputHours.value) ? Number(inputHours.value) : 0;
    let preMinutes = Number(inputMinutes.value) ? Number(inputMinutes.value) : 0;
    let preSeconds = Number(inputSeconds.value) ? Number(inputSeconds.value) : 0;
    const speedValue = inputSpeed.value;

    if (preHours + preMinutes + preSeconds == 0 || preHours < 0 || preMinutes < 0 || preSeconds < 0)  return window.alert("Please enter a valid length of time");
    if (speedValue == "")  return window.alert("Please select a speed multiplier");

    const preLengthSec = (preHours * 3600) + (preMinutes * 60) + preSeconds;
    const speedMultiplier = parseFloat(speedValue);
    const newTotalSecs = preLengthSec / speedMultiplier;
    const hours = Math.floor(newTotalSecs / 3600);
    const minutes = Math.floor((newTotalSecs % 3600) / 60);
    const seconds = Math.floor(newTotalSecs % 60);

    const newTimeTotal = formatTime(hours, minutes, seconds);
    const newTimeDiff = calculateNewTimeDiff(preHours, hours, preMinutes, minutes, preSeconds, seconds);
    const newPercentTotal = (newTotalSecs / preLengthSec) * 100;
    const newPercentDiff = Math.abs(100 - newPercentTotal);
    displayResults(newTimeTotal, newTimeDiff, Math.round(newPercentTotal), Math.round(newPercentDiff));
});

const calculateNewTimeDiff = (preHours, hours, preMinutes, minutes, preSeconds, seconds) => {
    if (preSeconds == 0 && seconds != 0) {
        preSeconds += 60;
        preMinutes -= 1;
    }
    if (preMinutes == 0 && minutes != 0) {
        preMinutes += 60;
        preHours -= 1;
    }
    while (preSeconds >= 60) {
        preSeconds -= 60;
        preMinutes += 1;
    }
    while (preMinutes >= 60) {
        preMinutes -= 60;
        preHours += 1;
    }

    let diffSecs, diffMins, diffHours;

    if (parseFloat(inputSpeed.value) > 1) {
        diffSecs = Math.floor(preSeconds - seconds);
        diffMins = Math.floor(preMinutes - minutes);
        diffHours = Math.floor(preHours - hours);

    } else {
        diffSecs = Math.floor(seconds - preSeconds);
        diffMins = Math.floor(minutes - preMinutes);
        diffHours = Math.floor(hours - preHours);
    }

    if (diffMins < 0) {
        diffMins += 60;
        diffHours -= 1;
    }
    if (diffSecs < 0) {
        diffSecs += 60;
        diffMins -= 1;
    }

    return formatTime(diffHours, diffMins, diffSecs);
}

const formatTime = (hours, minutes, seconds) => {
    let formattedTime = "";
    if (hours != 0)      formattedTime += hours + " hours ";
    if (minutes != 0)    formattedTime += minutes + " minutes";
    if (seconds != 0)    formattedTime += " " + seconds + " seconds";
    return formattedTime;
}

const displayResults = (newTimeTotal, newTimeDiff, NewPercentTotal, NewPercentDiff) => {
    let hours = Number(inputHours.value) ? Number(inputHours.value) + " hours " : "";
    let minutes = Number(inputMinutes.value) ? Number(inputMinutes.value) + " minutes " : "";
    let seconds = Number(inputSeconds.value) ? Number(inputSeconds.value) + " seconds" : "";

    results.innerHTML =
        `<h4>Original length: ${hours} ${minutes} ${seconds}</h4>
        <h5>At ${inputSpeed.value} speed</h5>
        
        <h5>New time taken: ${newTimeTotal} / ${NewPercentTotal}%</h5>
        <h5>Time difference: ${newTimeDiff} / ${NewPercentDiff}%</h5>
        `;
}