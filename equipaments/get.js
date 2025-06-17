const fetch = require("node-fetch");
const fs = require("fs");

async function setBussinesInJsonFiles(i) {

  const response  = await fetch(`https://app.tiflux.com/equipment.json?page=${i}&name=&online=&order_by=&is_resource=`, {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "pt-BR,pt;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTA1NjM2OTUsImp0aSI6IjRlYzBmNGY4LTQ0ODgtNGVlNi05ODBjLTI0YjI2MzFiNGJjYyIsInN1YiI6IjY1MzciLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE3NDkzNTQwOTV9.YrVgBT0p5gBFucpW0ymEp8EQqP3lPLc2e6UNiiIjTE8",
    "if-none-match": "W/\"fe33aaf1844007841969f83b60fda742\"",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Microsoft Edge\";v=\"137\", \"Chromium\";v=\"137\", \"Not/A)Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": "elementor_split_test_client_id=6781b590-0ab0-49ae-a2eb-2923590c7092; _ga=GA1.1.2085699155.1741604589; _gcl_au=1.1.1046690512.1741604589; rdtrk=%7B%22id%22%3A%22102c054c-3d62-4d49-aafe-57e9ec35c19c%22%7D; intercom-device-id-p6mz6nt6=603a6c43-ee61-48e8-bb4b-52a7455d3b5f; _uetvid=54d06ee0003311f0b3944d188c742e04; __trf.src=encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiaHR0cHM6Ly93d3cuYmluZy5jb20vIiwiZXh0cmFfcGFyYW1zIjp7fX0sImN1cnJlbnRfc2Vzc2lvbiI6eyJ2YWx1ZSI6Iihub25lKSIsImV4dHJhX3BhcmFtcyI6e319LCJjcmVhdGVkX2F0IjoxNzQxODg4MDk1MDE4fQ==; _ga_EY9Q8KJXC2=GS1.1.1741890014.3.0.1741890014.60.0.0; cf_clearance=FQ9Cp16Ep7NTOYNot1Vgo4FR46nZLPqG89wHi9SlEgg-1749241675-1.2.1.1-QMz4B.YUICmx71ex0hkmEBEz2MgBlvjv0_cGUKpppMVnLBwpRjLvjovrDyOkOXTPloWVSTH0v9E8UtoJ0747wb2U_u.ZH0uKPzjcKfa7AwDn2qjwjxsmkeAKqYkLudnhgt.prv1g808ow.aKA2TrwtAdaRYhMXrW7Gs.sccDICZyM0NTytRSeOFhPjLJEBzvnviAebeEqfgRVx5GkNrJ4rFrjVl74aUFtZcPzOx1TMOi_IsAn_H9R1jgUQ8Z4A3cIxIk5FJRQgGuvVb8nygdx7mWFmZCeydXJwbcUo.IfEAfoWQnJZlJxk1aAwAiI5Szgw8eflc35oA1xqFFYY6jWiR7KJuQKXv7Hlzut_iBE54; %40Tiflux%3AAuthToken=Bearer%20eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NTA1NjM2OTUsImp0aSI6IjRlYzBmNGY4LTQ0ODgtNGVlNi05ODBjLTI0YjI2MzFiNGJjYyIsInN1YiI6IjY1MzciLCJzY3AiOiJ1c2VyIiwiYXVkIjpudWxsLCJpYXQiOjE3NDkzNTQwOTV9.YrVgBT0p5gBFucpW0ymEp8EQqP3lPLc2e6UNiiIjTE8; intercom-session-p6mz6nt6=dzVONXFkZDBzVWh6R1hkRUlHYmdJRmJLQXRXbDNOOHZFUVJhL0VpVGlRS1E4c1RFLzlMY0NFT2ZSNHJ4ME9WVWFIMWM3YU5oR0QxclQyOWFqVzJoVExIb1A4ajZZU2QwWm1hRy9yMHBZVkk9LS1zV2U2RXAzemVic3R2OUIybThpT2pnPT0=--801ca494d5198071e426018e8dc792cdfeae067e; _itm_session=OFNUdDFDN1I4bjREdDNOYmk2NDhGZjRLRTlsSEdxeW1VZHRnRk1HcnNNQUNhRlBEYzNvcXpZdE1rY1VpeUVvd1JYQys2MEllRkFtN09FNU1RaWk0MERpYkYwYlpRZ2J1QkVJL2paZExuYzNrZWRDSis2L2Z1RjlYZDBsZE9Fak9hSSs3MlRWaDBsalU0dWJwZ3hINlQyOERzdGIwMEdydW9YZzZzN3BGRVF1VElQOTRLNXZBazNzbktpVkpkb05QLS0zUmpVTkFNTUVLV0VZVzRXN3RlaTlBPT0%3D--279ccc6553d69f09d26a248639003229abbae370",
    "Referer": "https://app.tiflux.com/v/equipment",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

  const data = await response.json();
  await fs.promises.writeFile(`equipment-${i}.json`, JSON.stringify(data, null, 2));
  console.log(`Página ${i} salva`);
}

async function baixarTodos() {
  for (let i = 1; i <= 13; i++) {
    await setBussinesInJsonFiles(i);
  }
}

baixarTodos();
