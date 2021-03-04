import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../web-socket.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @ViewChild('videoPlayer') videoplayer: ElementRef;

  seekingReceived: boolean


  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {

    this.webSocketService.listen('newConnection').subscribe((data) => {
      this.triggerSeeking();
    })

    this.webSocketService.listen('pause').subscribe(data => {
      console.log(data);
      try {

        this.videoplayer.nativeElement.pause();
      } catch (error) {

      }
    })

    this.webSocketService.listen('play').subscribe(data => {
      console.log(data);
      try {

        this.videoplayer.nativeElement.play();
      } catch (error) {

      }
    })

    this.webSocketService.listen('timeupdate').subscribe(({ time }) => {
      const currentTime = this.videoplayer.nativeElement.currentTime;
      console.log(time, currentTime, Math.abs(currentTime - time));
      if (Math.abs(currentTime - time) > 1e-6) {
        this.seekingReceived = true;
        try {
          this.videoplayer.nativeElement.currentTime = time;
        } catch (error) {

        }
      }

    })

  }

  triggerPause() {
    console.log('pause');
    if (!this.seekingReceived) {
      this.webSocketService.emit('pause', 'pause');
    }
  }

  triggerPlay() {
    console.log('play')
    if (!this.seekingReceived) {
      this.webSocketService.emit('play', 'play');
    }

  }

  triggerSeeked() {
    this.seekingReceived = false;
  }

  triggerSeeking() {
    const time = this.videoplayer.nativeElement.currentTime;
    if (!this.seekingReceived)
      this.webSocketService.emit('timeupdate', { time });
  }
}
