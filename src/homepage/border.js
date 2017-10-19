'use strict';

(function($){
  var $canvas,
      fnInitWaves,
      fnDrawWave,
      tmrResize;
  
  fnDrawWave = function(canvas){
    var $this = $(canvas),
        $outer,
        iWidth,
        iHeight,
        iMidWidth,
        iQuartWidth,
        iLineWidth,
        iFillLineWidth,
        ctx;
      
      $outer = $this.parent();
      
      iWidth = $outer.outerWidth();
      iHeight = $outer.outerHeight();
      iMidWidth = Math.floor(iWidth / 2);
      iQuartWidth = Math.floor(iMidWidth / 2);
      
      iLineWidth = 6;
      iFillLineWidth = 6;

      $this.attr({
        width: iWidth,
        height: iHeight
      });
      
      ctx = canvas.getContext('2d');
      
      // Wave init
      ctx.lineWidth = iLineWidth;
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(
        0, 
        iHeight / 2
      );

      // Wave peak
      ctx.quadraticCurveTo(
        iQuartWidth,
        -(iHeight / 2) + iLineWidth,
        iMidWidth,
        iHeight / 2
      );
      
      // Wave valley
      ctx.quadraticCurveTo(
        iQuartWidth + iMidWidth,
        (iHeight * 1.5) - iLineWidth,
        iWidth,
        iHeight / 2
      );
      
      // Wave end
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.closePath();
      
      // Wave peak fill init      
      ctx.lineWidth = iFillLineWidth;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(
        0,
        (iHeight / 2) + iFillLineWidth
      );
      
      // Wave peak fill
      ctx.quadraticCurveTo(
        iQuartWidth, 
        -(iHeight / 2) + (iLineWidth * 2),
        iMidWidth,
        (iHeight / 2) + iFillLineWidth
      );
      
      // Wave fill end
      ctx.lineCap = 'butt';
      ctx.stroke();
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
      
      // Wave valley fill init      
      ctx.lineWidth = iFillLineWidth;
      ctx.strokeStyle = 'orange';
      ctx.beginPath();
      ctx.moveTo(
        iMidWidth,
        (iHeight / 2) - iFillLineWidth
      );
      
      ctx.quadraticCurveTo(
        iQuartWidth + iMidWidth,
        (iHeight * 1.5) - iFillLineWidth,
        iWidth,
        (iHeight / 2) - iFillLineWidth
      );
      
      // Wave valley fill end
      ctx.lineCap = 'butt';
      ctx.stroke();
      ctx.fillStyle = 'orange';
      ctx.fill();
      ctx.closePath();
  };
  
  fnInitWaves = function(){    
    $canvas.each(function(i, el){
      fnDrawWave(el);
    });
  };
  
  $(function(){
    $canvas = $('canvas.wave');
    
    fnInitWaves.apply(undefined);
  });
  
  $(window).on('resize', function(){
    clearTimeout(tmrResize);
    
    tmrResize = setTimeout(fnInitWaves, 250);
  });
})(jQuery);