const botaoClicado = document.querySelector('.convert-button');
const currencyFromSelect = document.querySelector('#currency-from');
const currencyToSelect = document.querySelector('#currency-to');
const inputCurrency = document.querySelector('.input-currency');
const currencyValueToConvert = document.querySelector('.currency-value-to-convert');
const currencyValueConverted = document.querySelector('.currency-value');
const currencyNameFrom = document.querySelector('.currency-name-from');
const currencyNameTo = document.querySelector('.currency-name-to');
const currencyImgFrom = document.querySelector('.currency-img-from');
const currencyImgTo = document.querySelector('.currency-img-to');

const currencyInfo = {
    brl: { name: 'Real Brasileiro', img: '/assets/real.png', locale: 'pt-BR', currency: 'BRL' },
    usd: { name: 'Dólar Americano', img: '/assets/dolar.png', locale: 'en-US', currency: 'USD' },
    eur: { name: 'Euro', img: '/assets/euro.png', locale: 'de-DE', currency: 'EUR' },
    btc: { name: 'Bitcoin', img: '/assets/bitcoin.png', locale: 'en-US', currency: 'BTC' } // Assumindo que você tem bitcoin.png
};

const updateUI = () => {
    const from = currencyFromSelect.value;
    const to = currencyToSelect.value;

    currencyNameFrom.innerHTML = currencyInfo[from].name;
    currencyImgFrom.src = currencyInfo[from].img;

    currencyNameTo.innerHTML = currencyInfo[to].name;
    currencyImgTo.src = currencyInfo[to].img;

    inputCurrency.placeholder = formatValue(0, from).replace(/\d.*$/, '0.00');
};

const formatValue = (value, curr) => {
    if (curr === 'btc') {
        return `₿ ${value.toFixed(8)}`;
    }
    return new Intl.NumberFormat(currencyInfo[curr].locale, {
        style: 'currency',
        currency: currencyInfo[curr].currency
    }).format(value);
};

const convertValues = async () => {
    const inputValue = parseFloat(inputCurrency.value) || 0;
    const from = currencyFromSelect.value;
    const to = currencyToSelect.value;

    if (from === to) {
        currencyValueConverted.innerHTML = formatValue(inputValue, to);
        currencyValueToConvert.innerHTML = formatValue(inputValue, from);
        return;
    }

    const data = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
    const dataJson = await data.json();

    const rates = {
        usd: parseFloat(dataJson.USDBRL.bid),
        eur: parseFloat(dataJson.EURBRL.bid),
        btc: parseFloat(dataJson.BTCBRL.bid),
        brl: 1
    };

    const valueInBRL = inputValue * rates[from];
    const convertedValue = valueInBRL / rates[to];

    currencyValueToConvert.innerHTML = formatValue(inputValue, from);
    currencyValueConverted.innerHTML = formatValue(convertedValue, to);
};

currencyFromSelect.addEventListener('change', () => { updateUI(); convertValues(); });
currencyToSelect.addEventListener('change', () => { updateUI(); convertValues(); });
botaoClicado.addEventListener('click', convertValues);

updateUI();