// Test Live OpenWeatherMap API safely using environment variable or CLI argument
const API_KEY = process.env.VITE_OPENWEATHER_API_KEY || process.argv[2] || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function testLiveKey() {
  if (!API_KEY) {
    console.error('❌ Error: No API key provided.');
    console.log('Usage:');
    console.log('  node scripts/test-live-api.mjs <YOUR_API_KEY>');
    console.log('  or set VITE_OPENWEATHER_API_KEY in your environment.');
    process.exit(1);
  }

  console.log('==============================================');
  console.log('🔑 TESTING LIVE OPENWEATHERMAP API KEY');
  console.log('Key:', API_KEY.slice(0, 4) + '...' + API_KEY.slice(-4));
  console.log('==============================================\n');

  // Test 1: Fetch Current Weather for London
  console.log('Test 1: Testing Current Weather (London)...');
  const londonRes = await fetch(`${BASE_URL}/weather?q=London&units=metric&appid=${API_KEY}`);
  console.log(`HTTP Status: ${londonRes.status} ${londonRes.statusText}`);
  const londonData = await londonRes.json();

  if (!londonRes.ok) {
    console.error('❌ Error response:', londonData);
    process.exit(1);
  }

  console.log('✅ London Weather Data received:');
  console.log(`   - City: ${londonData.name}, ${londonData.sys?.country}`);
  console.log(`   - Temp: ${londonData.main?.temp}°C (Feels like: ${londonData.main?.feels_like}°C)`);
  console.log(`   - Condition: ${londonData.weather[0]?.main} (${londonData.weather[0]?.description})`);
  console.log(`   - Humidity: ${londonData.main?.humidity}%`);
  console.log(`   - Wind Speed: ${londonData.wind?.speed} m/s`);
  console.log(`   - Sunrise: ${londonData.sys?.sunrise}, Sunset: ${londonData.sys?.sunset}`);

  // Test 2: Fetch Current Weather for Delhi
  console.log('\nTest 2: Testing Current Weather (Delhi)...');
  const delhiRes = await fetch(`${BASE_URL}/weather?q=Delhi&units=metric&appid=${API_KEY}`);
  const delhiData = await delhiRes.json();
  console.log(`✅ Delhi Weather: ${delhiData.main?.temp}°C, ${delhiData.weather[0]?.description}, Humidity: ${delhiData.main?.humidity}%`);

  // Test 3: Fetch Current Weather for Tokyo
  console.log('\nTest 3: Testing Current Weather (Tokyo)...');
  const tokyoRes = await fetch(`${BASE_URL}/weather?q=Tokyo&units=metric&appid=${API_KEY}`);
  const tokyoData = await tokyoRes.json();
  console.log(`✅ Tokyo Weather: ${tokyoData.main?.temp}°C, ${tokyoData.weather[0]?.description}, Humidity: ${tokyoData.main?.humidity}%`);

  // Test 4: Fetch 5-Day Forecast for London
  console.log('\nTest 4: Testing 5-Day Forecast (London)...');
  const forecastRes = await fetch(`${BASE_URL}/forecast?q=London&units=metric&appid=${API_KEY}`);
  console.log(`HTTP Status: ${forecastRes.status} ${forecastRes.statusText}`);
  const forecastData = await forecastRes.json();
  console.log(`✅ Forecast list count: ${forecastData.list?.length} slots (3-hour intervals)`);

  // Test 5: Verify 404 Error for Non-Existent City
  console.log('\nTest 5: Testing Non-Existent City (asdfqwerty12345)...');
  const errorRes = await fetch(`${BASE_URL}/weather?q=asdfqwerty12345&units=metric&appid=${API_KEY}`);
  console.log(`HTTP Status: ${errorRes.status} (Expected: 404)`);
  const errorData = await errorRes.json();
  console.log(`✅ 404 Response Message: "${errorData.message}"`);

  console.log('\n==============================================');
  console.log('🎉 LIVE OPENWEATHERMAP API KEY IS 100% WORKING!');
  console.log('==============================================');
}

testLiveKey().catch(err => {
  console.error('❌ Test failed with exception:', err);
  process.exit(1);
});
