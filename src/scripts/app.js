'use strict'
var $ = require('jquery');

$(function(){
  // 一枚目
  var rubbable = new RubbableGif({
    gif: document.getElementById('example1'),
    max_width: $(window).width()
  });
  rubbable.load();

  // 二枚目
  var tiltable = new TiltableGif({
    gif: document.getElementById('example2'),
    max_width: $(window).width()
  });
  tiltable.load();

})
