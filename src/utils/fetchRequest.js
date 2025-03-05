import settings from '../../settings';

if (!settings?.server) {
    console.log('utils/fetchRequest - Missing  settings.server');
    return null;
}

if (!settings.server.host) {
    console.log('utils/fetchRequest - Missing  settings.server.host');
    return null;
}

if (!settings.server.port) {
    console.log('utils/fetchRequest - Missing  settings.server.port');
    return null;
}

const { host, port} = settings.server;

const SERVER_HOST = host;
const SERVER_PORT = port;

export async function fetchData(endpoint, options = {}) {
    try {
        const url = `${SERVER_HOST}:${SERVER_PORT}${endpoint}`;
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export default fetchRequest;