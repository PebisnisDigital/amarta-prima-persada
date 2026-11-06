(function () {
  'use strict';

  var data = {
    titip: {
      label: 'Skema 01 · Titip Mobil',
      nominal: 'Parameter biaya / bagi hasil*',
      contract: '12 bulan',
      condition: 'Bekas · maks. 2 tahun, KM < 100.000',
      note: 'Unit harus layak pakai, bebas gadai, STNK berlaku, dan memiliki GPS aktif 24 jam.',
      standar: 'Rp 3.000.000',
      reguler: 'Rp 3.500.000'
    },
    murni: {
      label: 'Skema 02 · Sewa Murni Unit Baru',
      nominal: 'Parameter pengadaan / DP*',
      contract: '60 bulan',
      condition: 'Unit baru dealer resmi (ATPM)',
      note: 'Pengurusan DP, legalitas, dan leasing dibantu tim KJANS sesuai persetujuan serta akad.',
      standar: 'Rp 3.700.000',
      reguler: 'Rp 4.500.000'
    },
    milik: {
      label: 'Skema 03 · Sewa Kepemilikan',
      nominal: 'Parameter sewa / kepemilikan*',
      contract: '60–72 bulan',
      condition: 'Unit baru dealer resmi (ATPM)',
      note: 'Opsi pengalihan hak milik mensyaratkan penyelesaian kewajiban dan tebus akhir RV 50% dari OTR sesuai akad.',
      standar: 'Rp 3.700.000',
      reguler: 'Rp 4.500.000'
    }
  };
  var state = { scheme: 'titip', tier: 'standar' };
  var modal = document.getElementById('kjansModal');
  var modalPanel = modal && modal.querySelector('.kjans-modal-panel');
  var form = document.getElementById('kjansPartnerForm');
  var lastFocused = null;
  if (!modal || !form) return;

  var byId = function (id) { return document.getElementById(id); };
  var schemeField = byId('kjansPartnerScheme');
  var schemeIndex = { titip: 0, murni: 1, milik: 2, umum: 3 };

  function render() {
    var selected = data[state.scheme];
    var models = state.tier === 'standar' ? 'Daihatsu Sigra / Toyota Calya' : 'Daihatsu Xenia / Toyota Avanza';
    var label = state.tier === 'standar' ? 'Standar' : 'Reguler';
    byId('kjansSimBadge').textContent = selected.label + ' · ' + label;
    byId('kjansSimUnit').textContent = models;
    byId('kjansSimNominalLabel').textContent = selected.nominal;
    byId('kjansSimPrice').textContent = selected[state.tier];
    byId('kjansSimContract').textContent = selected.contract;
    byId('kjansSimCondition').textContent = selected.condition;
    byId('kjansSimNote').textContent = selected.note;
    byId('kjansSimCta').dataset.scheme = state.scheme;

    document.querySelectorAll('[data-sim-scheme]').forEach(function (button) {
      var active = button.dataset.simScheme === state.scheme;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-sim-tier]').forEach(function (button) {
      var active = button.dataset.simTier === state.tier;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  document.querySelectorAll('[data-sim-scheme]').forEach(function (button) {
    button.addEventListener('click', function () {
      state.scheme = button.dataset.simScheme;
      render();
    });
  });
  document.querySelectorAll('[data-sim-tier]').forEach(function (button) {
    button.addEventListener('click', function () {
      state.tier = button.dataset.simTier;
      render();
    });
  });

  function openModal(type, fromSimulator) {
    lastFocused = document.activeElement;
    schemeField.selectedIndex = schemeIndex[type] === undefined ? 3 : schemeIndex[type];
    byId('kjansPartnerNotes').value = fromSimulator
      ? 'Pilihan simulasi: ' + (state.tier === 'standar' ? 'Standar (Sigra / Calya)' : 'Reguler (Xenia / Avanza)')
      : '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('kjans-modal-locked');
    byId('kjansPartnerName').focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('kjans-modal-locked');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.querySelectorAll('.kjans-open-modal').forEach(function (button) {
    button.addEventListener('click', function () {
      openModal(button.dataset.scheme || 'umum', button.id === 'kjansSimCta');
    });
  });
  modal.querySelectorAll('[data-kjans-close]').forEach(function (button) {
    button.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key !== 'Tab') return;
    var focusables = Array.from(modalPanel.querySelectorAll('button, input, select, textarea'))
      .filter(function (element) { return !element.disabled; });
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var name = byId('kjansPartnerName').value.trim();
    var city = byId('kjansPartnerCity').value.trim();
    var scheme = schemeField.value;
    var notes = byId('kjansPartnerNotes').value.trim() || '-';
    if (!name || !city) return;
    var text = [
      'Halo CS Koperasi Jasa Asa Nirwana Selaras (KJANS),',
      '',
      'Saya ingin konsultasi kemitraan:',
      'Nama: ' + name,
      'Domisili: ' + city,
      'Pilihan: ' + scheme,
      'Unit / Catatan: ' + notes,
      '',
      'Mohon informasi syarat, rincian nilai, risiko, dan prosedur pendaftaran. Terima kasih.'
    ].join('\n');
    var url = 'https://wa.me/628111004312?text=' + encodeURIComponent(text);
    var opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else window.location.href = url;
    closeModal();
  });
  render();
})();
