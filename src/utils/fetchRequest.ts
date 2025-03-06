

export async function fetchData(endpoint: string, options = {}) {
    // if (!APP_CONFIG?.server) {
    //     console.log('utils/fetchRequest - Missing  APP_CONFIG.server');
    //     return null;
    // }

    const host = 'localhost';
    const port = '8080';

    // const { host, port } = APP_CONFIG.server;

    // if (!host) {
    //     console.log('utils/fetchRequest - Missing  APP_CONFIG.server.host');
    //     return null;
    // }
    
    // if (!port) {
    //     console.log('utils/fetchRequest - Missing  APP_CONFIG.server.port');
    //     return null;
    // }

    try {
        const url = `http://${host}:${port}/${endpoint}`;
        
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

export default fetchData;