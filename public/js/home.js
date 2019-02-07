$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  // Select all links with hashes
  $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#carousel"]')
    .not('[href="#carouselRecommendation"]')
    .not('[href="#carouselTestimony"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() {
            // Callback after animation
            // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });
  
  $(document).ready(() => {
    let firstAbout = false;
    $(document).scroll(() => {
    
  if ($('#about').visible(true)) {
    if(firstAbout === false) {
      $('#about').first().addClass('animated slideInUp fast');
    }
    
  } 
    
  });
  
  });
  
  const bandungChapterTeamShow = () => {  
    $('#btn-chapters').fadeOut(300, () => {
      $('#btn-chapters').hide(0,() => {
        $('#bandungTeam').fadeIn(300);
      })});  
  }
  
  const jakartaChapterTeamShow = () => {  
    $('#btn-chapters').fadeOut(300, () => {
      $('#btn-chapters').hide(0,() => {
        $('#jakartaTeam').fadeIn(300);
      })});  
  }
  
  const restoreButtonChapters = (element) => {
    $(element).fadeOut(300,() => {
      $(element).hide(0,() => {
        $('#btn-chapters').fadeIn(300);
      });
    });
    
  }
  
  $(document).ready(() => {
    $('#bandungTeam').hide();
    $('#jakartaTeam').hide();
    $('#whatwedo-content').hide();
    $('#testimony-content').hide();
    $('#founders').hide();
    $("#peers").removeClass('d-flex');
    $('#peers').hide();
  });
  
  const showAboutUs = () => {
    console.log("triggered");
    
    $("#about-headline").fadeOut(300,() => {
      $("#about-headline").text('About Us');
      $("#about-headline").fadeIn(300);
    });
    
    $("#whatwedo-content").fadeOut(300, ()=> {
      $("#whatwedo-content").hide(0,() => {
        $("#testimony-content").fadeOut(300, ()=> {
          $("#testimony-content").hide(0,() => {
            $("#about-content").fadeIn(300);  
          });
        });
      });    
    });
  }
  
  const showWhatWeDo = (element) => {
    console.log("triggered");
    $("#about-headline").fadeOut(300,() => {
      $("#about-headline").text('What We Do');
      $("#about-headline").fadeIn(300);
    });
    
    $("#about-content").fadeOut(300, ()=> {
      $("#about-content").hide(0,() => {
        $("#testimony-content").fadeOut(300, ()=> {
          $("#testimony-content").hide(0,() => {
            $("#whatwedo-content").fadeIn(300);  
          });
        });
      });    
    });
  }
  
  
  
  const showTestimony = (element) => {
    console.log("triggered");
    $("#about-headline").fadeOut(300,() => {
      $("#about-headline").text('Tertimony');
      $("#about-headline").fadeIn(300);
    }); 
    
    $("#whatwedo-content").fadeOut(300, ()=> {
      $("#whatwedo-content").hide(0,() => {
        $("#about-content").fadeOut(300, ()=> {
          $("#about-content").hide(0,() => {
            $("#testimony-content").fadeIn(300);  
          });
        });
      });    
    });
  }
  
  const showBod = () => {
    console.log("triggered"); 
    $("#peers").removeClass('d-flex');
    $("#peers").fadeOut(300, ()=> {
      $("#peers").hide(0,() => {
        $("#founders").fadeOut(300, ()=> {
          $("#founders").hide(0,() => {
            
            $("#bod").fadeIn(300);  
          });
        });
      });    
    });
  }
  
  const showPeers = () => {
    console.log("triggered"); 
    
    $("#bod").fadeOut(300, ()=> {
      $("#bod").hide(0,() => {
        $("#founders").fadeOut(300, ()=> {
          $("#founders").hide(0,() => {
            $("#peers").fadeIn(300); 
            $("#peers").addClass('d-flex');
          });
        });
      });    
    });
  }
  
  const showFounders = () => {
    console.log("triggered"); 
    $("#peers").removeClass('d-flex');
    $("#peers").fadeOut(300, ()=> {
      $("#peers").hide(0,() => {
        $("#bod").fadeOut(300, ()=> {
          $("#bod").hide(0,() => {       
            $("#founders").fadeIn(300);  
          });
        });
      });    
    });
  }