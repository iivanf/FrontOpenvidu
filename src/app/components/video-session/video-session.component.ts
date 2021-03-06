import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ConnectionEvent, OpenVidu, Publisher, PublisherProperties, Session, StreamEvent, PublisherSpeakingEvent } from 'openvidu-browser';
import { Lesson } from '../../models/lesson';
import { AuthenticationService } from '../../services/authentication.service';
import { VideoSessionService } from '../../services/video-session.service';
import { LessonService } from '../../services/lesson.service';
import { map } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';


@Component({
    selector: 'app-video-session',
    templateUrl: './video-session.component.html',
    styleUrls: ['./video-session.component.css']
})
export class VideoSessionComponent implements OnInit, OnDestroy, AfterViewInit {

    lesson: Lesson;

    lesson$: Observable<Lesson>

    OV: OpenVidu;
    session: Session;
    publisher: Publisher;

    token: string;

    cameraOptions: PublisherProperties;

    localVideoActivated: boolean;
    localAudioActivated: boolean;
    //screenShare: boolean;
    videoIcon: string;
    audioIcon: string;
    fullscreenIcon: string;
    raiseHandIcon: string;

    constructor(
        public location: Location,
        public authenticationService: AuthenticationService,
        private videoSessionService: VideoSessionService,
        private lessonService: LessonService,
        private snackBar: MatSnackBar,
        private snackBarHand: MatSnackBar,
        ) { }


    OPEN_VIDU_CONNECTION() {

        // 0) Obtain 'token' from server
        // In this case, the method ngOnInit takes care of it


        // 1) Initialize OpenVidu and your Session
        this.OV = new OpenVidu();
        this.session = this.OV.initSession();


        // 2) Specify the actions when events take place
        this.session.on('streamCreated', (event: StreamEvent) => {
            console.warn('STREAM CREATED!');
            console.warn(event.stream);
            this.session.subscribe(event.stream, 'subscriber', {
                insertMode: 'APPEND'
            });
        });

        this.session.on('streamDestroyed', (event: StreamEvent) => {
            console.warn('STREAM DESTROYED!');
            console.warn(event.stream);
        });

        this.session.on('publisherStartSpeaking', (event: PublisherSpeakingEvent) => {
                console.log('Publisher ' + event.connection.data + ' start speaking');
        });

        this.session.on('publisherStopSpeaking', (event: PublisherSpeakingEvent) => {
            console.log('Publisher ' + event.connection.connectionId + ' stop speaking');
        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            if (event.connection.connectionId === this.session.connection.connectionId) {
                console.warn('YOUR OWN CONNECTION CREATED!');
            } else {
                console.warn('OTHER USER\'S CONNECTION CREATED!');
            }
            console.warn(event.connection);
        });

        this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
            console.warn('OTHER USER\'S CONNECTION DESTROYED!');
            console.warn(event.connection);
            if (this.authenticationService.connectionBelongsToTeacher(event.connection)) {
                this.location.back();
            }
        });

        // 3) Connect to the session
        this.session.connect(this.token, 'CLIENT:' + this.authenticationService.getCurrentUser().name)
            .then(() => {
                if (this.authenticationService.isTeacher()) {

                    // 4) Get your own camera stream with the desired resolution and publish it, only if the user is supposed to do so
                    this.publisher = this.OV.initPublisher('publisher', this.cameraOptions);
                    
                    //this.publisher.addVideoElement

                    this.publisher.on('accessAllowed', () => {
                        console.warn('CAMERA ACCESS ALLOWED!');
                    });
                    this.publisher.on('accessDenied', () => {
                        console.warn('CAMERA ACCESS DENIED!');
                    });
                    this.publisher.on('streamCreated', (event: StreamEvent) => {
                        console.warn('STREAM CREATED BY PUBLISHER!');
                        console.warn(event.stream);
                    })

                    // 5) Publish your stream
                    this.session.publish(this.publisher);
                }
                
            }).catch(error => {
                console.log('There was an error connecting to the session:', error.code, error.message);
            });
    }


    ngOnInit() {

        // Specific aspects of this concrete application
        this.previousConnectionStuff();


        
        if (this.authenticationService.isTeacher()) {

            // If the user is the teacher: creates the session and gets a token (with PUBLISHER role)
            this.videoSessionService.createSession(this.lesson.id).subscribe(
                () => {
                    this.videoSessionService.generateToken(this.lesson.id).subscribe(
                        response => {
                            this.token = response[0];
                            console.warn('Token: ' + this.token);
                            this.OPEN_VIDU_CONNECTION();
                        },
                        error => {
                            console.log(error);
                        });
                },
                error => {
                    console.log(error);
                }
            );
        } else {

            // If the user is a student: gets a token (with SUBSCRIBER role)
            this.videoSessionService.generateToken(this.lesson.id).subscribe(
                response => { // {0: token}
                    this.token = response[0];
                    console.warn('Token: ' + this.token);
                    this.OPEN_VIDU_CONNECTION();
                },
                error => {
                    console.log(error);
                    if (error.status === 409) {
                        this.snackBar.open('The teacher has not opened the lesson yet!', 'Undo', {
                            duration: 3000
                        });
                        this.location.back();
                    }
                });
        }

       
        // Specific aspects of this concrete application
        this.afterConnectionStuff();

        interval(1000).subscribe(x => this.updateLesson())
    }

    ngAfterViewInit() {
        this.toggleScrollPage('hidden');
    }


    ngOnDestroy() {
        this.videoSessionService.removeUser(this.lesson.id).subscribe(
            response => {
                console.warn('You have succesfully left the lesson');
            },
            error => {
                console.log(error);
            });
        this.toggleScrollPage('auto');
        this.exitFullScreen();
        if (this.OV) { this.session.disconnect(); }
    }

    playAudio(){
        let audio = new Audio();
        audio.src = "assets/sound/notification.mp3";
        audio.load();
        audio.play();
      }

    getLesson(): void {
        this.lessonService.getLesson(this.lesson.id).subscribe(
            lesson => {
                console.log('GET LESSON: ');
                console.log(lesson);
                this.lesson = lesson;
                this.authenticationService.updateUserLessons(this.lesson);
            },
            error => console.log(error));
    }


    toggleScrollPage(scroll: string) {
        const content = <HTMLElement>document.getElementsByClassName('mat-sidenav-content')[0];
        content.style.overflow = scroll;
    }

    toggleLocalVideo() {
        this.localVideoActivated = !this.localVideoActivated;
        this.publisher.publishVideo(this.localVideoActivated);
        this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
    }

    toggleLocalAudio() {
        this.localAudioActivated = !this.localAudioActivated;
        this.publisher.publishAudio(this.localAudioActivated);
        this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
    }

    toggleFullScreen() {
        const document: any = window.document;
        const fs = document.getElementsByTagName('html')[0];
        if (!document.fullscreenElement &&
            !document.mozFullScreenElement &&
            !document.webkitFullscreenElement &&
            !document.msFullscreenElement) {
            console.log('enter FULLSCREEN!');
            this.fullscreenIcon = 'fullscreen_exit';
            if (fs.requestFullscreen) {
                fs.requestFullscreen();
            } else if (fs.msRequestFullscreen) {
                fs.msRequestFullscreen();
            } else if (fs.mozRequestFullScreen) {
                fs.mozRequestFullScreen();
            } else if (fs.webkitRequestFullscreen) {
                fs.webkitRequestFullscreen();
            }
        } else {
            console.log('exit FULLSCREEN!');
            this.fullscreenIcon = 'fullscreen';
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }

    toggleRaiseHand(){
        this.raiseHandIcon = 'pan_tool';
        console.log('HAND UP');
        this.lessonService.putHand(this.lesson.id).subscribe(
            response => {
                // Lesson has been updatedcd 
                console.log('try : ');
                console.log(response);
            },
            error => {
                console.log(error);
            });
    }

    toogleSlow(){
        console.log("BEFORE: "+ this.lesson.slow)
        this.lessonService.putSlow(this.lesson.id).subscribe(
            response => {
                // Lesson has been updated
                console.log('Lesson edited: ');
                console.log(response);
            },
            error => {
                console.log(error);
            });
    }

    exitFullScreen() {
        const document: any = window.document;
        const fs = document.getElementsByTagName('html')[0];
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    previousConnectionStuff() {
        this.lesson = this.videoSessionService.lesson;
        this.cameraOptions = this.videoSessionService.cameraOptions;
    }

    updateLesson(){
        this.lessonService.getLesson(this.lesson.id).subscribe(
            response => {
                if ((this.lesson.slow == false && response.slow == true) && this.authenticationService.isTeacher()){
                    this.playAudio();
                    let snack = this.snackBar.open('Go slow please!!', 'End now', {
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                      });
                      snack.onAction().subscribe(() => {
                        this.toogleSlow();
                        if(this.lesson.hand.length != 0){
                            let snack = this.snackBarHand.open(response.hand[response.hand.length-1].nickName + ' has a question !! (1/'+response.hand.length+')', 'Hand down', {
                                horizontalPosition: 'right',
                                verticalPosition: 'top',
                              });
                              snack.onAction().subscribe(() => {
                                this.toggleRaiseHand()
                              });
                        }
                      });
                }
                if ((JSON.stringify(this.lesson.hand) != JSON.stringify(response.hand)) && this.authenticationService.isTeacher() && response.hand.length != 0){
                    this.playAudio();
                    let snack = this.snackBarHand.open(response.hand[response.hand.length-1].nickName + ' has a question !! (1/'+response.hand.length+')', 'Hand down', {
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                      });
                      snack.onAction().subscribe(() => {
                        this.toggleRaiseHand()
                        if(this.lesson.slow){
                            let snack = this.snackBar.open('Go slow please!!', 'End now', {
                                horizontalPosition: 'right',
                                verticalPosition: 'top',
                              });
                              snack.onAction().subscribe(() => {
                                this.toogleSlow();
                              });
                        }
                      });
                }
                this.lesson = response;
            },
            error => {
              console.log(error);
            });
    }


    afterConnectionStuff() {
        if (this.authenticationService.isTeacher()) {
            this.localVideoActivated = this.cameraOptions.publishVideo !== false;
            this.localAudioActivated = this.cameraOptions.publishAudio !== false;
            this.videoIcon = this.localVideoActivated ? 'videocam' : 'videocam_off';
            this.audioIcon = this.localAudioActivated ? 'mic' : 'mic_off';
        }
        this.raiseHandIcon = 'pan_tool'
        this.fullscreenIcon = 'fullscreen';
    }

}
