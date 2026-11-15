'use strict';

const date = document.querySelector('#visit-date');
const refresh = document.querySelector('#refresh');
const currentTemperature = document.querySelector('#current-temperature');
const currentCondition = document.querySelector('#current-condition');
const forecastLabel = document.querySelector('#forecast-label');
const forecastTemperature = document.querySelector('#range');
const forecastCondition = document.querySelector('#forecast-condition');

const timeZone = 'Asia/Seoul';
const dateFormat = new Intl.DateTimeFormat('sv-SE', {
  timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
});
const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
forecastUrl.search = new URLSearchParams({
  latitude: '37.65',
  longitude: '127.68124',
  timezone: timeZone,
  current: 'temperature_2m,weather_code',
  daily: 'weather_code,temperature_2m_max,temperature_2m_min',
  forecast_days: '16'
});

const weatherNames = {
  0: '맑음', 1: '대체로 맑음', 2: '구름 조금', 3: '흐림',
  45: '안개', 48: '얼어붙는 안개', 51: '약한 이슬비', 53: '이슬비', 55: '강한 이슬비',
  56: '약한 어는 이슬비', 57: '강한 어는 이슬비', 61: '약한 비', 63: '비', 65: '강한 비',
  66: '약한 어는 비', 67: '강한 어는 비', 71: '약한 눈', 73: '눈', 75: '강한 눈',
  77: '싸락눈', 80: '약한 소나기', 81: '소나기', 82: '강한 소나기',
  85: '약한 눈 소나기', 86: '강한 눈 소나기', 95: '뇌우', 96: '약한 우박을 동반한 뇌우',
  99: '강한 우박을 동반한 뇌우'
};
let weather;
let loading = false;
let lastFetch = 0;

function temperature(value) {
  return Number.isFinite(value) ? Math.round(value) + '°C' : '—';
}

function renderForecast() {
  const selected = date.value;
  const today = dateFormat.format(new Date());
  const lastForecastDate = new Date(Date.parse(today) + 15 * 86_400_000).toISOString().slice(0, 10);
  const daily = weather?.daily;
  const index = daily?.time?.indexOf(selected) ?? -1;

  forecastLabel.textContent = selected.slice(5).replace('-', '.') + ' · 여행일 예보';
  forecastTemperature.textContent = '—';
  if (selected < today) {
    forecastCondition.textContent = '지난 일정';
  } else if (selected > lastForecastDate) {
    forecastCondition.textContent = '예보 제공 기간에 들어오면 표시됩니다.';
  } else if (index >= 0) {
    const low = temperature(daily.temperature_2m_min?.[index]);
    const high = temperature(daily.temperature_2m_max?.[index]);
    forecastTemperature.textContent = low + ' / ' + high;
    forecastCondition.textContent = weatherNames[daily.weather_code?.[index]] ?? '날씨 정보 없음';
  } else {
    forecastCondition.textContent = loading ? '여행일 예보 확인 중…' : '예보를 확인할 수 없습니다.';
  }
}

async function loadWeather() {
  if (loading) return;
  loading = true;
  refresh.disabled = true;
  currentCondition.textContent = '날씨 불러오는 중…';
  renderForecast();
  try {
    const response = await fetch(forecastUrl, { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Weather request failed');
    weather = await response.json();
    if (!weather.current) throw new Error('Current weather is missing');
    currentTemperature.textContent = temperature(weather.current.temperature_2m);
    currentCondition.textContent = weatherNames[weather.current.weather_code] ?? '날씨 정보 없음';
    lastFetch = Date.now();
  } catch {
    weather = undefined;
    currentTemperature.textContent = '—';
    currentCondition.textContent = '현재 날씨를 확인할 수 없습니다. 새로고침해 주세요.';
  } finally {
    loading = false;
    refresh.disabled = false;
    renderForecast();
  }
}

date.addEventListener('change', renderForecast);
refresh.addEventListener('click', loadWeather);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && Date.now() - lastFetch > 300_000) loadWeather();
});
loadWeather();
