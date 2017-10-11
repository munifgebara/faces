import { Component, OnInit } from '@angular/core';
import * as clmtrackr from 'clmtrackr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  video:HTMLVideoElement;
  ctracker;
  canvas:HTMLCanvasElement;
  cc;


  ngOnInit() {
    this.video =<HTMLVideoElement> document.getElementById('video');
    this.canvas =<HTMLCanvasElement> document.getElementById('drawCanvas');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream)=> {
        this.video.src = window.URL.createObjectURL(stream);
        this.video.play();
        
        this.ctracker = new clmtrackr.default.tracker();
        this.ctracker.init();
        this.ctracker.start(this.video);
        this.positionLoop();
        this.cc = this.canvas.getContext('2d');
      });
    }
  }

  positionLoop() {
    
    requestAnimationFrame(()=>{
      let positions = this.ctracker.getCurrentPosition();
      if (positions){
        this.drawLoop(positions);
      }

      this.positionLoop();
    })
  }
  drawLoop(positions): any {
     this.cc.clearRect(0,0, this.canvas.width, this.canvas.height);
     this.ctracker.draw(this.canvas);
     const score=this.ctracker.getScore();
     if (score>this.maxScore){
       this.maxScore=score;
       
       console.log(score,this.distance(positions,27,32)/this.distance(positions,0,14));


     }
     
      
  
    
  }

  distance(positions,p1,p2){
    return Math.sqrt((positions[p1][0]-positions[p2][0])*(positions[p1][0]-positions[p2][0])+(positions[p1][1]-positions[p2][1])*(positions[p1][1]-positions[p2][1]));
  }

  maxScore=0;

  grava(){
    this.maxScore=0;
  }
  

}
