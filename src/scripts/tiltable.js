(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./libgif'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('./libgif'));
    } else {
        root.TiltableGif = factory(root.SuperGif);
    }
}(this, function (SuperGif) {
    var TiltableGif = function( options ) {
        var sup = new SuperGif( options );

        var register_canvas_handers = function () {

            var canvas = sup.get_canvas();

            var didTilt = false;
            var tiltx, tiltz;

            (function () {
              setInterval(function() {
                if (!sup.get_loading() && didTilt) {
                  didTilt = false;
                  moveFrame(tiltx, tiltz);
                }
              }, 80);
            }());

            window.addEventListener("devicemotion", function(evt){
              didTilt = true;

              tiltx = evt.accelerationIncludingGravity.x; // 横方向の傾斜
              tiltz = evt.accelerationIncludingGravity.z; // 上下方向の傾斜

          	}, true);

            var moveFrame = function(x, z) {
              var angle = {};
              var radian = {};
              angle.x = Math.floor(Math.atan2(x,z) / Math.PI * 180);
              radian.x = Math.atan2(x,z) / Math.PI * 180 * (Math.PI / 180);
              var frameLength = sup.get_length();

              var frameNum = Math.floor(radian.x * frameLength) + Math.floor( frameLength / 2 );

              if (frameNum < 0) {
                frameNum = 0;
              } else if (frameNum > frameLength) {
                frameNum = frameLength;
              }

          		sup.move_to(frameNum);
            }

        };

        sup.orig_load = sup.load;
        sup.load = function(callback) {
            sup.orig_load( function() {
                if (callback) callback();
                register_canvas_handers( sup );
            } );
        }

        return sup;
    }

    return TiltableGif;
}));
