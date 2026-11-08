/* Tarif resmi KJANS, bersumber dari daftar harga sewa kendaraan yang diberikan klien.
 * Calya/Sigra serta beberapa minibus memiliki satu kelompok tarif yang sama.
 * Angka tidak dibulatkan; null berarti "sesuai kesepakatan" dalam daftar.
 */
(function () {
  'use strict';

  const english = document.documentElement.lang.toLowerCase().startsWith('en');
  const words = english ? {
    heading: 'Rental rates', vat: 'Excluding VAT', daily: 'Daily', monthly: 'Monthly',
    contract: '60-month contract', eightHours: '8 hours', perMonth: 'per month',
    base: 'Base rate', driver: 'With driver', fuel: 'With fuel',
    agreement: 'By agreement', city: 'Within the city', outside: 'Outside the city',
    holiday: 'Holiday / religious holiday', twelveHours: '12 hours',
    groupNote: 'Includes driver and fuel; excludes tips, tolls, and parking.',
    inquire: 'Please ask for a quotation for this specific model.',
    genericHiace: 'General Toyota Hiace rate',
    genericNote: 'This is the general Toyota Hiace rate, not a confirmed price for Hiace Premio. The 12-hour package includes driver and fuel, but excludes tips, tolls, and parking.',
    priceUpdate: 'Rates may change depending on market prices and prevailing conditions.'
  } : {
    heading: 'Harga sewa', vat: 'Belum termasuk PPN', daily: 'Harian', monthly: 'Bulanan',
    contract: 'Kontrak 60 bulan', eightHours: '8 jam', perMonth: 'per bulan',
    base: 'Tarif dasar', driver: 'Berikut sopir', fuel: 'Berikut BBM',
    agreement: 'Sesuai kesepakatan', city: 'Dalam kota', outside: 'Luar kota',
    holiday: 'Hari libur / hari raya', twelveHours: '12 jam',
    groupNote: 'Sudah termasuk BBM dan sopir; belum termasuk tip, tol, dan parkir.',
    inquire: 'Silakan konsultasikan harga khusus untuk tipe mobil ini.',
    genericHiace: 'Tarif Toyota Hi Ace (umum)',
    genericNote: 'Tarif ini untuk kelompok Toyota Hi Ace umum, bukan harga khusus Hiace Premio. Paket 12 jam sudah termasuk BBM dan sopir, belum termasuk tip, tol, dan parkir.',
    priceUpdate: 'Harga dapat berubah sewaktu-waktu mengikuti harga pasar, situasi, dan kondisi.'
  };

  // [tarif dasar, berikut sopir, berikut BBM] untuk setiap jangka sewa.
  // Tarif kontrak 60 bulan dinyatakan per bulan, sesuai keterangan sumber.
  const carPrices = {
    'Toyota Calya': {
      daily: [375000, 850000, 1300000],
      monthly: [5500000, 12000000, null],
      contract: [4500000, null, null]
    },
    'Daihatsu Sigra': {
      daily: [375000, 850000, 1300000],
      monthly: [5500000, 12000000, null],
      contract: [4500000, null, null]
    },
    'Daihatsu Xenia': {
      daily: [500000, 1000000, 1500000],
      monthly: [7500000, 12500000, null],
      contract: [6000000, null, null]
    },
    'Toyota Avanza': {
      daily: [600000, 1150000, 1700000],
      monthly: [8500000, 15000000, null],
      contract: [7000000, null, null]
    },
    'Toyota Veloz': {
      daily: [700000, 1350000, 2000000],
      monthly: [9000000, 15500000, null],
      contract: [8500000, null, null]
    },
    'Innova Zenix G 2.0 Hybrid': {
      daily: [900000, 1650000, 2100000],
      monthly: [14000000, 21000000, null],
      contract: [12000000, null, null]
    }
  };

  // Seluruh tarif minibus adalah untuk 12 jam; tarif luar kota/hari raya dinegosiasikan.
  const minibusPrices = {
    'Isuzu Elf': 2500000,
    'Isuzu Elf Long': 3500000,
    'Toyota Hiace Commuter': 3500000
  };

  const rateVariants = {
    'Daihatsu Xenia': 'Xenia X CVT',
    'Toyota Avanza': 'Avanza E 1.3 AT',
    'Toyota Veloz': 'Avanza Veloz 1.5 CVT'
  };

  const currency = amount => amount === null
    ? words.agreement
    : `Rp${new Intl.NumberFormat('id-ID').format(amount)}`;

  const node = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (value !== undefined) element.textContent = value;
    return element;
  };

  function line(label, amount) {
    const row = node('div', 'fleet-price-row');
    row.append(node('span', '', label), node('strong', amount === null ? 'fleet-price-by-agreement' : '', currency(amount)));
    return row;
  }

  function title(section, subtitle) {
    const top = node('div', 'fleet-price-title', section);
    if (subtitle) top.appendChild(node('small', '', subtitle));
    return top;
  }

  function priceBox(vehicleName) {
    const outer = node('section', 'fleet-pricing');
    outer.setAttribute('aria-label', `${words.heading} ${vehicleName}`);
    const heading = node('div', 'fleet-pricing-heading');
    heading.appendChild(node('h4', '', words.heading));
    outer.appendChild(heading);
    return outer;
  }

  function mpvPricing(vehicleName, rates) {
    const outer = priceBox(vehicleName);
    outer.querySelector('.fleet-pricing-heading').append(node('span', '', words.vat));
    if (rateVariants[vehicleName]) outer.appendChild(node('div', 'fleet-price-variant', rateVariants[vehicleName]));
    [
      ['daily', words.daily, words.eightHours],
      ['monthly', words.monthly, ''],
      ['contract', words.contract, words.perMonth]
    ].forEach(([key, label, description]) => {
      const group = node('div', 'fleet-price-group');
      group.appendChild(title(label, description));
      group.appendChild(line(words.base, rates[key][0]));
      group.appendChild(line(words.driver, rates[key][1]));
      group.appendChild(line(words.fuel, rates[key][2]));
      outer.appendChild(group);
    });
    return outer;
  }

  function minibusPricing(vehicleName, cityPrice) {
    const outer = priceBox(vehicleName);
    outer.querySelector('.fleet-pricing-heading').append(node('span', '', words.twelveHours));
    const group = node('div', 'fleet-price-group fleet-price-group--compact');
    group.appendChild(line(words.city, cityPrice));
    group.appendChild(line(words.outside, null));
    group.appendChild(line(words.holiday, null));
    outer.append(group, node('p', 'fleet-pricing-footnote', words.groupNote));
    return outer;
  }

  document.querySelectorAll('#fleetGrid .fleet-card, #groupFleetGrid .fleet-card').forEach(card => {
    const name = card.querySelector('.fleet-body h3')?.textContent.trim();
    const specs = card.querySelector('.fleet-body .fleet-specs');
    if (!name || !specs) return;
    let pricing;
    if (Object.hasOwn(carPrices, name)) pricing = mpvPricing(name, carPrices[name]);
    else if (Object.hasOwn(minibusPrices, name)) pricing = minibusPricing(name, minibusPrices[name]);
    else {
      pricing = priceBox(name);
      pricing.appendChild(node('p', 'fleet-pricing-footnote fleet-pricing-footnote--inquire', words.inquire));
    }
    specs.insertAdjacentElement('afterend', pricing);
  });

  const groupGrid = document.getElementById('groupFleetGrid');
  if (groupGrid) {
    const general = node('aside', 'fleet-generic-rate');
    general.appendChild(node('h4', '', words.genericHiace));
    const details = node('p', '', `${words.twelveHours} · ${words.city}: ${currency(2500000)} · ${words.outside}: ${words.agreement} · ${words.holiday}: ${words.agreement}.`);
    general.append(details, node('p', 'fleet-generic-rate-note', words.genericNote));
    groupGrid.insertAdjacentElement('afterend', general);
  }

  const section = document.querySelector('section.fleet .container');
  if (section) section.appendChild(node('p', 'fleet-pricing-disclaimer', words.priceUpdate));
})();
