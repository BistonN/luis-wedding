function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endtime) {
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

(function () {
  var storageKey = 'herika-luis-invite-opened';
  var overlay = document.getElementById('invite-overlay');
  var envelope = document.getElementById('invite-envelope');
  var siteContent = document.getElementById('site-content');
  var messageForm = document.getElementById('message-form');

  function readInviteState() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function saveInviteState() {
    try {
      localStorage.setItem(storageKey, 'true');
    } catch (error) {
      // Ignore storage errors and continue showing the site.
    }
  }

  function revealSite() {
    if (siteContent) {
      siteContent.classList.add('is-visible');
    }

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    saveInviteState();
  }

  function openInvite() {
    if (!envelope) {
      revealSite();
      return;
    }

    revealSite();
  }

  if (readInviteState() === 'true') {
    revealSite();
    return;
  }

  if (envelope) {
    envelope.addEventListener('click', openInvite);
    envelope.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openInvite();
      }
    });
  }

  if (messageForm) {
    messageForm.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameField = document.getElementById('guest-name');
      var messageField = document.getElementById('guest-message');
      var name = nameField ? nameField.value.trim() : '';
      var message = messageField ? messageField.value.trim() : '';
      var subject = encodeURIComponent('Mensagem para os noivos');
      var body = encodeURIComponent('Nome: ' + name + '\n\nMensagem:\n' + message);

      window.location.href = 'mailto:biston.nunes@gmail.com?subject=' + subject + '&body=' + body;
    });
  }

  // Copy button handlers for PIX / IBAN
  var copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-copy-target');
      var target = document.getElementById(targetId);
      if (!target) return;
      var text = target.value || target.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          var original = btn.textContent;
          btn.textContent = 'Copiado!';
          setTimeout(function () { btn.textContent = original; }, 1500);
        }).catch(function () {
          fallbackCopy(text, btn);
        });
      } else {
        fallbackCopy(text, btn);
      }
    });
  });

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      var original = btn.textContent;
      btn.textContent = 'Copiado!';
      setTimeout(function () { btn.textContent = original; }, 1500);
    } catch (err) {
      alert('Copiar não suportado no seu navegador. Por favor copie manualmente: ' + text);
    }
    document.body.removeChild(textarea);
  }
})();

var deadline = new Date(Date.parse(new Date()) + 90 * 24 * 60 * 60 * 1000);
initializeClock('clockdiv', deadline);