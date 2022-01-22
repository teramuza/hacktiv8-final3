const toRupiah = (value) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
}).format(value);

module.exports = { toRupiah }
