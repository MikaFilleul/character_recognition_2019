$(document).ready(function(){
  localStorage.setItem("state","app");
  var dessin = new Dessin();

  if (localStorage.getItem("mot") != "") {
    var res = document.getElementsByClassName("text");
    var motdiv = document.createElement("div");
    motdiv.classList.add("mot");
    var p = document.createElement("p");
    var text = document.createTextNode(localStorage.getItem("mot"));
    p.appendChild(text);
    motdiv.appendChild(p);
    var but = document.createElement("button");
    but.classList.add("reset");
    var buttext = document.createTextNode("Réinitialiser");
    but.appendChild(buttext);
    motdiv.appendChild(but);
    res[0].appendChild(motdiv);
  }

  $(".app").fadeIn("slow","linear");
  $(".app").css("display","flex");

  $(window).resize(function () {
    $(".app").css("display","none");
    if (localStorage.getItem("state") == "recherche") {
      alert("La recherche a été interrompue");
    }
    if (localStorage.getItem("state") == "resultats") {
      alert("Désolé, mais vous allez perdre vos résultats... Et vous ne pouvez rien faire pour revenir en arrière!");
    }
    $(location).attr("href", "app.html");
  });

  $("canvas#draw").mousedown(function(evt) {
    if(localStorage.getItem("state") == "app") {
      var mouseX = evt.pageX-this.offsetLeft;
      var mouseY = evt.pageY-this.offsetTop;
      dessin.paint = true;
      dessin.vide = false;
      dessin.addClick(mouseX,mouseY, false);
      dessin.render();
    }
  });

  $("canvas#draw").mousemove(function(evt) {
    if (localStorage.getItem("state") == "app") {
      var mouseX = evt.pageX-this.offsetLeft;
      var mouseY = evt.pageY-this.offsetTop;
      if (dessin.paint) {
        dessin.addClick(mouseX,mouseY,true);
        dessin.render();
      }
    }
  });

  $("canvas#draw").mouseup(function(evt) {
    dessin.paint = false;
  });

  $("canvas#draw").mouseleave(function(evt) {
    dessin.paint = false;
  });

  $("button.effacer").click(function () {
    if (localStorage.getItem("state") == "app") {
      dessin.effacer();
    }
  });

  $("button.reset").click(function () {
    if (localStorage.getItem("state") == "app") {
      localStorage.setItem("mot","");
      $(".app").css("display","none");
      $(location).attr("href", "app.html");
    }
  });

  $("button.retour").click(function () {
    $(".app").css("display","none");
    if (localStorage.getItem("state") == "recherche") {
      alert("La recherche a été interrompue");
    }
    $(location).attr("href", "app.html");
  });

  $("button.confirm").click(function () {
    var der = document.getElementsByClassName("res")[0].getElementsByTagName("td")[0].innerHTML;
    localStorage.setItem("mot",localStorage.getItem("mot")+der);
    $(".app").css("display","none");
    if (localStorage.getItem("state") == "recherche") {
      alert("La recherche a été interrompue");
    }
    $(location).attr("href", "app.html");
  });

  if (localStorage.getItem("cara") == "lettre") {
    $("h3").text("une lettre");
    $("p.cara_poss").text("A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z");
  }
  else if (localStorage.getItem("cara") == "chiffre") {
    $("h3").text("un chiffre");
    $("p.cara_poss").text("0, 1, 2, 3, 4, 5, 6, 7, 8, 9");
  }

  $("button.modif_choix").click(function () {
    if (localStorage.getItem("state") == "app") {
      if (localStorage.getItem("cara") == "lettre") {
        localStorage.setItem("cara","chiffre");
        $("h3").text("un chiffre");
        $("p.cara_poss").text("0, 1, 2, 3, 4, 5, 6, 7, 8, 9");
      }
      else if (localStorage.getItem("cara") == "chiffre") {
        localStorage.setItem("cara","lettre");
        $("h3").text("une lettre");
        $("p.cara_poss").text("A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z");
      }
    }
  });

  $("button.rechercher").click(function () {
    if (localStorage.getItem("state") == "app") {
      if (dessin.vide) {
        alert("Hehe... Facile! C'est le caractère Ņ̸̪̻̖͓̩̪̼̫̱͈͎̦͚͇̫̲̗͉̪̺̫͉͍͓̞̘̲̟͎͈͈̖̣̙̫̠̜͇̗͍̝͉̲̮̭̲̯͓̪͚̤͓͗̏̃̈́̋̅̾̆ͅÚ̷̟̹͇̠̫͖̺͖͇̱̜̮̀͊̀̿̌̈́L̷̨̛̛̛̗̤͍͈̬̱̯̙̜͙̖͓̙̺̩̖̪̩̞̳̲̼̮͇̳̼͋̈̏̂̾̎̒̆̐͗̊͑̄͋̀̌̒͑̉̽̆͗̓̄̀͂͆̿̿̉̅̿̅͐̇͋̒̑͆̈́̿̓̽͋̐̀̕̕̚̚͜͝͝͝ͅL̶̛̹͉̼̰͑̂͌̇͆̂̂̈̇͋̽͑́͑͂̊̃̋͂̇̅̓̍̋̾͊͗̔̒̆̈́̂̀̉͘̚̕̕̚͝͠ͅ!");
      }
      else {
        localStorage.setItem("state","recherche");
        $("div.loader").fadeIn();
        var info = dessin.infoCanvas();
        if (info[0].length >= dessin.context.canvas.width * dessin.context.canvas.height * 0.3) {
          localStorage.setItem("state","app");
          alert("Hmmm... Je comprends les caractères, pas des pavés de couleurs!");
          $(".app").css("display","none");
          $(location).attr("href", "app.html");
        }
        console.log("Info canvas:");
        console.log(info);
        var comp = dessin.echelle(info);
        if (comp === undefined) {
          localStorage.setItem("state","app");
          alert("J'ai besoin de mes lunettes pour comprendre ce caractère...\nPeut être dessiner des caractères un peu plus grands serait mieux pour ma vision!");
          $(".app").css("display","none");
          $(location).attr("href", "app.html");
        }
        else {
          console.log("Info echelleion:");
          console.log(comp);
          var cmprr = dessin.comparer(comp);
          if (cmprr === undefined) {
            localStorage.setItem("state","app");
            alert("Je ne sais pas trop ce qui m'arrive...\n Je raffraichis la page par peur d'activer le protocole d'auto-destruction...");
            $(".app").css("display","none");
            $(location).attr("href", "app.html");
          }
          else {
            localStorage.setItem("state","resultats");
            $("div.text").fadeOut("slow","linear", function () {
              $("div.resultats").fadeIn("slow","linear");
            });
            console.log("Structure Dessin:");
            console.log(dessin);
          }
        }
        $("div.loader").fadeOut();
      }
    }
  });
});
