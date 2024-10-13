export async function fetchBtcPrice(): Promise<number> {
  const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return parseFloat(data.bpi.USD.rate.replace(',', ''));
}
