document.addEventListener('DOMContentLoaded', function() {

  var static_counter = document.querySelector('.progress-counter');
  var score_counter = document.querySelector('.score-counter');
  var points_system = document.getElementsByClassName('points-system')[0];
  var clicked = document.getElementsByClassName('button-yes');
  var skipped = document.getElementsByClassName('button-no');
  var thumbs_up = document.getElementsByClassName('fa');
  var span_yes = document.querySelector('.span-yes');
  var span_no = document.querySelector('.span-no');
  var question_template = document.querySelector('.question-template');
  var questions_wrap = document.querySelector('.questions-wrap');
  var input_area = document.getElementsByClassName('input-area')[0];
  var incentive = document.getElementsByClassName('incentive')[0];

  try{
    if (sessionStorage.user_score) {
      static_counter.innerHTML = sessionStorage.user_score + 'pts';
      score_counter.innerHTML = 40 - Number(sessionStorage.user_score);
    }
  } catch(error) {
    alert('Please, turn off private browsing mode.');
  }

  //resizing handler
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 640 || window.innerWidth == 640) {
      if (points_system.nextElementSibling !== incentive) {
        input_area.insertBefore(points_system, incentive);
      }
    } else {
      if (incentive.nextElementSibling !== points_system) {
        input_area.insertBefore(incentive, points_system);
      }
    }
    if (window.innerWidth <= 360 || window.innerWidth == 360) {
      for (var v = 0; v < thumbs_up.length; v++) {
        thumbs_up[v].classList.remove('fa-2x');
        thumbs_up[v].classList.add('fa-lg');
      }
    } else {
      for (var x = 0; x < thumbs_up.length; x++) {
        thumbs_up[x].classList.remove('fa-lg');
        thumbs_up[x].classList.add('fa-2x');
      }
    }
  });
  window.dispatchEvent(new Event('resize'));

  var question_config = [{
    'question_text': 'Do you shop online?',
    'question_value': 2,
    'coreg_field': 'f12345',
    // 'options': [
    //   {
    //     'text': 'yes',
    //     'value': 2
    //   }, {
    //     'text': 'No',
    //     'value': 0
    //   }
    // ]
  }, {
    'question_text': 'Are taxes important to you?',
    'question_value': 4,
    'coreg_field': 'f54321'
  }, {
    'question_text': 'Do you own a pet?',
    'question_value': 2,
    'coreg_field': 'f78945'
  }, {
    'question_text': 'I say, is that a hat?',
    'question_value': 5,
    'coreg_field': 'f98745'
  }, {
    'question_text': 'Leaving so soon?',
    'question_value': 2,
    'coreg_field': 'f65412'
  }];

  //question handler
  question_config.forEach(function(config_item) {
    var questionNode = question_template.content.querySelector('.question').cloneNode(true);
    questionNode.querySelector('.question-value').value = config_item.question_value;
    questionNode.querySelector('.question-text').innerHTML = config_item.question_text;
    questionNode.querySelector('.coreg-field').name = config_item.coreg_field;
    questions_wrap.appendChild(questionNode);
  });

  var question = document.querySelector('.question').classList.add('visible');

  function switch_questions(clicked_yes) {
    clicked_yes = clicked_yes || false;

    var current_question = document.querySelector('.question.visible');
    var next_question = current_question.nextElementSibling;

    if (clicked_yes) {
      current_question.querySelector('.coreg-field').value = 'yes';
    }
    if (next_question) {
      current_question.classList.remove('visible');
      next_question.classList.add('visible');
    } else {
      document.getElementById('ss_submit_button').click();
      alert('5 questions submitted in bulk!');
    }

  }

  //yes button handler
  for (var i = 0; i < clicked.length; i++) {
    clicked[i].addEventListener('click', function() {

      var question_value = parseFloat(document.querySelector('.question.visible .question-value').value);
      var floating_counter = document.querySelector('.floating-progress-counter');
      var total_points = static_counter.innerHTML;
      var number = parseFloat(total_points.match(/\d+/)[0]);
      var total_value = (number + question_value);
      var score_counter_value = parseFloat(score_counter.innerHTML);
      var updated_points = total_value + "pts";
      var updated_score = (score_counter_value - question_value);
      //progress spinner variables
      var spinner = document.querySelector('.spinner');
      var filler = document.querySelector('.filler');
      var mask = document.querySelector('.mask');
      var progress_spinner = [spinner, filler, mask];
      var circle_is_active = document.getElementsByClassName('active');
      
      span_yes.style.display = 'none';
      thumbs_up[0].style.display = 'block';
      thumbs_up[0].classList.add('pop');

      //accrued points handler   
      floating_counter.innerHTML = '+' + question_value + 'pts';
      floating_counter.classList.add('animate');

      //handler for session storage    
      try {
        sessionStorage.user_score = total_value;
      }
      catch(error){
        alert('Please, turn off private browsing mode.');
      }
      
      //handler for score at the top  
      static_counter.innerHTML = updated_points;

      if (updated_score > 0) {
        score_counter.innerHTML = updated_score;
      } else if (updated_score === 0) {
        score_counter.innerHTML = 0;
      }

      //animate progress-spinner
      for (var j = 0; j < progress_spinner.length; j++) {
        progress_spinner[j].classList.add('active');
      }

      setTimeout(function() {
        thumbs_up[0].classList.remove('pop');
        for (var k = 0; k < progress_spinner.length; k++) {
          progress_spinner[k].classList.remove('active');
        }
      }, 800);

      setTimeout(function() {
        floating_counter.classList.remove('animate');
        span_yes.style.display = 'block';
        thumbs_up[0].style.display = 'none';
      }, 790);

      // when reach end of survey, uncomment the click of submit button do this
      if (score_counter.innerHTML <= 0) {
        document.querySelector('#ss_submit_button').click();
        alert('SURVEY COMPLETE!');
      }

      setTimeout(function() {
        switch_questions(true);
      }, 500);

    });
  }

  //skip button handler
  for (var m = 0; m < skipped.length; m++) {
    skipped[m].addEventListener('click', function() {
      span_no.style.display = 'none';
      thumbs_up[1].style.display = 'block';
      thumbs_up[1].classList.add('pop');

      setTimeout(function() {
        thumbs_up[0].classList.remove('pop');
      }, 800);

      setTimeout(function() {
        span_no.style.display = 'block';
        thumbs_up[1].style.display = 'none';
      }, 790);

      switch_questions();
    });
  }

});

// trying this out