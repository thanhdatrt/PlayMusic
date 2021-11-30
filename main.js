        const $ = document.querySelector.bind(document);
        const $$ = document.querySelectorAll.bind(document);

        const player = $('.player')
        const heading = $('header h2');
        const thumb = $('.cd-thumb');
        const audio = $('#audio');
        const cd = $('.cd');
        const playBtn = $('.btn-toggle-play');
        const progress = $('#progress');
        const nextBtn = $('.btn-next');
        const prevBtn = $('.btn-prev');
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')

        const app = {
          currentIndex: 0,
          IsPlaying: false,
          IsRandom: false,
          IsRepeat: false,
          
          songs: [
            {
              name: "Mật danh Bi Long",
              singer: "Insolent, Nalo, Roki",
              path: './assets/music/Mật Danh Bi Long.mp3',
              image: './assets/img/matdanhbilong.jpg'
            },
            {
              name: "Rap về Goku",
              singer: "Phan An",
              path: './assets/music/Rap về Goku.mp3',
              image: './assets/img/goku.jpg'
            },
            {
              name: "Rap về Luffy",
              singer: "Phan An",
              path: './assets/music/Rap về Luffy One Piece.mp3',
              image: './assets/img/luffy.jpg'
            },
            {
              name: "Người lạ thoáng qua",
              singer: "Hoài lâm",
              path: './assets/music/NGƯỜI LẠ THOÁNG QUA.mp3',
              image: './assets/img/nguoilathoangqua.jpg'
            },
            {
              name: "Bông hoa đẹp nhất",
              singer: "Quân AP",
              path: './assets/music/QUÂN AP  BÔNG HOA ĐẸP NHẤT.mp3',
              image: './assets/img/bonghoadepnhat.jpg'
            },
            {
              name: "Lạc",
              singer: "Rhymastic",
              path: './assets/music/LẠC  Rhymastic.mp3',
              image: './assets/img/lac.jpg'
            },
          ],
          
          render: function() {
            const htmls = this.songs.map((song, index) => {
              return ` 
              <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
                </div>
              </div>
              `
            })
            $('.playlist').innerHTML = htmls.join('');
          },

          defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
              get: function() {
                return this.songs[this.currentIndex]
              }
            })
          },

          handleEvents: function() {
            const _this = this
            const cdwidth = cd.offsetWidth

            // xu li quay cd
            const cdThumbAnimate = thumb.animate([
              { transform: 'rotate(360deg)'}
            ], {
              duration: 10000, // 10 seconds
              iterations: Infinity
            })

            cdThumbAnimate.pause();

            // xử lí thu phóng
            document.onscroll = function() {
              const scrollTop = window.scrollY || document.documentElement.scrollTop;
              const newCdWidth = cdwidth - scrollTop

              cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
              cd.style.opacity = newCdWidth / cdwidth
            }

            // xử lí click play
             playBtn.onclick = function() {
                if(_this.IsPlaying) {
                  audio.pause();
                } else {
                  audio.play();
                }
             }

            //  khi song play
            audio.onplay = function() {
                _this.IsPlaying = true
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            //  khi song pause
            audio.onpause = function() {
                _this.IsPlaying = false
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }
            // khi tien do bai hat thay doi
            audio.ontimeupdate = function() {
              if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100000);
                progress.value = progressPercent;
              }
            }
            // tua song
            progress.oninput = function(e) {
              const seekTime = audio.duration / 100000 * e.target.value
              audio.currentTime = seekTime
            } 

            // next song
            nextBtn.onclick = function() {
              if(_this.IsRandom) {
                _this.playRandomSong();
              } else {
                _this.nextSong()
              }
              audio.play();
              _this.activeSong();
              _this.scrollToActiveSong();
            }

            // prev song
            prevBtn.onclick = function() {
              if(_this.IsRandom) {
                _this.playRandomSong();
              } else {
                _this.prevSong()
              }
              audio.play();
              _this.activeSong();
              _this.scrollToActiveSong();
            }

            // random song
            randomBtn.onclick = function(e) {
              _this.IsRandom = !_this.IsRandom
              randomBtn.classList.toggle('active', _this.IsRandom)
              
            }

            // repeat song
            repeatBtn.onclick = function(e) {
              _this.IsRepeat = !_this.IsRepeat
              repeatBtn.classList.toggle('active', _this.IsRepeat)
            }

            audio.onended = function() {
              if(_this.IsRepeat) {
                audio.play();
              } else {
                nextBtn.click();
              }
            }
          },

          scrollToActiveSong: function() {
            if (this.currentIndex === 0) {
              document.documentElement.scrollTop = 0
            };
            setTimeout(() => {
              $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
              })
            }, 200)
          },

          loadCurrentSong: function() {
            heading.textContent = this.currentSong.name
            thumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path
          },
          
          nextSong: function() {
            this.currentIndex++
            if(this.currentIndex >= this.songs.length) {
              this.currentIndex = 0
            }
            this.loadCurrentSong();
          },

          prevSong: function() {
            this.currentIndex--
            if(this.currentIndex < 0) {
              this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong();
          },

          playRandomSong: function() {
            let newIndex
            do {
              newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex);

            this.currentIndex = newIndex
            this.loadCurrentSong();
          },

          // active song
          activeSong: function(){
            var loopSongs = $$('.song');
            for (song of loopSongs){
                    song.classList.remove('active')
            }
            const activeSong = loopSongs[this.currentIndex]
            activeSong.classList.add('active')
          },


          start: function() {
            // định nghĩa các thuộc tính cho Object
            this.defineProperties();
            // lắng nghe / xử lí các sự kiện trng DOM
            this.handleEvents();
            // tải thông tin bài hát lên UI
            this.loadCurrentSong(); 
            // Render playlist
            this.render();
          }

        };
        
        app.start();