// js/script.js
// Shared script for all pages (jQuery required)
$(document).ready(function () {
  console.log("jQuery is ready!");

  // ---------- Part 1: Selectors & CSS ----------
  // NOTE: ID/class selectors used across pages; safe to call (if element absent, jQuery ignores)
  $("#change-text").on("click", function () {
    $("#para1").text("Текст изменён методом .text() — теперь plain text.");
  });
  $("#change-html").on("click", function () {
    $("#para1").html('HTML изменён <strong>через .html()</strong> — <em>span</em> добавлен.');
  });
  $("#style-para").on("click", function () {
    $("#para1").css({"background-color":"#fff3cd","padding":"8px","border-radius":"6px"});
  });

  // ---------- Part 2: Effects ----------
  $("#btn-hide").on("click", function () { $("#vis-par").hide(400); });
  $("#btn-show").on("click", function () { $("#vis-par").show(400); });
  $("#btn-toggle").on("click", function () { $("#vis-par").toggle(300); });

  $("#fade-in").on("click", function () { $("#fade-img").fadeIn(600); });
  $("#fade-out").on("click", function () { $("#fade-img").fadeOut(600); });
  $("#fade-toggle").on("click", function () { $("#fade-img").fadeToggle(500); });

  $("#panel-toggle").on("click", function () { $("#panel").slideToggle(400); });

  // ---------- Part 3: DOM Manipulation ----------
  $("#add-item").on("click", function () {
    const txt = $("#new-item-text").val().trim() || "New item";
    $("#item-list").append($("<li>").text(txt));
    $("#new-item-text").val("");
  });
  $("#prepend-item").on("click", function () {
    const txt = $("#new-item-text").val().trim() || "Prepended item";
    $("#item-list").prepend($("<li>").text(txt));
    $("#new-item-text").val("");
  });
  $("#remove-last").on("click", function () { $("#item-list li").last().remove(); });

  const altSrc = "images/weapon3.jpg";
  $("#change-src").on("click", function () {
    const $img = $("#attr-img");
    const current = $img.attr("src") || "";
    $img.attr("src", current.includes("weapon2") ? altSrc : "images/weapon2.jpg");
  });

  $("#change-href").on("click", function () {
    const $link = $("#dynamic-link");
    const newHref = prompt("Введите новый URL для ссылки (например https://astanait.edu.kz):", "https://astanait.edu.kz");
    if (newHref) {
      $link.attr("href", newHref);
      $link.text("Link -> " + newHref);
    }
  });

  $("#name-input").on("input", function () { $("#live-name").text($(this).val()); });
  $("#email-input").on("input", function () { $("#live-email").text($(this).val()); });

  // ---------- Part 4: Animations ----------
  const $box = $("#box");
  $("#animate-grow").on("click", function () {
    $box.animate({ width: "160px", height: "160px", left: "+=120px", top: "20px", opacity: 0.8 }, 700);
  });
  $("#animate-seq").on("click", function () {
    $box.animate({ left: "+=200px" }, 500).animate({ top: "+=120px" }, 500).animate({ width: "40px", height: "40px" }, 400).animate({ left: "0px", top: "0px", width: "80px", height: "80px" }, 600);
  });
  $("#animate-combined").on("click", function () {
    $box.animate({ left: "+=100px", top: "+=20px", width: "140px", height: "140px", opacity: 0.5 }, { duration: 900, easing: "swing" });
  });
  $("#reset-box").on("click", function () { $box.stop(true).css({ left: "0px", top: "0px", width: "80px", height: "80px", opacity: 1 }); });

  // ---------- Part 5: Mini Project (Gallery & Accordion) ----------
  // Gallery modal
  const $modal = $("#imgModal"), $modalImg = $("#modalImg");
  $(".gallery-item").on("click", function () {
    $modalImg.attr("src", $(this).attr("src"));
    $modal.addClass("show").attr("aria-hidden","false");
  });
  $("#modalClose").on("click", closeModal);
  $modal.on("click", function (e) { if (e.target === this) closeModal(); });
  function closeModal(){ $modal.removeClass("show").attr("aria-hidden","true"); $modalImg.attr("src",""); }

  // Accordion
  $(".acc-body").hide();
  $(".acc-header").on("click", function () {
    const $body = $(this).next(".acc-body");
    $(".acc-body").not($body).slideUp(300);
    $body.slideToggle(300);
  });

  // ---------- CS2 Character Animation (Part 6 - custom) ----------
  const $char = $("#character"), $fire = $("#fire"), $stage = $("#stage");
  let walkInterval = null, loopMode = false;

  function startWalkOnce() {
    if (!$char.length) return;
    // reset
    $char.stop(true).css({ left: "12px" });
    $fire.hide();
    const stageW = $stage.width();
    const charW = $char.width();
    const targetLeft = stageW - charW - 16; // rightmost pos
    $fire.show().css({ left: $char.position().left + 40 });
    $char.animate({ left: targetLeft + "px" }, {
      duration: 3500,
      easing: 'linear',
      step: function(now, fx) {
        // move fire with character
        $fire.css({ left: now + 40 + "px" });
      },
      complete: function() {
        // small fire burst animation then hide
        $fire.fadeOut(300);
        // return to left after small pause
        setTimeout(function(){ $char.animate({ left: "12px" }, 800); }, 700);
      }
    });
  }

  $("#start-walk").on("click", function(){
    startWalkOnce();
  });

  $("#stop-walk").on("click", function(){
    $char.stop(true); $fire.stop(true).hide(); loopMode = false; clearInterval(walkInterval);
  });

  $("#walk-loop").on("click", function(){
    if (loopMode) return;
    loopMode = true;
    startWalkOnce();
    walkInterval = setInterval(function(){ if(loopMode) startWalkOnce(); }, 4600);
  });

  // Stop loop on page unload / navigation
  $(window).on("beforeunload", function(){ clearInterval(walkInterval); });

  // ---------- Small UI niceties ----------
  // smooth in-view reveal
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.style.transform = 'translateY(0)', en.target.style.opacity = '1';
    });
  }, {threshold:0.12});
  document.querySelectorAll('.card, .hero, .stage').forEach(s=>{
    s.style.transform='translateY(12px)'; s.style.opacity='0'; s.style.transition='all .6s cubic-bezier(.2,.8,.2,1)';
    observer.observe(s);
  });

  // internal links: simple active nav highlight (works across pages)
  $('a[href$=".html"], a[href="#"]').on('click', function(){
    // done by navigation on each page load
  });
});
