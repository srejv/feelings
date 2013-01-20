
var sp = getSpotifyApi(1);
var models = sp.require('sp://import/scripts/api/models');
var player = models.player;

function fixSpotifyLinks() {

var tracks = [
        '3UPPGZeSjNwxyJslnSTm1c','74O6cjj9TiDMqSLnqTvIZr','5iynCtpEY7mx4ou54tHBPH',
        '4tsHKDi5kr9O3tMPnKjEKx',
        '269TXy0nskEBvKXXAaK6tR',
        '0NiWsk5oZgF5wKEMe2CieT',
        '18TxuM4mzTITH450Dt3Lx1',
        '756juKwBfFSyXV3x00xdDX',
        '5B92QIFU6zlXIanQflumXV',
        '6jbHMIDblAS6TKA1QhSvYh',
        '594ZHHcrh3PMrPKnXDYStG',
        '0eEXcw3JLVXcRxYrVYMy68',
        '6TpfIOupqYeCo6ua1RCoD9',
        '4PREkXFb8YawThmhZICrXR',
        '1G7rpMjaBTqczxxzJdHToF',
        '2s8nHtLgeN6N1FOjESACYN',
        '4jqZkcl8Nz2PhgJXvn1OVv',
        '12Hcz3Tl2qv6325yt1BuKA',
        '1RZahRrClZREl9d2xtGnUf',
        '7GfeYS1oNl3leZTZRG8R66',
        '5eMlSZnu2tBUlPeNPNThnQ',
        '3VeXQZSCjwtltch3FT6ItQ',
        '6aeaZNE7vuKDbjZFtSth5u',
        '6CCN3XGXEsNYgyR8RblAhy',
        '5uEPuh9CW67iXKZUnBHimw',
        '2jz7vSAguRJmBHEA4I6C4N',
        '6oTotS9Q6fqPeyFlIu4RJR',
        '32HNOqvWEvPg7hWxmCpHaW',
        '3uikCgGPTFHbWDSOrrBq5g',
        '6xY7eoBnOZharmyvUK0Bvo',
        '6f6mWgzOageUtoJbD7vRwD',
        '5ZPclTHeKSQiV0b1aIRJp9',
        '0c06RWCrrNoLBWBsFmMM76',
        '5TdAgcKS5HlxMcclStHODW',
        '2UVSP6BlF8AgQOpzfDUVL2',
        '2kmrLAiBGlWnPFoqGWioCK',
        '6HzWENHnvMe54zRfWzFGFq',
        '3EXvgTZAMHTe44FpMx8O3S',
        '1mUpXELX93AvTswzLLY0UT',
        '3Ukf2oQRQYUDGL0JK5UR2r',
        '6chyadaFmcdgpfSDW31KVj',
        '4V76i1z71d4QkSTevsaJTd',
        '4nqN0p0FjfH39G3hxeuKad',
        '46LwAOzg3UYvxiXyyaFedz',
        '4qyOZlxj64eX7xHI9gEgl7',
        '4dRXyHejeOFlSNJ5cDe5MW',
        '2QhqW90HLjHnAxdSXJQl1x',
        '1PYDKoywc95FqbEZZkzd55',
        '4DagZHq2NslXErKEnAhp92',
        '2NKrESdJxD7DNDybzDIiBg',
        '7IO2XnvextsnQhpGRGLftc',
        '49YxS2Ap2eSbtdT0xacCE6',
        '1QCDkPNiWPBebMuTpjmuIg',
        '1xRCmlU2GyzGem2vw4glxK',
        '4dVYM5ds4vC3HNzcBpExUD',
        '20Ns9LkH2b2MmFZ2Wb19wF',
        '0EvhwkgOCntSD7spDma9Z9',
        '12echR1j6gj17Y6t98HdSl',
        '5D6kMtX10YRba8GfHBQWiQ',
        '6jdTbGwLgmgzNjfGRmveCV',
        '0FSyEU14JhIvMCU9MIb0WC',
        '1dQtyauCNa9QhnFdXSee7E',
        '4zlA7mAtga4VJ5eR50UI9K',
        '7uTkX7CahPFqcMevMCCat4',
        '0yoU61HfyDtiR4LHWRtfe9',
        '0ktKImJjoL2qzrosNMcLUs',
        '4YDUfVuJ87SnB2SgmLUgdZ',
        '7gJbHzI6VONlM3aWgIo4P3',
        '5b9Wb81eoq9zezyUIft3wh',
        '20smDNHUwCBiu8zbSJ2cwK',
        '2sR4jxhOEHlS0RSyWtT0zm',
        '3cMx6TvjyX0DHUqR8KwHas',
        '4ZRW5BsjuqO5osXHdKP54V',
        '4ptSL1o2pRgNvrC4wsN1Pl',
        '3bpSd69qmIfQwUVBDA0P8X',
        '5nRRklOTvmgf8H3B9DrfYP',
        '03HwmxQ8w8gH1qU6BlmDrK',
        '72R9Dd3mEL7JRNpUAEEAN8',
        '08UE8HPlMdwEkBNym6HRjA',
        '2FtKuCNf6dVnDa4J044ATt',
        '60oAVWRyoQhMH9lGdc7990',
        '7BifhsYeujLMzl68HNolEY',
        '4HrDG0cRX8D42VoKY9lZul',
        '5NZpDXdXQAWzK35gD25s5u',
        '1DdYVh9hQw7VXOkDgxHEQk',
        '6Ta6bDeifGSiGFtv6Osdos',
        '60S6fr9fz1mQZmiCOioI6y',
        '03lVVDeHqoQZKBGTYZbZO5',
        '0JJuJLU8m3EczSQPkzULeh',
        '1kGwrPcZ6i3liNI6t0yZa9',
        '0X4e5871CT2bR4BLrMv8hZ',
        '5b4kj4nlfC0t6ykN4h1EWJ',
        '1BmEbVyrLJSzcEZ1ZN4fl9',
        '4vq8fEjeBE7gczue9Ow95x',
        '5kQf33aiP0YoVyrHJj8Xee',
        '3TwLLkYeytdArpZe9Ke1Ko',
        '2B7QH9CFnOnkWNfkEz1EzP',
        '505adiMkMfo80cg6HJtmWT',
        '7gzkIJoMbqQaEfkpMdJMfB',
        '0GQE8krP5zgaQQFakKZqSD',
        '05aZ2boQ1yuAD4p4HyORbK',
        '4m3gxoAguorjKhon1lclXI',
        '5BKPRv5WYtUnWf0ScSF1x2',
        '404TEhmFoA1bhMUFaQQgzI',
        '1LdvtGAngTr5VcT7DgIgDo',
        '7fCAC5LInJuO7Z36XN5ImU',
        '3H1WufSXLnOPckdJnFDbtF',
        '58wKEgHVhZxF84Oqx1hElK',
        '28v2GkLXfTH1yo8jPaeHpW',
        '2860c7PdeIw8oCdahRIK0f',
        '73NlTbeyy4qXaGgf0UNTH4',
        '2VdpQDHJHqtNhWMsRSnlGr',
        '7AJWGxRUHmyB45VwkC3LwY',
        '0AGgUnniaBt9Y7jTPz39EU',
        '4YU98ttc4vtzbnvQOeHRx7',
        '09hctAvAEUpm7MKl1RBK2j',
        '0mOZJAXbRHvS14Nqog2263',
        '60lJZ6OLKBWu8ZdNUZZjmm',
        '2vtL3x34yfUm2QXs3kSXgO',
        '6iY0Gf7hjzSJokDJQwpQ4E',
        '3zAbpbcp73sT2zXABdm6w7',
        '0eG9ubk1xDlI2Dvy9a1GZi',
        '1MB4msdVfQZB1rUPsXsbDp',
        '6EFza3u4Vai4BFSG4dYcgg',
        '16LdXsAeRrkPRrd60s6X3q'
];




$('.gridtrack').each(function(i,e) {

        var single_track = models.Track.fromURI('spotify:track:'+tracks[i]);
        var img = new Image();
        img.src = single_track.image;
        img.width = 84;
        img.height = 84;
        e.appendChild(img);
        $(this).attr('uri', tracks[i]);
});
}

$(document).ready(function() {
        fixSpotifyLinks();

        $('.gridtrack').click(function() {
                
                
                var track = $(this).attr('uri');
                console.log(track);
                player.play('spotify:track:' + track);
        });
});
