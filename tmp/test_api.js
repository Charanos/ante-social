
async function test() {
  try {
    const resp = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=KES,KSH");
    const json = await resp.json();
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
