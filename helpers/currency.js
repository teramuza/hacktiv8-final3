const toRupiah = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 9,
}).format(value);

module.exports = { toRupiah }
