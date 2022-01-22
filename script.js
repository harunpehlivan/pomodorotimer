var app = angular.module('Pomodoro', []);
app.controller('PomodoroCtrl', PomodoroCtrl);

PomodoroCtrl.$inject = ['$interval'];

function PomodoroCtrl($interval) {
  var vm = this;

  vm.breakTime = 5;
  vm.workTime = 25;
  vm.started = false;
  vm.currentTime = vm.workTime * 60;
  vm.tomatoFill = 0;
  vm.activity = "Start";

  var breakNow = false;
  var workNow = true;
  var run = false;

  var audio = new Audio('https://raw.githubusercontent.com/KarafiziArtur/random-quote-generator/master/Nexus_5-notification_sound-1656850.mp3');

  // PLAY/PAUSE button
  vm.toggleTimer = function () {
    if (!run) {
      if (breakNow) {
        vm.activity = "Breaking";
        vm.fillTemp = vm.currentTime;
      } else if (workNow) {
        vm.activity = "Working";
        vm.fillTemp = vm.currentTime;
      }
      $('.pomodoro-wrap p').addClass('pulse animated infinity');
      $('.pomodoro-wrap i.pomodoro-play').removeClass('fa-play').addClass('fa-pause active');
      run = $interval(updateWork, 1000);
      vm.started = true;
    } else {
      vm.pauseTimer();
      $('.pomodoro-wrap p').removeClass('pulse animated');
    }
  };

  // STOP button  
  vm.stopTimer = function () {
    vm.pauseTimer();
    vm.currentTime = vm.workTime * 60;
    breakNow = false;
    workNow = true;
    vm.started = false;
    vm.tomatoFill = '0%';
    $('.fill').css('width', vm.tomatoFill);
  };

  // Uses in toggle button
  vm.pauseTimer = function () {
    vm.activity = "Start";
    $('.pomodoro-wrap i.pomodoro-play').removeClass('fa-pause active').addClass('fa-play');
    $interval.cancel(run);
    run = false;
  };

  // Update of the timer
  var updateWork = function () {
    if (vm.currentTime < 1) {
      if (!breakNow && workNow) {
        vm.currentTime = vm.breakTime * 60;
        vm.activity = "Breaking";
        workNow = false;
        breakNow = true;
      } else if (breakNow && !workNow) {
        vm.activity = "Working";
        vm.currentTime = vm.workTime * 60;
        workNow = true;
        breakNow = false;
      }
      audio.play();
    } else {
      vm.currentTime--;
      TomatoFill();
    }
  };

  // Filling background
  function TomatoFill() {
    if (!breakNow && workNow) {
      vm.tomatoFill = Math.floor((vm.workTime * 60 - vm.currentTime) / (vm.workTime * 60) * 100) + '%';
    } else if (breakNow && !workNow) {
      vm.tomatoFill = 100 - Math.floor((vm.breakTime * 60 - vm.currentTime) / (vm.breakTime * 60) * 100) + '%';
    }
    $('.fill').css('width', vm.tomatoFill);
  }

  // On manual change configurable timers
  vm.breakTimeChanged = function () {
    if (vm.breakTime <= 1) {
      vm.breakTime = 1;
    }
    if (vm.breakTime >= 60) {
      vm.breakTime = 60;
    }
  };

  vm.workTimeChanged = function () {
    if (vm.workTime <= 1) {
      vm.workTime = 1;
      vm.currentTime = vm.workTime * 60;
    }
    if (vm.workTime >= 60) {
      vm.workTime = 60;
      vm.currentTime = vm.workTime * 60;
    } else {
      vm.currentTime = vm.workTime * 60;
    }
  };

  // SPINNERS

  vm.spinDownBreak = function () {
    if (!vm.started) {
      if (vm.breakTime <= 1) {
        vm.breakTime = 1;
      } else {
        vm.breakTime--;
      }
    }
  };

  vm.spinUpBreak = function () {
    if (!vm.started) {
      if (vm.breakTime >= 60) {
        vm.breakTime = 60;
      } else {
        vm.breakTime++;
      }
    }
  };

  vm.spinDownWork = function () {
    if (!vm.started) {
      if (vm.workTime <= 1) {
        vm.workTime = 1;
      } else {
        vm.workTime--;
      }
      vm.currentTime = vm.workTime * 60;
    }
  };

  vm.spinUpWork = function () {
    if (!vm.started) {
      if (vm.workTime >= 60) {
        vm.workTime = 60;
      } else {
        vm.workTime++;
      }
      vm.currentTime = vm.workTime * 60;
    }
  };

}

// Filter for displaying time
app.filter('PomodoroFilter', PomodoroFilter);
function PomodoroFilter() {
  return function (input) {
    return ('00' + Math.floor(input / 60)).slice(-2) + ' : ' + ('00' + Math.floor(input % 60)).slice(-2);
  };
}