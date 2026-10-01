// Comprehensive Test Suite for SkyPulse Weather Dashboard
import {
  fetchCurrentWeather,
  fetchWeatherForecast,
  formatLocalTime,
  formatLocalDate,
  getDaylightProgress,
  getWindDirection,
  getWeatherTheme,
  setDemoModeActive,
  setStoredApiKey
} from '../src/services/weatherService.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✅ PASSED: ${message}`);
  passedTests++;
}

async function runTestSuite() {
  console.log('\n========================================');
  console.log('🧪 RUNNING COMPREHENSIVE WEATHER TESTS');
  console.log('========================================\n');

  // Activate Demo Mode for deterministic mock testing
  setDemoModeActive(true);

  // 1. Test City Search for Multiple Global Cities
  console.log('--- TEST GROUP 1: GLOBAL CITIES SEARCH ---');
  const testCities = ['London', 'Tokyo', 'Delhi', 'New York', 'Paris', 'Sydney'];
  
  for (const city of testCities) {
    const data = await fetchCurrentWeather(city, 'metric');
    assert(data.city.toLowerCase() === city.toLowerCase(), `City search for "${city}" returns valid city name: ${data.city}`);
    assert(typeof data.temp === 'number', `${city} has numeric temperature: ${data.temp}°C`);
    assert(data.humidity >= 0 && data.humidity <= 100, `${city} has valid humidity: ${data.humidity}%`);
    assert(data.windSpeed >= 0, `${city} has valid wind speed: ${data.windSpeed} km/h`);
    assert(data.icon && data.icon.length >= 3, `${city} has weather icon: ${data.icon}`);
    assert(data.sunrise > 0 && data.sunset > 0, `${city} has valid sunrise (${data.sunrise}) and sunset (${data.sunset}) timestamps`);
  }

  // 1b. Test Any Custom City Search (dynamic generation)
  console.log('\n--- TEST GROUP 1b: ANY DYNAMIC CITY SEARCH ---');
  const customCities = ['Berlin', 'Cairo', 'Toronto', 'Singapore', 'Reykjavik'];
  for (const city of customCities) {
    const data = await fetchCurrentWeather(city, 'metric');
    assert(data.city.toLowerCase() === city.toLowerCase(), `Dynamic city search works for "${city}" -> got ${data.city}`);
    assert(typeof data.temp === 'number', `${city} dynamically generated temperature: ${data.temp}°C`);
  }

  // 2. Test Error Cases
  console.log('\n--- TEST GROUP 2: ERROR CASES ---');
  // 2a. Non-existent city name
  try {
    await fetchCurrentWeather('asdfqwerty12345', 'metric');
    assert(false, 'Should have thrown error for non-existent city "asdfqwerty12345"');
  } catch (err) {
    assert(err.message.includes('not found'), `Non-existent city caught with 404 message: "${err.message}"`);
  }

  // 2b. Empty search query
  try {
    await fetchCurrentWeather('', 'metric');
    assert(false, 'Should have thrown error for empty city');
  } catch (err) {
    assert(err.message.includes('enter a city'), `Empty query caught with prompt: "${err.message}"`);
  }

  // 2c. Invalid / Missing API key in live mode
  try {
    setDemoModeActive(false);
    setStoredApiKey('');
    await fetchCurrentWeather('London', 'metric', '');
    assert(false, 'Should have thrown error for missing API key');
  } catch (err) {
    assert(err.message.toLowerCase().includes('api key'), `Missing API key caught with error: "${err.message}"`);
  } finally {
    setDemoModeActive(true); // reset
  }

  // 3. Test Unit Conversion (°C <-> °F)
  console.log('\n--- TEST GROUP 3: °C / °F CONVERSION ---');
  const delhiC = await fetchCurrentWeather('Delhi', 'metric');
  const delhiF = await fetchCurrentWeather('Delhi', 'imperial');
  const expectedF = Math.round((delhiC.temp * 9) / 5 + 32);
  assert(delhiF.temp === expectedF, `Delhi temperature conversion: ${delhiC.temp}°C -> ${delhiF.temp}°F (expected: ${expectedF}°F)`);
  assert(delhiF.windSpeed === Math.round(delhiC.windSpeed * 0.621371), `Wind speed converted from km/h (${delhiC.windSpeed}) to mph (${delhiF.windSpeed})`);

  // 4. Test Sunrise & Sunset Local Timezone Calculations
  console.log('\n--- TEST GROUP 4: SUNRISE / SUNSET TIMEZONE CALCULATIONS ---');
  const timezonesToTest = [
    { city: 'London', tz: 3600, label: 'UTC+1' },
    { city: 'Delhi', tz: 19800, label: 'UTC+5:30' },
    { city: 'Tokyo', tz: 32400, label: 'UTC+9' },
    { city: 'New York', tz: -14400, label: 'UTC-4' }
  ];

  for (const item of timezonesToTest) {
    const data = await fetchCurrentWeather(item.city, 'metric');
    const localSunrise = formatLocalTime(data.sunrise, data.timezoneOffset);
    const localSunset = formatLocalTime(data.sunset, data.timezoneOffset);
    const progress = getDaylightProgress(data.sunrise, data.sunset, data.timezoneOffset);

    assert(localSunrise.includes('AM') || localSunrise.includes('PM'), `${item.city} local sunrise formatted correctly: ${localSunrise}`);
    assert(localSunset.includes('AM') || localSunset.includes('PM'), `${item.city} local sunset formatted correctly: ${localSunset}`);
    assert(progress >= 0 && progress <= 100, `${item.city} daylight progress in range [0, 100]: ${progress}%`);
  }

  // 5. Test 5-Day & Hourly Forecast
  console.log('\n--- TEST GROUP 5: 5-DAY & HOURLY FORECAST ---');
  const forecast = await fetchWeatherForecast('Tokyo', 'metric');
  assert(forecast.daily && forecast.daily.length === 5, `Tokyo 5-day forecast contains 5 days (received ${forecast.daily.length})`);
  assert(forecast.hourly && forecast.hourly.length === 8, `Tokyo hourly forecast contains 8 interval slots (received ${forecast.hourly.length})`);
  assert(typeof forecast.daily[0].maxTemp === 'number', `Daily forecast has numeric maxTemp: ${forecast.daily[0].maxTemp}°C`);
  assert(typeof forecast.hourly[0].pop === 'number', `Hourly forecast has precipitation probability: ${forecast.hourly[0].pop}%`);

  // 6. Test Wind Direction & Weather Themes
  console.log('\n--- TEST GROUP 6: WIND DIRECTION & WEATHER THEMES ---');
  assert(getWindDirection(0) === 'N', 'Wind deg 0° maps to N');
  assert(getWindDirection(90) === 'E', 'Wind deg 90° maps to E');
  assert(getWindDirection(180) === 'S', 'Wind deg 180° maps to S');
  assert(getWindDirection(270) === 'W', 'Wind deg 270° maps to W');

  const sunnyTheme = getWeatherTheme(800, '01d');
  assert(sunnyTheme.name === 'Sunny Clear', `Theme for 800 clear is ${sunnyTheme.name}`);
  const rainTheme = getWeatherTheme(500, '10d');
  assert(rainTheme.name === 'Rainy', `Theme for 500 rain is ${rainTheme.name}`);
  const nightTheme = getWeatherTheme(800, '01n');
  assert(nightTheme.name === 'Night Sky', `Theme for night is ${nightTheme.name}`);

  console.log('\n========================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED SUCCESSFULLY!`);
  console.log('========================================\n');
}

runTestSuite().catch(err => {
  console.error('\n❌ Test suite execution error:', err);
  process.exit(1);
});
